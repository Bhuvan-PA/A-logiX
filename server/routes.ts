import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  userOnboardingSchema, 
  insertNutritionPlanSchema, 
  insertFoodLogSchema
} from "@shared/schema";
import { z, ZodError } from "zod";
import { generateNutritionInsight, analyzeMeal, generateMealPlan } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration
  app.post("/api/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      
      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // Login (mock for now)
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Update user onboarding information
  app.post("/api/onboarding/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const onboardingData = userOnboardingSchema.parse(req.body);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updatedUser = await storage.updateUserOnboarding(userId, onboardingData);
      
      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to update user information" });
    }
  });
  
  // Create nutrition plan
  app.post("/api/nutrition-plan", async (req, res) => {
    try {
      const planData = insertNutritionPlanSchema.parse(req.body);
      
      const user = await storage.getUser(planData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const newPlan = await storage.createNutritionPlan(planData);
      res.status(201).json(newPlan);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to create nutrition plan" });
    }
  });
  
  // Get nutrition plan
  app.get("/api/nutrition-plan/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const plan = await storage.getNutritionPlan(userId);
      if (!plan) {
        return res.status(404).json({ message: "Nutrition plan not found" });
      }
      
      res.status(200).json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve nutrition plan" });
    }
  });
  
  // Track meal
  app.post("/api/track-meal", async (req, res) => {
    try {
      const mealData = insertFoodLogSchema.parse(req.body);
      
      const user = await storage.getUser(mealData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const newLog = await storage.createFoodLog(mealData);
      res.status(201).json(newLog);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to log meal" });
    }
  });
  
  // Get food logs for a user
  app.get("/api/food-logs/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const date = req.query.date as string | undefined;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const logs = await storage.getFoodLogs(userId, date);
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve food logs" });
    }
  });
  
  // Create a food log
  app.post("/api/food-logs", async (req, res) => {
    try {
      const userId = req.body.userId;
      
      // Validate required fields
      if (!userId || !req.body.date || !req.body.mealType || !req.body.foodName) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const foodLog = await storage.createFoodLog(req.body);
      res.status(201).json(foodLog);
    } catch (error) {
      console.error("Error creating food log:", error);
      res.status(500).json({ message: "Failed to create food log" });
    }
  });
  
  // Get user data
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user data" });
    }
  });
  
  // Update user profile
  app.patch("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user profile with provided data
      const updatedUser = await storage.updateUser(userId, req.body);
      
      // Return user without password
      const { password, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Generate AI nutrition insight
  app.post("/api/ai/nutrition-insight", async (req, res) => {
    try {
      const { age, gender, conditions, goals, activity } = req.body;
      
      if (!age || !gender || !conditions || !goals || !activity) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const insight = await generateNutritionInsight({
        age,
        gender,
        conditions,
        goals,
        activity
      });
      
      res.status(200).json({ insight });
    } catch (error) {
      console.error("Error generating AI nutrition insight:", error);
      res.status(500).json({ message: "Failed to generate AI insight" });
    }
  });
  
  // Analyze meal with AI
  app.post("/api/ai/analyze-meal", async (req, res) => {
    try {
      const { 
        foodName, 
        mealType, 
        calories, 
        protein, 
        carbs, 
        fat, 
        notes 
      } = req.body;
      
      if (!foodName || !mealType) {
        return res.status(400).json({ message: "Food name and meal type are required" });
      }
      
      const analysis = await analyzeMeal({
        foodName,
        mealType,
        calories,
        protein,
        carbs,
        fat,
        notes: notes || ''
      });
      
      res.status(200).json(analysis);
    } catch (error) {
      console.error("Error analyzing meal with AI:", error);
      res.status(500).json({ message: "Failed to analyze meal" });
    }
  });
  
  // Generate meal plan with AI
  app.post("/api/ai/meal-plan", async (req, res) => {
    try {
      const { 
        age, 
        gender, 
        conditions, 
        goals, 
        activity, 
        preferences, 
        calorieGoal 
      } = req.body;
      
      if (!age || !gender || !conditions || !goals || !activity || !calorieGoal) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const mealPlan = await generateMealPlan({
        age,
        gender,
        conditions,
        goals,
        activity,
        preferences: preferences || [],
        calorieGoal
      });
      
      res.status(200).json(mealPlan);
    } catch (error) {
      console.error("Error generating meal plan with AI:", error);
      res.status(500).json({ message: "Failed to generate meal plan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
