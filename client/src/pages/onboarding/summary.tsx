import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  calculateBMR, 
  generateNutritionSplit, 
  generateFocusFoods, 
  generateAIInsight 
} from "@/lib/utils";

interface NutritionPlan {
  calorieGoal: number;
  nutritionSplit: string;
  focusFoods: string[];
  aiInsight: string;
}

export default function SummaryPage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const store = useOnboardingStore();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<NutritionPlan>({
    calorieGoal: 0,
    nutritionSplit: "",
    focusFoods: [],
    aiInsight: ""
  });

  // Generate the nutrition plan on component mount
  useEffect(() => {
    const generatePlan = () => {
      // Calculate calorie goal based on age, gender, and activity level
      const calorieGoal = calculateBMR(store.age, store.gender, store.activity);
      
      // Generate nutrition split based on selected goals
      const nutritionSplit = generateNutritionSplit(store.goals);
      
      // Generate focus foods based on medical conditions and goals
      const focusFoods = generateFocusFoods(store.conditions, store.goals);
      
      // Generate AI insight based on user profile
      const aiInsight = generateAIInsight(
        store.age,
        store.gender,
        store.conditions,
        store.goals
      );
      
      setPlan({
        calorieGoal,
        nutritionSplit,
        focusFoods,
        aiInsight
      });
    };
    
    generatePlan();
  }, [store]);

  const handleFinish = async () => {
    if (!store.userId) {
      toast({
        title: "Error",
        description: "User ID not found. Please try logging in again.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    setLoading(true);
    
    try {
      // Save onboarding data to server
      await apiRequest("POST", `/api/onboarding/${store.userId}`, {
        goals: store.goals,
        activity: store.activity,
        age: store.age,
        country: store.country,
        languages: store.languages,
        gender: store.gender,
        conditions: store.conditions,
      });
      
      // Create nutrition plan
      await apiRequest("POST", "/api/nutrition-plan", {
        userId: store.userId,
        calorieGoal: plan.calorieGoal,
        nutritionSplit: plan.nutritionSplit,
        focusFoods: plan.focusFoods,
        aiInsight: plan.aiInsight,
      });
      
      toast({
        title: "Success!",
        description: "Your personalized plan is ready. Welcome to NutriTrack!",
      });
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check text-primary text-2xl"></i>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">You're all set!</h2>
        <p className="text-neutral-600">We've created your personalized nutrition plan</p>
      </div>
      
      <Card className="bg-neutral-50 border-neutral-200 mb-6">
        <CardContent className="pt-5">
          <h3 className="font-semibold text-neutral-800 mb-4">Your Personalized Plan</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-bullseye text-primary"></i>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800">Daily Calorie Goal</h4>
                <p className="text-neutral-600">{plan.calorieGoal.toLocaleString()} calories</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-carrot text-primary"></i>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800">Recommended Nutrition Split</h4>
                <p className="text-neutral-600">{plan.nutritionSplit}</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-apple-alt text-primary"></i>
              </div>
              <div>
                <h4 className="font-medium text-neutral-800">Focus Foods</h4>
                <p className="text-neutral-600">{plan.focusFoods.join(', ')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-primary/5 border-primary/20 mb-8">
        <CardContent className="pt-5">
          <div className="flex">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3 shrink-0">
              <i className="fas fa-robot text-primary"></i>
            </div>
            <div>
              <h3 className="font-semibold text-neutral-800 mb-2">AI Nutrition Insight</h3>
              <p className="text-neutral-600 text-sm">{plan.aiInsight}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button 
          onClick={handleFinish} 
          disabled={loading}
          className="px-6 py-3"
        >
          {loading ? 'Finalizing your plan...' : 'Take Me to My Dashboard'}
        </Button>
      </div>
    </div>
  );
}
