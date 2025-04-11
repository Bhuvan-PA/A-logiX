import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Calculate BMR (Basal Metabolic Rate) using Harris-Benedict equation
export function calculateBMR(age: number, gender: string, activityLevel: string): number {
  // Basic starting point
  let bmr = 1800;
  
  // Adjust for age (simple approximation)
  if (age < 30) bmr += 200;
  else if (age > 60) bmr -= 200;
  
  // Adjust for gender
  if (gender === 'male') bmr += 300;
  else if (gender === 'female') bmr -= 300;
  
  // Adjust for activity level
  switch (activityLevel) {
    case 'mostly-sitting':
      bmr *= 1.2;
      break;
    case 'often-standing':
      bmr *= 1.375;
      break;
    case 'regularly-walking':
      bmr *= 1.55;
      break;
    case 'physically-intense':
      bmr *= 1.725;
      break;
    default:
      bmr *= 1.2;
  }
  
  return Math.round(bmr);
}

// Generate nutrition split based on goals
export function generateNutritionSplit(goals: string[]): string {
  if (goals.includes('muscle')) {
    return '30% Carbs, 40% Protein, 30% Fat';
  } else if (goals.includes('weight')) {
    return '40% Carbs, 30% Protein, 30% Fat';
  } else if (goals.includes('diet')) {
    return '45% Carbs, 30% Protein, 25% Fat';
  }
  return '40% Carbs, 30% Protein, 30% Fat';
}

// Generate focus foods based on conditions and goals
export function generateFocusFoods(conditions: string[], goals: string[]): string[] {
  const focusFoods = ['Leafy greens', 'Lean proteins'];
  
  if (conditions.includes('diabetes') || conditions.includes('pre-diabetes')) {
    focusFoods.push('Low glycemic index foods', 'Fiber-rich vegetables');
  }
  
  if (conditions.includes('cholesterol')) {
    focusFoods.push('Omega-3 rich fish', 'Oatmeal');
  }
  
  if (goals.includes('muscle')) {
    focusFoods.push('Eggs', 'Greek yogurt', 'Quinoa');
  }
  
  if (goals.includes('weight')) {
    focusFoods.push('High-fiber fruits', 'Vegetables', 'Lean proteins');
  }
  
  return Array.from(new Set(focusFoods));
}

// Generate AI insight based on user data
export function generateAIInsight(
  age: number,
  gender: string,
  conditions: string[],
  goals: string[]
): string {
  let insight = "Based on your profile, ";
  
  if (goals.includes('weight')) {
    insight += "focusing on a calorie deficit of 500 calories per day could help you achieve steady weight loss. ";
  } else if (goals.includes('muscle')) {
    insight += "ensure you're getting enough protein (1.6-2g per kg of body weight) to support muscle growth. ";
  }
  
  if (conditions.includes('diabetes') || conditions.includes('pre-diabetes')) {
    insight += "monitoring your carbohydrate intake and choosing complex carbs over simple sugars will help manage blood glucose levels. ";
  }
  
  if (age > 50) {
    insight += "Include calcium and vitamin D rich foods to support bone health. ";
  }
  
  insight += "Stay hydrated by drinking at least 8 glasses of water daily for optimal health and metabolism.";
  
  return insight;
}
