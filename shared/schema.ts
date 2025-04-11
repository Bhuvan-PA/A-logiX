import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  age: integer("age"),
  gender: text("gender"),
  country: text("country"),
  languages: text("languages").array(),
  activity: text("activity"),
  goals: text("goals").array(),
  conditions: text("conditions").array(),
  dietaryPreferences: text("dietary_preferences").array(),
  profilePicture: text("profile_picture"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
});

export const userOnboardingSchema = z.object({
  goals: z.array(z.string()),
  activity: z.string(),
  age: z.number().min(15).max(100),
  country: z.string(),
  languages: z.array(z.string()),
  gender: z.string(),
  conditions: z.array(z.string()),
  dietaryPreferences: z.array(z.string()).optional(),
  profilePicture: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserOnboarding = z.infer<typeof userOnboardingSchema>;

export const nutritionPlans = pgTable("nutrition_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  calorieGoal: integer("calorie_goal").notNull(),
  nutritionSplit: text("nutrition_split").notNull(),
  focusFoods: text("focus_foods").array(),
  aiInsight: text("ai_insight"),
});

export const insertNutritionPlanSchema = createInsertSchema(nutritionPlans).omit({
  id: true,
});

export type InsertNutritionPlan = z.infer<typeof insertNutritionPlanSchema>;
export type NutritionPlan = typeof nutritionPlans.$inferSelect;

// Food logs for tracking daily meals
export const foodLogs = pgTable("food_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner, snack
  foodName: text("food_name").notNull(),
  calories: integer("calories"),
  protein: integer("protein"),
  carbs: integer("carbs"),
  fat: integer("fat"),
  notes: text("notes"),
});

export const insertFoodLogSchema = createInsertSchema(foodLogs).omit({
  id: true,
});

export type InsertFoodLog = z.infer<typeof insertFoodLogSchema>;
export type FoodLog = typeof foodLogs.$inferSelect;
