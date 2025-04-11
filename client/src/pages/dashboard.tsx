import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { apiRequest } from "@/lib/queryClient";
import { Logo } from "@/components/logo";

interface NutritionPlan {
  calorieGoal: number;
  nutritionSplit: string;
  focusFoods: string[];
  aiInsight: string;
}

interface FoodLog {
  id: number;
  userId: number;
  date: string;
  mealType: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

export default function Dashboard() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const userId = useOnboardingStore(state => state.userId);
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch nutrition plan
        const planResponse = await fetch(`/api/nutrition-plan/${userId}`);
        if (planResponse.ok) {
          const planData = await planResponse.json();
          setNutritionPlan(planData);
        }

        // Fetch today's food logs
        const today = new Date().toISOString().split('T')[0];
        const logsResponse = await fetch(`/api/food-logs/${userId}?date=${today}`);
        if (logsResponse.ok) {
          const logsData = await logsResponse.json();
          setFoodLogs(logsData);
        }
      } catch (error) {
        toast({
          title: "Error loading data",
          description: "We couldn't load your dashboard data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId, navigate, toast]);

  // Calculate daily progress
  const calculateDailyProgress = () => {
    if (!nutritionPlan) return 0;
    
    const totalCalories = foodLogs.reduce((sum, log) => sum + (log.calories || 0), 0);
    const percentage = Math.min(100, Math.round((totalCalories / nutritionPlan.calorieGoal) * 100));
    return percentage;
  };

  // Parse nutrition split into data for pie chart
  const getNutritionSplitData = () => {
    if (!nutritionPlan) return [];
    
    try {
      return nutritionPlan.nutritionSplit.split(', ').map(item => {
        const [percentage, nutrient] = item.split('% ');
        return {
          name: nutrient,
          value: parseInt(percentage)
        };
      });
    } catch (e) {
      return [
        { name: 'Carbs', value: 40 },
        { name: 'Protein', value: 30 },
        { name: 'Fat', value: 30 }
      ];
    }
  };

  // Prepare meal data for the bar chart
  const getMealData = () => {
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
    
    return mealTypes.map(type => {
      const meals = foodLogs.filter(log => 
        log.mealType.toLowerCase() === type.toLowerCase()
      );
      
      const calories = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
      const protein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
      const carbs = meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
      const fat = meals.reduce((sum, meal) => sum + (meal.fat || 0), 0);
      
      return {
        name: type,
        calories,
        protein,
        carbs,
        fat
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-neutral-200 py-4 px-4 fixed top-0 w-full z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <i className="fas fa-bell mr-2"></i>
              <span className="hidden md:inline">Notifications</span>
            </Button>
            <Button variant="ghost" size="sm">
              <i className="fas fa-user-circle mr-2"></i>
              <span className="hidden md:inline">Profile</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20 pb-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-6">My Dashboard</h1>

          {/* Daily Progress */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Daily Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-neutral-500">
                  {foodLogs.reduce((sum, log) => sum + (log.calories || 0), 0)} / {nutritionPlan?.calorieGoal || 0} cal
                </span>
                <span className="text-sm font-medium">{calculateDailyProgress()}%</span>
              </div>
              <Progress value={calculateDailyProgress()} className="h-2" />
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="meals">Meals</TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Nutrition Split</CardTitle>
                  </CardHeader>
                  <CardContent className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getNutritionSplitData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getNutritionSplitData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Focus Foods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {nutritionPlan?.focusFoods.map((food, index) => (
                        <li key={index} className="flex items-center">
                          <i className="fas fa-check text-primary mr-2"></i>
                          <span>{food}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">AI Nutrition Insight</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="bg-primary/5 border-primary/20">
                    <AlertDescription className="text-sm">
                      {nutritionPlan?.aiInsight || "Your personalized nutrition insights will appear here."}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="meals" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Today's Meals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={getMealData()}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="calories" name="Calories" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full">
                      <i className="fas fa-plus mr-2"></i>
                      Log a Meal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-500 mb-4">Your weekly stats will appear here once you log more meals.</p>
                  
                  <div className="mt-4">
                    <Button variant="outline" className="w-full">View Detailed Reports</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-white border-t border-neutral-200 py-6 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Logo />
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-neutral-600 hover:text-primary">Privacy</a>
              <a href="#" className="text-neutral-600 hover:text-primary">Terms</a>
              <a href="#" className="text-neutral-600 hover:text-primary">Support</a>
            </div>
          </div>
          <div className="mt-4 text-center md:text-left text-sm text-neutral-500">
            © 2023 NutriTrack. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
