import React from 'react';
import { NavLink } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { RiskLevel, Breach } from './types';

// --- Icon Components ---

export const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.972 3.722 11.012 8.703 12.427a.75.75 0 0 0 .694 0A12.74 12.74 0 0 0 21.75 9.75c0-1.06-.11-2.096-.322-3.085a.75.75 0 0 0-.722-.515 11.21 11.21 0 0 1-7.877-3.08ZM11.24 16.5l6.14-6.14a.75.75 0 1 0-1.06-1.06l-5.61 5.61-2.12-2.12a.75.75 0 1 0-1.06 1.06l2.65 2.65a.75.75 0 0 0 1.06 0Z" clipRule="evenodd" />
  </svg>
);

export const AlertTriangleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

export const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
);

export const LockClosedIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"}>
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3A5.25 5.25 0 0 0 12 1.5Zm-3.75 5.25a3.75 3.75 0 1 0 7.5 0v3h-7.5v-3Z" clipRule="evenodd" />
    </svg>
);

export const UserCircleIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);


// --- Common UI Components ---

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-dark-card border border-accent-blue/20 rounded-xl shadow-lg shadow-accent-blue/5 p-6 ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}> = ({ children, onClick, className, type = 'button', disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 font-semibold text-dark-bg bg-accent-blue rounded-lg shadow-lg shadow-accent-blue/30 transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-accent-blue/40 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${className}`}
  >
    {children}
  </button>
);

export const Input: React.FC<{
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    className?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    name?: string;
    id?: string;
}> = ({ type, value, onChange, placeholder, className, onKeyDown, name, id }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-dark-bg border border-accent-blue/30 rounded-lg text-light-text placeholder-medium-text focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-colors duration-200 ${className}`}
        name={name}
        id={id}
    />
);

export const Spinner = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
    </div>
);

export const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <span className="text-light-text">{label}</span>
    <div className="relative">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-accent-blue' : 'bg-gray-600'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></div>
    </div>
  </label>
);

// --- Layout Components ---

export const Header = () => {
    const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium text-medium-text hover:bg-dark-card hover:text-light-text transition-colors";
    const activeLinkClasses = "bg-accent-blue/10 text-accent-blue";
    
    return (
        <header className="bg-dark-bg/80 backdrop-blur-sm shadow-lg shadow-dark-bg/50 sticky top-0 z-50 border-b border-accent-blue/10">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <NavLink to="/" className="flex-shrink-0 flex items-center gap-2">
                           <ShieldCheckIcon className="h-8 w-8 text-accent-blue"/>
                           <span className="font-bold text-xl text-light-text">PrivacyGuard AI</span>
                        </NavLink>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Dashboard</NavLink>
                            <NavLink to="/password-safety" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Password Safety</NavLink>
                            <NavLink to="/ai-assistant" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>AI Assistant</NavLink>
                            <NavLink to="/takedown-center" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Takedown Center</NavLink>
                            <NavLink to="/resources" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Resources</NavLink>
                            <NavLink to="/profile" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeLinkClasses : ''}`}>Profile</NavLink>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-dark-bg font-sans">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="text-center py-4 text-medium-text text-sm">
        <p>&copy; {new Date().getFullYear()} PrivacyGuard AI. All rights reserved.</p>
      </footer>
    </div>
);


// --- Chart Components ---

export const RiskScoreGauge: React.FC<{ score: number; level: RiskLevel }> = ({ score, level }) => {
    const riskColors = {
        [RiskLevel.Low]: "#22c55e", // green-500
        [RiskLevel.Medium]: "#f59e0b", // amber-500
        [RiskLevel.High]: "#ef4444", // red-500
        [RiskLevel.Critical]: "#b91c1c", // red-700
    };
    const color = riskColors[level];
    const data = [
        { name: 'Score', value: score },
        { name: 'Remaining', value: 100 - score },
    ];

    return (
        <div className="relative w-48 h-24 mx-auto">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                    >
                        <Cell key={`cell-0`} fill={color} />
                        <Cell key={`cell-1`} fill="#374151" />
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/4 text-center">
                <div className="text-4xl font-bold" style={{ color }}>{score}</div>
                <div className="text-sm font-semibold" style={{ color }}>{level}</div>
            </div>
        </div>
    );
};

export const DataExposurePieChart: React.FC<{ breaches: Breach[] }> = ({ breaches }) => {
    const dataClassCounts = breaches
        .flatMap(b => b.dataClasses)
        .reduce((acc, dc) => {
            acc[dc] = (acc[dc] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });
    
    const data = Object.entries(dataClassCounts).map(([name, value]) => ({ name, value }));
    
    const COLORS = ['#00bfff', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919'];

    if (data.length === 0) {
        return <div className="text-center text-medium-text py-8">No data exposure details available.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#112240', border: '1px solid #00bfff' }} />
                <Legend wrapperStyle={{ color: '#ccd6f6' }} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export const BreachesTimelineChart: React.FC<{ breaches: Breach[] }> = ({ breaches }) => {
    const breachesByYear = breaches.reduce((acc, breach) => {
        const year = new Date(breach.breachDate).getFullYear().toString();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const data = Object.entries(breachesByYear)
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => parseInt(a.year) - parseInt(b.year));
    
    if (data.length === 0) {
        return <div className="text-center text-medium-text py-8">No breaches with date information to display.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
                <XAxis dataKey="year" tick={{ fill: '#8892b0' }} />
                <YAxis allowDecimals={false} tick={{ fill: '#8892b0' }} />
                <Tooltip 
                    cursor={{fill: 'rgba(0, 191, 255, 0.1)'}}
                    contentStyle={{ backgroundColor: '#112240', border: '1px solid #00bfff' }} 
                />
                <Legend wrapperStyle={{ color: '#ccd6f6' }} />
                <Bar dataKey="count" fill="#00bfff" name="Number of Breaches" />
            </BarChart>
        </ResponsiveContainer>
    );
};