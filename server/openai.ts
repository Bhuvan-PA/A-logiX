import OpenAI from "openai";

// Initialize OpenAI client
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Generate personalized nutrition insights based on user profile data
 */
export async function generateNutritionInsight({
  age,
  gender,
  conditions,
  goals,
  activity
}: {
  age: number;
  gender: string;
  conditions: string[];
  goals: string[];
  activity: string;
}): Promise<string> {
  try {
    const prompt = `
    Generate personalized nutrition advice for someone with the following profile:
    - Age: ${age}
    - Biological sex: ${gender}
    - Activity level: ${activity}
    - Health conditions: ${conditions.join(', ')}
    - Nutrition/health goals: ${goals.join(', ')}
    
    Provide 2-3 paragraphs of clear, practical advice focusing on:
    1. What nutrients they should prioritize
    2. Foods they should incorporate into their diet
    3. Eating patterns that might benefit them
    4. Specific considerations for their health conditions (if any)
    
    Keep the tone supportive and motivating. 
    Be specific with food recommendations whenever possible.
    Structure as a cohesive, personalized message approximately 150-200 words.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (content === null || content === undefined) {
      return "We couldn't generate a personalized insight at this moment. Please try again later.";
    }
    
    return content;
  } catch (error) {
    console.error("Error generating OpenAI insight:", error);
    return "We're experiencing issues with our AI service. Please try again later.";
  }
}

/**
 * Analyze food data and provide nutritional recommendations
 */
export async function analyzeMeal(mealData: {
  foodName: string;
  mealType: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string;
}): Promise<{
  nutritionEstimate?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  suggestions: string;
}> {
  try {
    const prompt = `
    Analyze this meal and provide nutritional recommendations:
    
    Meal: ${mealData.foodName}
    Meal Type: ${mealData.mealType}
    User-provided nutrition info: ${
      mealData.calories ? `Calories: ${mealData.calories}` : ''
    } ${mealData.protein ? `Protein: ${mealData.protein}g` : ''} ${
      mealData.carbs ? `Carbs: ${mealData.carbs}g` : ''
    } ${mealData.fat ? `Fat: ${mealData.fat}g` : ''}
    Additional notes: ${mealData.notes || 'None'}
    
    Please provide:
    1. If nutrition info is missing, a reasonable estimate of the nutritional content (calories, protein, carbs, fat)
    2. 2-3 suggestions to improve the nutritional value of this meal
    
    Format your response as a JSON object with these fields:
    - nutritionEstimate (object with calories, protein, carbs, fat - only include if user didn't provide complete info)
    - suggestions (string with 2-3 bullet points of helpful advice)
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (content === null || content === undefined) {
      return {
        suggestions: "We couldn't analyze this meal at the moment. Please try again later."
      };
    }
    
    const result = JSON.parse(content);
    return {
      nutritionEstimate: result.nutritionEstimate,
      suggestions: result.suggestions
    };
  } catch (error) {
    console.error("Error analyzing meal with OpenAI:", error);
    return {
      suggestions: "We couldn't analyze this meal at the moment. Please try again later."
    };
  }
}

/**
 * Generate a weekly meal plan based on user profile and preferences
 */
export async function generateMealPlan({
  age,
  gender,
  conditions,
  goals,
  activity,
  preferences,
  calorieGoal
}: {
  age: number;
  gender: string;
  conditions: string[];
  goals: string[];
  activity: string;
  preferences: string[];
  calorieGoal: number;
}): Promise<{
  dailyPlans: Array<{
    day: string;
    meals: Array<{
      type: string;
      name: string;
      description: string;
    }>;
  }>;
  groceryList: string[];
}> {
  try {
    const prompt = `
    Generate a 7-day personalized meal plan for someone with the following profile:
    - Age: ${age}
    - Biological sex: ${gender}
    - Activity level: ${activity}
    - Health conditions: ${conditions.join(', ')}
    - Nutrition/health goals: ${goals.join(', ')}
    - Food preferences: ${preferences.join(', ')}
    - Daily calorie goal: ${calorieGoal}
    
    The meal plan should include:
    1. Breakfast, lunch, dinner, and 1-2 snacks for each day
    2. A brief description of each meal
    3. A consolidated grocery list for the week
    
    Format your response as a JSON object with these fields:
    - dailyPlans: array of objects with day, meals (array of objects with type, name, description)
    - groceryList: array of strings (sorted by food category)
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = response.choices[0].message.content;
    if (content === null || content === undefined) {
      return { dailyPlans: [], groceryList: [] };
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating meal plan with OpenAI:", error);
    throw new Error("Failed to generate meal plan. Please try again later.");
  }
}