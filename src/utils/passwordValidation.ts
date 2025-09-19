export interface PasswordStrength {
  score: number;
  feedback: string[];
  isValid: boolean;
}

export const validatePassword = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length >= 12) {
    score += 25;
  } else if (password.length >= 8) {
    score += 15;
    feedback.push('Use at least 12 characters for better security');
  } else {
    feedback.push('Password must be at least 8 characters long');
  }
  
  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 20;
  } else {
    feedback.push('Include lowercase letters');
  }
  
  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 20;
  } else {
    feedback.push('Include uppercase letters');
  }
  
  // Numbers check
  if (/[0-9]/.test(password)) {
    score += 20;
  } else {
    feedback.push('Include numbers');
  }
  
  // Special characters check
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Include special characters (!@#$%^&*)');
  }
  
  // Common patterns check
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i
  ];
  
  if (commonPatterns.some(pattern => pattern.test(password))) {
    score = Math.max(0, score - 30);
    feedback.push('Avoid common passwords and patterns');
  }
  
  // Repetitive characters check
  if (/(.)\1{2,}/.test(password)) {
    score = Math.max(0, score - 15);
    feedback.push('Avoid repetitive characters');
  }
  
  return {
    score: Math.min(100, score),
    feedback,
    isValid: score >= 60 && password.length >= 8
  };
};

export const getPasswordStrengthColor = (score: number): string => {
  if (score < 30) return 'bg-red-500';
  if (score < 60) return 'bg-yellow-500';
  if (score < 80) return 'bg-blue-500';
  return 'bg-green-500';
};

export const getPasswordStrengthText = (score: number): string => {
  if (score < 30) return 'Very Weak';
  if (score < 60) return 'Weak';
  if (score < 80) return 'Good';
  return 'Strong';
};