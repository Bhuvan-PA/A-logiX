import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Gemini API client
const geminiApi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Get the Gemini Pro model
const model = geminiApi.getGenerativeModel({ model: "gemini-pro" });

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
    I need nutrition and health insights for a person with the following profile:
    Age: ${age}
    Gender: ${gender}
    Medical conditions: ${conditions.join(", ") || "None"}
    Health goals: ${goals.join(", ")}
    Activity level: ${activity}

    Please provide personalized nutrition insights for this person. Include:
    1. Daily calorie recommendations
    2. Macronutrient balance
    3. Key nutrients to focus on
    4. Foods to include in their diet
    5. Foods to limit or avoid
    6. Specific suggestions based on their health goals and medical conditions
    7. Meal timing recommendations

    Provide the information in a conversational, encouraging tone without using bullet points or numbered lists. Format the response as a cohesive paragraph of advice.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating nutrition insight with Gemini:", error);
    return "We couldn't generate personalized insights right now. Please try again later.";
  }
}

/**
 * Analyze food data and provide nutritional recommendations
 */
export async function analyzeMeal(mealData: {
  foodName: string;
  mealType: string;
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  notes?: string;
}): Promise<{ recommendation: string; suggestions: string }> {
  try {
    const { foodName, mealType, calories, protein, carbs, fat, notes } = mealData;
    
    const nutritionInfo = `
      Food name: ${foodName}
      Meal type: ${mealType}
      ${calories ? `Calories: ${calories} kcal` : ''}
      ${protein ? `Protein: ${protein}g` : ''}
      ${carbs ? `Carbohydrates: ${carbs}g` : ''}
      ${fat ? `Fat: ${fat}g` : ''}
      ${notes ? `Additional notes: ${notes}` : ''}
    `;
    
    const prompt = `
    You are a nutritionist analyzing a meal. Here's the meal information:
    ${nutritionInfo}
    
    Please provide:
    1. A short analysis of the nutritional value of this meal
    2. How it fits into a balanced diet
    3. One recommendation for improving this meal
    4. Suggestions for complementary foods that would balance this meal

    Format your response as JSON with two keys: "recommendation" (a brief 1-2 sentence summary) and "suggestions" (more detailed nutritional advice, around 3-4 sentences).
    `;
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 800,
      },
    });
    
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    try {
      // Check if response is already in JSON format
      const parsedResponse = JSON.parse(text);
      return {
        recommendation: parsedResponse.recommendation || "Analysis not available",
        suggestions: parsedResponse.suggestions || "No suggestions available"
      };
    } catch (e) {
      // If not JSON, return a formatted error response
      console.error("Failed to parse Gemini response as JSON:", e);
      return {
        recommendation: "Analysis not available",
        suggestions: "We couldn't analyze this meal properly. Please try again with more details."
      };
    }
  } catch (error) {
    console.error("Error analyzing meal with Gemini:", error);
    return {
      recommendation: "Analysis not available",
      suggestions: "We couldn't analyze this meal at this time. Please try again later."
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
}): Promise<{ mealPlan: string; tips: string }> {
  try {
    const userProfile = `
    Age: ${age}
    Gender: ${gender}
    Medical conditions: ${conditions.join(", ") || "None"}
    Health goals: ${goals.join(", ")}
    Activity level: ${activity}
    Dietary preferences: ${preferences.join(", ") || "None specified"}
    Daily calorie goal: ${calorieGoal} kcal
    `;
    
    const prompt = `
    You are a nutritionist creating a personalized meal plan. Here's the user profile:
    ${userProfile}
    
    Please create a 3-day meal plan (breakfast, lunch, dinner, and 2 snacks per day) that:
    1. Aligns with their calorie goal and health objectives
    2. Takes into account any medical conditions
    3. Respects their dietary preferences
    4. Includes variety and is practical to prepare
    
    Also provide 3-5 helpful tips for meal preparation and nutrition.
    
    Format your response as JSON with two keys: "mealPlan" (the 3-day meal plan formatted as readable text) and "tips" (the helpful preparation and nutrition tips).
    `;
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1000,
      },
    });
    
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    try {
      // Check if response is already in JSON format
      const parsedResponse = JSON.parse(text);
      return {
        mealPlan: parsedResponse.mealPlan || "Meal plan not available",
        tips: parsedResponse.tips || "No tips available"
      };
    } catch (e) {
      // If not JSON, return a formatted error response
      console.error("Failed to parse Gemini response as JSON:", e);
      return {
        mealPlan: "We couldn't generate a personalized meal plan at this time. Please try again later.",
        tips: "Make sure to stay hydrated and eat a variety of colorful fruits and vegetables."
      };
    }
  } catch (error) {
    console.error("Error generating meal plan with Gemini:", error);
    return {
      mealPlan: "We couldn't generate a personalized meal plan at this time. Please try again later.",
      tips: "Make sure to stay hydrated and eat a variety of colorful fruits and vegetables."
    };
  }
}