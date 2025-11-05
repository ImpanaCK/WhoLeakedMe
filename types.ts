export interface Breach {
  name: string;
  domain: string;
  breachDate: string;
  addedDate: string;
  pwnCount: number;
  dataClasses: string[];
  description: string;
}

export enum RiskLevel {
  Low = "Low",
  Medium = "Medium",
  High = "High",
  Critical = "Critical",
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  details: string;
}

export interface RecommendedAction {
    id: string;
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
}

export interface ScanResult {
    query: string;
    breaches: Breach[];
    risk: RiskAssessment;
    actions: RecommendedAction[];
}

export interface PwnedPasswordResult {
    isPwned: boolean;
    count: number;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model' | 'system';
    text: string;
}

export interface DataBroker {
    name: string;
    description: string;
    removalLink: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface UserProfile {
    name: string;
    email: string;
    notifications: {
        newBreachAlerts: boolean;
        weeklySummary: boolean;
        securityTips: boolean;
    };
}