import { users, type User, type InsertUser, nutritionPlans, type NutritionPlan, type InsertNutritionPlan, foodLogs, type FoodLog, type InsertFoodLog, UserOnboarding } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(userId: number, userData: Partial<User>): Promise<User>;
  updateUserOnboarding(userId: number, onboarding: UserOnboarding): Promise<User>;
  
  // Nutrition plan methods
  getNutritionPlan(userId: number): Promise<NutritionPlan | undefined>;
  createNutritionPlan(plan: InsertNutritionPlan): Promise<NutritionPlan>;
  
  // Food log methods
  getFoodLogs(userId: number, date?: string): Promise<FoodLog[]>;
  createFoodLog(log: InsertFoodLog): Promise<FoodLog>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private nutritionPlans: Map<number, NutritionPlan>;
  private foodLogs: Map<number, FoodLog>;
  private userIdCounter: number;
  private planIdCounter: number;
  private logIdCounter: number;

  constructor() {
    this.users = new Map();
    this.nutritionPlans = new Map();
    this.foodLogs = new Map();
    this.userIdCounter = 1;
    this.planIdCounter = 1;
    this.logIdCounter = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id,
      age: null,
      gender: null,
      country: null,
      languages: [],
      activity: null,
      goals: [],
      conditions: [],
      dietaryPreferences: [],
      profilePicture: null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Don't update password directly through this method
    const { password, ...dataToUpdate } = userData;
    
    const updatedUser: User = {
      ...user,
      ...dataToUpdate
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserOnboarding(userId: number, onboarding: UserOnboarding): Promise<User> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser: User = {
      ...user,
      ...onboarding
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async getNutritionPlan(userId: number): Promise<NutritionPlan | undefined> {
    return Array.from(this.nutritionPlans.values()).find(
      (plan) => plan.userId === userId
    );
  }

  async createNutritionPlan(insertPlan: InsertNutritionPlan): Promise<NutritionPlan> {
    const id = this.planIdCounter++;
    const plan: NutritionPlan = { 
      ...insertPlan, 
      id,
      focusFoods: insertPlan.focusFoods || [],
      aiInsight: insertPlan.aiInsight || null
    };
    this.nutritionPlans.set(id, plan);
    return plan;
  }

  async getFoodLogs(userId: number, date?: string): Promise<FoodLog[]> {
    const logs = Array.from(this.foodLogs.values()).filter(
      (log) => log.userId === userId && (!date || log.date === date)
    );
    return logs;
  }

  async createFoodLog(insertLog: InsertFoodLog): Promise<FoodLog> {
    const id = this.logIdCounter++;
    const log: FoodLog = { 
      ...insertLog, 
      id,
      calories: insertLog.calories || null,
      protein: insertLog.protein || null,
      carbs: insertLog.carbs || null,
      fat: insertLog.fat || null,
      notes: insertLog.notes || null
    };
    this.foodLogs.set(id, log);
    return log;
  }
}

export const storage = new MemStorage();
