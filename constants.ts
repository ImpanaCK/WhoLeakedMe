
import { Breach, RecommendedAction, DataBroker } from './types';

export const MOCK_BREACHES: Breach[] = [
  {
    name: "SocialConnect2021",
    domain: "socialconnect.com",
    breachDate: "2021-05-15",
    addedDate: "2021-06-01",
    pwnCount: 150000000,
    dataClasses: ["Email addresses", "Usernames", "Passwords", "Phone numbers"],
    description: "In mid-2021, SocialConnect suffered a major data breach exposing user profile information and credentials."
  },
  {
    name: "EshopMarket",
    domain: "eshop-market.com",
    breachDate: "2022-11-20",
    addedDate: "2022-12-10",
    pwnCount: 75000000,
    dataClasses: ["Email addresses", "Passwords", "Physical addresses", "Financial information"],
    description: "Customer data from EshopMarket was compromised, including payment details and shipping addresses."
  },
  {
    name: "MyHealthTracker",
    domain: "my-health-tracker.io",
    breachDate: "2023-01-30",
    addedDate: "2023-02-18",
    pwnCount: 2500000,
    dataClasses: ["Email addresses", "Passwords", "Health data"],
    description: "A breach at MyHealthTracker exposed sensitive personal health information."
  },
  {
    name: "GamingForumXYZ",
    domain: "gamingforum.xyz",
    breachDate: "2020-08-01",
    addedDate: "2020-08-25",
    pwnCount: 50000000,
    dataClasses: ["Email addresses", "Usernames", "IP addresses", "Passwords"],
    description: "The popular gaming forum was hacked, leading to the leak of user credentials and IP addresses."
  },
   {
    name: "GovRecordsLeak",
    domain: "regional-gov-records.gov",
    breachDate: "2023-04-10",
    addedDate: "2023-05-02",
    pwnCount: 1200000,
    dataClasses: ["Email addresses", "National ID numbers", "Physical addresses"],
    description: "A government database was inadvertently exposed, leaking national identification numbers and personal details."
  }
];

export const RECOMMENDED_ACTIONS: RecommendedAction[] = [
    {
        id: 'change-pass',
        title: "Change Your Password Immediately",
        description: "Your password was found in a breach. Create a new, strong, and unique password for this account.",
        priority: 'High'
    },
    {
        id: 'enable-2fa',
        title: "Enable Two-Factor Authentication (2FA)",
        description: "Add an extra layer of security to your account. Even if your password is stolen, 2FA can prevent unauthorized access.",
        priority: 'High'
    },
    {
        id: 'review-accounts',
        title: "Review Your Financial Statements",
        description: "Since financial information may have been exposed, carefully check your bank and credit card statements for any suspicious activity.",
        priority: 'Medium'
    },
    {
        id: 'revoke-sessions',
        title: "Revoke Old Sessions",
        description: "Log out of all devices and sessions for the affected account to ensure any unauthorized access is cut off.",
        priority: 'Medium'
    },
     {
        id: 'remove-data',
        title: "Request Data Takedown",
        description: "Use GDPR/CCPA rights to request the breached company to delete your personal data from their systems.",
        priority: 'Low'
    }
];

export const DATA_BROKERS: DataBroker[] = [
    { name: "Acxiom", description: "One of the largest data brokers, collecting consumer data and analytics.", removalLink: "#", difficulty: "Hard" },
    { name: "Spokeo", description: "A people search engine that aggregates data from online and offline sources.", removalLink: "#", difficulty: "Medium" },
    { name: "Whitepages", description: "Provides contact information and background checks on individuals.", removalLink: "#", difficulty: "Medium" },
    { name: "Intelius", description: "Offers background checks, criminal records, and other personal information.", removalLink: "#", difficulty: "Hard" },
    { name: "BeenVerified", description: "A background check company that allows searching for people, vehicles, and contact information.", removalLink: "#", difficulty: "Easy" },
];
   