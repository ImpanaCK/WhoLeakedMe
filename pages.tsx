import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { 
    Card, Input, Button, Spinner, RiskScoreGauge, DataExposurePieChart, BreachesTimelineChart,
    ShieldCheckIcon, AlertTriangleIcon, SearchIcon, LockClosedIcon, UserCircleIcon, ToggleSwitch
} from './components';
import { scanForBreaches, checkPwnedPassword, getAIChatResponse } from './services';
import { ScanResult, Breach, PwnedPasswordResult, ChatMessage, DataBroker, RecommendedAction, RiskLevel, UserProfile } from './types';
import { DATA_BROKERS, MOCK_BREACHES } from './constants';


// --- Custom Hooks ---

const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
};


// --- Page Components ---

export const HomePage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleScan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setIsLoading(true);
        // We pass the query in the state object during navigation
        navigate('/results', { state: { query } });
    };

    return (
        <div className="text-center py-16">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <ShieldCheckIcon className="mx-auto h-16 w-16 text-accent-blue" />
                <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold text-light-text tracking-tight">Protect Your Digital Identity.</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-medium-text">
                    Enter your email, phone, or username to discover if your personal information has been exposed in a data breach.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-10 max-w-xl mx-auto"
            >
                <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-4">
                    <Input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter email, phone, or username"
                        className="flex-grow"
                    />
                    <Button type="submit" disabled={isLoading} className="flex items-center justify-center gap-2">
                         {isLoading ? <Spinner /> : <><SearchIcon className="h-5 w-5" /> Check My Exposure</>}
                    </Button>
                </form>
            </motion.div>
        </div>
    );
};

const BreachCard: React.FC<{ breach: Breach }> = ({ breach }) => (
    <Card className="mb-4 border-l-4 border-red-500">
        <h3 className="text-xl font-bold text-red-400">{breach.name}</h3>
        <p className="text-sm text-medium-text">Breached on: {breach.breachDate} | Domain: {breach.domain}</p>
        <p className="mt-2 text-light-text">{breach.description}</p>
        <div className="mt-4">
            <h4 className="font-semibold text-light-text">Exposed Data:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
                {breach.dataClasses.map(dc => (
                    <span key={dc} className="px-2 py-1 bg-red-500/10 text-red-400 text-xs font-medium rounded-full">{dc}</span>
                ))}
            </div>
        </div>
    </Card>
);

const ActionCard: React.FC<{ action: RecommendedAction }> = ({ action }) => {
    const priorityColors = {
        High: 'border-red-500 bg-red-500/10',
        Medium: 'border-yellow-500 bg-yellow-500/10',
        Low: 'border-green-500 bg-green-500/10'
    };
    return (
        <Card className={`border-l-4 ${priorityColors[action.priority]}`}>
            <h4 className="font-bold text-lg text-light-text">{action.title}</h4>
            <p className="text-medium-text mt-1">{action.description}</p>
        </Card>
    );
};

export const ResultsPage: React.FC = () => {
    const [result, setResult] = useState<ScanResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const query = location.state?.query;
        if (query) {
            scanForBreaches(query).then(data => {
                setResult(data);
                setIsLoading(false);
            });
        } else {
            // Handle case where user lands here directly
            setIsLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.state?.query]);

    if (isLoading) {
        return <div className="py-16"><Spinner /></div>;
    }

    if (!result || !location.state?.query) {
        return <div className="text-center py-16"><p>No scan initiated. Please return to the homepage.</p></div>
    }

    const { breaches, risk, actions } = result;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold mb-2">Scan Results for <span className="text-accent-blue">{result.query}</span></h1>
            <p className="text-medium-text mb-8">Here's a summary of your data exposure based on public breach records.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex flex-col items-center">
                    <Card className="w-full text-center">
                        <h2 className="text-xl font-bold mb-4 text-light-text">Privacy Risk Score</h2>
                        <RiskScoreGauge score={risk.score} level={risk.level} />
                        <p className="mt-4 text-medium-text">{risk.details}</p>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <h2 className="text-2xl font-bold mb-4 text-light-text">Recommended Actions</h2>
                    <div className="space-y-4">
                        {actions.map(action => <ActionCard key={action.id} action={action} />)}
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4 text-light-text">Breach Details ({breaches.length} found)</h2>
                {breaches.length > 0 ? (
                     breaches.map((breach, index) => <BreachCard key={index} breach={breach} />)
                ) : (
                    <Card>
                        <div className="text-center py-8">
                            <ShieldCheckIcon className="mx-auto h-12 w-12 text-green-500" />
                            <h3 className="mt-2 text-xl font-medium text-light-text">No Breaches Found!</h3>
                            <p className="mt-1 text-medium-text">We didn't find any public breaches associated with your query. Stay vigilant!</p>
                        </div>
                    </Card>
                )}
            </div>
        </motion.div>
    );
};

