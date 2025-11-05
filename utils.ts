
import { Breach, RiskAssessment, RiskLevel } from './types';

// Simple SHA-1 implementation for Pwned Passwords API.
// In a real production app, a more robust library might be used.
export async function sha1(str: string): Promise<string> {
  const buffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.toUpperCase();
}

// Calculates a privacy risk score based on breach data.
export function calculateRiskScore(breaches: Breach[]): RiskAssessment {
  let score = 0;
  if (breaches.length === 0) {
    return { score: 0, level: RiskLevel.Low, details: "No breaches found. Your exposure appears low." };
  }

  breaches.forEach(breach => {
    score += 10; // Base score for any breach
    if (breach.dataClasses.includes('Passwords')) score += 20;
    if (breach.dataClasses.includes('National ID numbers')) score += 30;
    if (breach.dataClasses.includes('Financial information')) score += 25;
    if (breach.dataClasses.includes('Phone numbers')) score += 5;
    if (breach.dataClasses.includes('Physical addresses')) score += 10;
  });

  const finalScore = Math.min(Math.round(score / (breaches.length * 2)), 100);

  if (finalScore >= 90) {
    return { score: finalScore, level: RiskLevel.Critical, details: "Critical risk detected. Highly sensitive data like passwords and financial info exposed in multiple breaches." };
  }
  if (finalScore >= 70) {
    return { score: finalScore, level: RiskLevel.High, details: "High risk. Sensitive data such as passwords have been exposed. Immediate action is recommended." };
  }
  if (finalScore >= 40) {
    return { score: finalScore, level: RiskLevel.Medium, details: "Medium risk. Personal information has been exposed in several breaches." };
  }
  return { score: finalScore, level: RiskLevel.Low, details: "Low risk. Some of your information has appeared in minor breaches." };
}
   