export const DashboardPage: React.FC = () => {
    // In a real app, this data would come from a user's account
    const [breaches] = useState<Breach[]>(() => MOCK_BREACHES.filter(() => Math.random() > 0.3));

    return (
         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold mb-8 text-light-text">Privacy Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card><h3 className="font-bold text-medium-text">Total Breaches</h3><p className="text-3xl font-bold text-red-500">{breaches.length}</p></Card>
                <Card><h3 className="font-bold text-medium-text">Accounts Monitored</h3><p className="text-3xl font-bold text-accent-blue">3</p></Card>
                <Card><h3 className="font-bold text-medium-text">Privacy Grade</h3><p className="text-3xl font-bold text-yellow-500">C+</p></Card>
                <Card><h3 className="font-bold text-medium-text">Resolved Alerts</h3><p className="text-3xl font-bold text-green-500">8</p></Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                 <Card>
                    <h2 className="text-xl font-bold mb-4 text-light-text">Breaches Over Time</h2>
                    <BreachesTimelineChart breaches={breaches} />
                </Card>
                <Card>
                    <h2 className="text-xl font-bold mb-4 text-light-text">Exposed Data Types</h2>
                    <DataExposurePieChart breaches={breaches} />
                </Card>
            </div>
         </motion.div>
    );
};

export const PasswordSafetyPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<PwnedPasswordResult | null>(null);
    const [error, setError] = useState('');

    const handleCheck = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResult(null);
        try {
            const data = await checkPwnedPassword(password);
            setResult(data);
        } catch (err) {
            setError('Could not check password. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="max-w-2xl mx-auto">
                <div className="text-center">
                    <LockClosedIcon className="mx-auto h-12 w-12 text-accent-blue" />
                    <h1 className="text-3xl font-bold mt-4 text-light-text">Password Safety Checker</h1>
                    <p className="text-medium-text mt-2">Check if your password has appeared in a data breach. Your password is never sent to us or any third party.</p>
                </div>
                
                <Card className="mt-8">
                     <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-4">
                         <Input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter a password to check"
                            className="flex-grow"
                        />
                        <Button type="submit" disabled={isLoading}>
                             {isLoading ? 'Checking...' : 'Check Password'}
                        </Button>
                    </form>
                </Card>

                <AnimatePresence>
                {result && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        {result.isPwned ? (
                            <Card className="mt-6 border-l-4 border-red-500 bg-red-500/10">
                                <div className="flex items-center gap-4">
                                    <AlertTriangleIcon className="h-10 w-10 text-red-500"/>
                                    <div>
                                        <h3 className="text-xl font-bold text-red-400">Oh no — pwned!</h3>
                                        <p className="text-red-300">This password has been seen <span className="font-bold">{result.count.toLocaleString()}</span> times before. You should not use this password.</p>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                             <Card className="mt-6 border-l-4 border-green-500 bg-green-500/10">
                                <div className="flex items-center gap-4">
                                    <ShieldCheckIcon className="h-10 w-10 text-green-500"/>
                                    <div>
                                        <h3 className="text-xl font-bold text-green-400">Good news — no pwnage found!</h3>
                                        <p className="text-green-300">This password wasn't found in any of the Pwned Passwords data sets.</p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </motion.div>
                )}
                </AnimatePresence>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </motion.div>
    );
};

export const AIAssistantPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', role: 'model', text: 'Hello! I am your AI Privacy Assistant. How can I help you understand your data exposure or improve your online security today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const responseText = await getAIChatResponse(messages, input);
        
        const modelMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
        setMessages(prev => [...prev, modelMessage]);
        setIsLoading(false);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="flex flex-col h-[75vh]">
            <h1 className="text-3xl font-bold mb-4 text-center text-light-text">AI Privacy Assistant</h1>
            <Card className="flex-grow flex flex-col">
                <div className="flex-grow overflow-y-auto pr-4 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <ShieldCheckIcon className="h-8 w-8 text-accent-blue flex-shrink-0" />}
                            <div className={`px-4 py-2 rounded-2xl max-w-lg ${msg.role === 'user' ? 'bg-accent-blue text-dark-bg rounded-br-none' : 'bg-gray-700 text-light-text rounded-bl-none'}`}>
                                <p style={{whiteSpace: 'pre-wrap'}}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2 justify-start">
                             <ShieldCheckIcon className="h-8 w-8 text-accent-blue flex-shrink-0" />
                            <div className="px-4 py-2 rounded-2xl bg-gray-700">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-medium-text rounded-full animate-pulse"></span>
                                    <span className="w-2 h-2 bg-medium-text rounded-full animate-pulse delay-75"></span>
                                    <span className="w-2 h-2 bg-medium-text rounded-full animate-pulse delay-150"></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="mt-4 pt-4 border-t border-accent-blue/20">
                    <div className="flex gap-2">
                        <Input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Ask about a breach or for privacy tips..." onKeyDown={e => e.key === 'Enter' && !isLoading && handleSend()}/>
                        <Button onClick={handleSend} disabled={isLoading}>Send</Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

const resourcesData = [
    { 
        id: 'strong-password',
        title: 'How to Create a Strong Password', 
        description: 'Learn the principles of creating passwords that are hard to crack but easy to remember.',
        content: `A strong password is your first line of defense against unauthorized access to your personal and financial information. Here are the key principles for creating a robust password:\n\n1. **Length Over Complexity:** A longer password is significantly harder to crack. Aim for at least 12-16 characters. A short, complex password like "P@ssw0rd!" is weaker than a long passphrase like "correct-horse-battery-staple".\n\n2. **Use a Mix of Characters:** Include uppercase letters, lowercase letters, numbers, and symbols (e.g., !, @, #, $). This increases the number of possible combinations an attacker would have to guess.\n\n3. **Avoid Personal Information:** Never use easily guessable information like your name, birthday, pet's name, or common words like "password" or "123456".\n\n4. **Create Unique Passwords for Each Account:** Reusing passwords across different services is a major security risk. If one site is breached, attackers will use your stolen password to try to access your other accounts.\n\n5. **Use a Password Manager:** It's impossible to remember dozens of unique, complex passwords. A password manager securely stores all your passwords and can generate strong ones for you. You only need to remember one master password.`
    },
    { 
        id: '2fa',
        title: 'Understanding Two-Factor Authentication (2FA)', 
        description: 'A comprehensive guide on what 2FA is, why you need it, and how to set it up.',
        content: `Two-Factor Authentication (2FA) adds a crucial second layer of security to your online accounts. It requires two different types of information to verify your identity, making it much harder for attackers to gain access even if they steal your password.\n\n**How it Works:**\n2FA combines something you know (your password) with something you have (like your phone) or something you are (like your fingerprint).\n\n**Common 2FA Methods:**\n- **SMS Codes:** A code is sent to your phone via text message. This is common but can be vulnerable to SIM-swapping attacks.\n- **Authenticator Apps:** Apps like Google Authenticator, Authy, or Microsoft Authenticator generate a time-sensitive code on your device. This is more secure than SMS.\n- **Hardware Keys:** A physical device (like a YubiKey) that you plug into your computer's USB port. This is the most secure form of 2FA.\n\n**Why You Should Use It:**\nEven the strongest password can be compromised in a data breach. 2FA acts as a backup, ensuring that even with your password, an attacker can't log in without access to your second factor.`
    },
    { 
        id: 'phishing',
        title: 'Spotting Phishing Scams', 
        description: 'Learn to identify fraudulent emails and messages to protect your accounts from being compromised.',
        content: `Phishing is a type of social engineering attack where attackers trick you into revealing sensitive information (like passwords or credit card numbers) by disguising themselves as a trustworthy entity.\n\n**Common Red Flags:**\n- **Urgent or Threatening Language:** Messages that create a sense of panic, such as "Your account will be suspended" or "Suspicious activity detected."\n- **Generic Greetings:** Vague greetings like "Dear Customer" instead of your actual name.\n- **Poor Grammar and Spelling:** Legitimate companies usually have professional communications without obvious errors.\n- **Suspicious Links or Attachments:** Hover over links to see the actual URL before clicking. Be wary of unexpected attachments, especially .zip or .exe files.\n- **Requests for Personal Information:** Legitimate organizations will rarely ask for your password, Social Security number, or bank details via email.\n\n**What to Do:**\nIf you suspect a message is a phishing attempt, do not click any links or download attachments. Report the message as spam or phishing and delete it immediately.`
    },
    { 
        id: 'vpn',
        title: 'A Guide to VPNs', 
        description: 'Discover how Virtual Private Networks (VPNs) can protect your privacy online.',
        content: `A Virtual Private Network (VPN) is a service that protects your internet connection and privacy online. It creates an encrypted tunnel for your data, protects your online identity by hiding your IP address, and allows you to use public Wi-Fi hotspots safely.\n\n**How a VPN Works:**\nA VPN routes your device's internet connection through a private server rather than your internet service provider (ISP). This means that when your data is transmitted to the internet, it comes from the VPN rather than your computer. This masks your IP address and encrypts your data, making it unreadable to anyone who might be intercepting it.\n\n**Key Benefits:**\n- **Enhanced Security:** The encryption provided by a VPN protects your data from hackers, especially on public Wi-Fi networks.\n- **Improved Privacy:** A VPN hides your real IP address, preventing websites, advertisers, and your ISP from tracking your online activities.\n- **Accessing Geo-Restricted Content:** You can connect to servers in different countries to access content that might not be available in your region.\n\nChoosing a reputable VPN provider with a strict no-logs policy is crucial for ensuring your privacy is actually protected.`
    },
];

export const ResourcesPage: React.FC = () => {
    const [selectedResource, setSelectedResource] = useState<(typeof resourcesData)[0] | null>(null);

    return (
        <div>
            <AnimatePresence mode="wait">
                {selectedResource ? (
                    <motion.div
                        key="resource-detail"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Button
                            onClick={() => setSelectedResource(null)}
                            className="mb-8 bg-dark-card text-light-text hover:bg-accent-blue/20 focus:ring-accent-blue"
                        >
                            &larr; Back to Resources
                        </Button>
                        <Card>
                            <h1 className="text-3xl font-bold text-accent-blue mb-4">{selectedResource.title}</h1>
                            <div className="text-medium-text leading-relaxed space-y-4" style={{ whiteSpace: 'pre-wrap' }}>
                                {selectedResource.content}
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="resource-list"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-3xl font-bold mb-8 text-center">Privacy Resources</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {resourcesData.map(res => (
                                <motion.div
                                    key={res.id}
                                    whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 191, 255, 0.1), 0 4px 6px -2px rgba(0, 191, 255, 0.05)' }}
                                    transition={{ duration: 0.2 }}
                                    className="cursor-pointer h-full"
                                    onClick={() => setSelectedResource(res)}
                                >
                                    <Card className="h-full flex flex-col transition-all duration-200 border-accent-blue/20 hover:border-accent-blue/50">
                                        <h3 className="text-xl font-bold text-light-text">{res.title}</h3>
                                        <p className="mt-2 text-medium-text flex-grow">{res.description}</p>
                                        <span className="text-accent-blue font-semibold mt-4 inline-block">
                                            Read More &rarr;
                                        </span>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


export const TakedownCenterPage: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('gdpr');
    const [isScanning, setIsScanning] = useState(false);
    const [scanResults, setScanResults] = useState<DataBroker[]>([]);
    const [scanInitiated, setScanInitiated] = useState(false);
    
    const templates = {
        gdpr: `Subject: Data Deletion Request under GDPR Article 17

Dear [Company Name] Data Protection Officer,

I am writing to request the immediate and complete erasure of my personal data from your systems, in accordance with my right to erasure under Article 17 of the General Data Protection Regulation (GDPR).

My personal details associated with your service are:
- Name: [Your Name]
- Email: [Your Email]
- Username: [Your Username, if applicable]

Please confirm once my data has been permanently deleted.

Sincerely,
[Your Name]`,
        ccpa: `Subject: Request to Delete My Personal Information under CCPA

Dear [Company Name],

As a California resident, I am exercising my right to request the deletion of my personal information under the California Consumer Privacy Act (CCPA).

Please delete all personal information you have collected about me. My identifying information is:
- Name: [Your Name]
- Email: [Your Email]
- Address: [Your Address]

Please confirm in writing that you have complied with this request.

Thank you,
[Your Name]`
    };

    const handleScanBrokers = () => {
        setIsScanning(true);
        setScanInitiated(true);
        setTimeout(() => {
            // Simulate finding brokers by randomly filtering the list
            const foundBrokers = DATA_BROKERS.filter(() => Math.random() > 0.3);
            setScanResults(foundBrokers);
            setIsScanning(false);
        }, 1500);
    };

    const handleRemovalRequest = (brokerName: string) => {
        alert(`Initiating removal process for ${brokerName}. In a real app, this would guide you through the next steps or automate the request.`);
    };
    
    const difficultyColors: { [key: string]: string } = {
        Easy: 'bg-green-500/10 text-green-400',
        Medium: 'bg-yellow-500/10 text-yellow-400',
        Hard: 'bg-red-500/10 text-red-400',
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold mb-2 text-center">Takedown Request Center</h1>
            <p className="text-medium-text mb-8 text-center max-w-3xl mx-auto">Reclaim your privacy by requesting data removal from breached companies and data brokers.</p>
            
            <Card className="mb-8">
                 <h2 className="text-2xl font-bold mb-4 text-accent-blue">1. Breach Takedown Templates</h2>
                <p className="text-medium-text mb-4">Use these templates to formally request companies to delete your data under privacy laws like GDPR and CCPA.</p>
                <div className="flex justify-center border-b border-accent-blue/20 mb-4">
                    <button onClick={() => setSelectedTemplate('gdpr')} className={`px-4 py-2 font-semibold transition-colors ${selectedTemplate === 'gdpr' ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-medium-text'}`}>GDPR (Europe)</button>
                    <button onClick={() => setSelectedTemplate('ccpa')} className={`px-4 py-2 font-semibold transition-colors ${selectedTemplate === 'ccpa' ? 'text-accent-blue border-b-2 border-accent-blue' : 'text-medium-text'}`}>CCPA (California)</button>
                </div>
                <pre className="bg-dark-bg p-4 rounded-lg whitespace-pre-wrap text-sm font-mono text-light-text">{templates[selectedTemplate as keyof typeof templates]}</pre>
                <Button onClick={() => navigator.clipboard.writeText(templates[selectedTemplate as keyof typeof templates])} className="mt-4">Copy Template</Button>
            </Card>

            <Card>
                <h2 className="text-2xl font-bold mb-4 text-accent-blue">2. Data Broker Scanner</h2>
                {!scanInitiated && (
                    <div className="text-center py-4">
                        <p className="text-medium-text mb-4">Data brokers collect and sell your personal information from public sources. Scan to find which brokers may have your data.</p>
                        <Button onClick={handleScanBrokers} className="flex items-center justify-center mx-auto">
                           <SearchIcon className="h-5 w-5 mr-2"/> Scan Public Records for Data Brokers
                        </Button>
                    </div>
                )}
                {isScanning && <div className="py-8"><Spinner /></div>}
                {scanInitiated && !isScanning && (
                    <div>
                         <h3 className="text-xl font-bold mb-4 text-light-text">Scan Results</h3>
                         <div className="space-y-4">
                             <AnimatePresence>
                                {scanResults.length > 0 ? (
                                    scanResults.map(broker => (
                                        <motion.div 
                                            key={broker.name}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="p-4 border border-accent-blue/20 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between"
                                        >
                                            <div className="flex-grow">
                                                <h4 className="font-bold text-lg text-light-text">{broker.name}
                                                    <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full ${difficultyColors[broker.difficulty]}`}>
                                                        {broker.difficulty}
                                                    </span>
                                                </h4>
                                                <p className="text-sm text-medium-text mt-1">{broker.description}</p>
                                                <a href={broker.removalLink} target="_blank" rel="noopener noreferrer" className="text-sm text-accent-blue hover:underline font-semibold mt-2 inline-block">
                                                    Go to Removal Page &rarr;
                                                </a>
                                            </div>
                                            <div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
                                                <Button onClick={() => handleRemovalRequest(broker.name)} className="bg-orange-500 hover:bg-orange-600 focus:ring-orange-400">
                                                    Request Removal
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <p className="text-center text-medium-text py-4">Good news! We didn't find your information on the data broker sites we scanned.</p>
                                    </motion.div>
                                )}
                             </AnimatePresence>
                         </div>
                    </div>
                )}
            </Card>
        </motion.div>
    );
};

const getPrivacyGrade = (breachCount: number): { grade: string, color: string, description: string } => {
    if (breachCount === 0) return { grade: 'A+', color: 'text-green-400', description: 'Excellent. No breaches on record. Keep up the great work!' };
    if (breachCount <= 1) return { grade: 'A', color: 'text-green-400', description: 'Very Good. Your exposure is minimal.' };
    if (breachCount <= 2) return { grade: 'B', color: 'text-yellow-400', description: 'Good. A few minor breaches detected. Stay vigilant.' };
    if (breachCount <= 4) return { grade: 'C', color: 'text-orange-400', description: 'Fair. Your data has appeared in several breaches. Action is recommended.' };
    if (breachCount <= 6) return { grade: 'D', color: 'text-red-400', description: 'Poor. Significant exposure detected. Take immediate steps to secure your accounts.' };
    return { grade: 'F', color: 'text-red-500', description: 'Critical. Your data is widely exposed. Urgent action is required.' };
};

export const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useLocalStorage<UserProfile>('privacyGuardProfile', {
        name: 'Alex Doe',
        email: 'alex.doe@example.com',
        notifications: {
            newBreachAlerts: true,
            weeklySummary: false,
            securityTips: true,
        }
    });
    const [breaches] = useState<Breach[]>(() => MOCK_BREACHES.filter(() => Math.random() > 0.4));
    const [saved, setSaved] = useState(false);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleNotificationChange = (key: keyof UserProfile['notifications'], value: boolean) => {
        setProfile(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: value,
            }
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        // The useLocalStorage hook already saves on change, but a button provides better UX for forms.
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };
    
    const privacyInfo = getPrivacyGrade(breaches.length);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="lg:col-span-1">
                     <Card className="text-center">
                        <UserCircleIcon className="w-24 h-24 mx-auto text-medium-text" />
                        <h2 className="text-2xl font-bold mt-4 text-light-text">{profile.name}</h2>
                        <p className="text-medium-text">{profile.email}</p>
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-light-text">Overall Privacy Grade</h3>
                            <p className={`text-7xl font-bold ${privacyInfo.color}`}>{privacyInfo.grade}</p>
                            <p className="text-medium-text mt-2 px-4">{privacyInfo.description}</p>
                        </div>
                     </Card>
                </div>

                {/* Right Column: Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <h3 className="text-xl font-bold mb-4 text-light-text">Account Settings</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-medium-text mb-1">Full Name</label>
                                <Input type="text" name="name" id="name" value={profile.name} onChange={handleProfileChange} placeholder="Your Name" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-medium-text mb-1">Email Address</label>
                                <Input type="email" name="email" id="email" value={profile.email} onChange={handleProfileChange} placeholder="your.email@example.com" />
                            </div>
                            <div className="text-right">
                                <Button type="submit" className="relative">
                                    {saved ? 'Saved!' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <Card>
                        <h3 className="text-xl font-bold mb-4 text-light-text">Notification Preferences</h3>
                        <div className="space-y-4">
                           <ToggleSwitch 
                                label="New Breach Alerts"
                                checked={profile.notifications.newBreachAlerts}
                                onChange={(value) => handleNotificationChange('newBreachAlerts', value)}
                           />
                           <ToggleSwitch 
                                label="Weekly Summary Reports"
                                checked={profile.notifications.weeklySummary}
                                onChange={(value) => handleNotificationChange('weeklySummary', value)}
                           />
                            <ToggleSwitch 
                                label="Security Tips & News"
                                checked={profile.notifications.securityTips}
                                onChange={(value) => handleNotificationChange('securityTips', value)}
                           />
                        </div>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
};


export const NotFoundPage: React.FC = () => (
    <div className="text-center py-16">
        <h1 className="text-6xl font-extrabold text-accent-blue">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-light-text">Page Not Found</h2>
        <p className="mt-2 text-medium-text">Sorry, we couldn't find the page you're looking for.</p>
    </div>
);