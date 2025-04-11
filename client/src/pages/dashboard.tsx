import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { format, subDays } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { apiRequest } from "@/lib/queryClient";

import { 
  User, 
  Calendar as CalendarIcon, 
  Plus, 
  Camera, 
  Settings,
  Activity, 
  Utensils, 
  FileText,
  Weight, 
  Dumbbell, 
  Footprints, 
  MoonStar, 
  Droplets, 
  Pill, 
  Apple, 
  Smile,
  ChevronDown,
  ChevronRight,
  BarChart,
  Clock,
  MessageSquare,
  Upload,
  ArrowUpCircle,
  Check,
  X,
  PieChart,
  TrendingUp
} from "lucide-react";
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
  calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  notes: string | null;
}

interface LifestyleLog {
  id: string;
  type: string;
  value: number | string;
  unit: string;
  time: string;
  notes?: string;
}

export default function Dashboard() {
  // User state
  const userId = useOnboardingStore(state => state.userId);
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  
  // Dashboard state
  const [nutritionPlan, setNutritionPlan] = useState<NutritionPlan | null>(null);
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  const [lifestyleLogs, setLifestyleLogs] = useState<LifestyleLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Date filtering
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [dateFilter, setDateFilter] = useState<string>("today");
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Meal tracking
  const [mealImage, setMealImage] = useState<string | null>(null);
  const [mealImageProcessing, setMealImageProcessing] = useState(false);
  const [mealFormOpen, setMealFormOpen] = useState(false);
  const [mealForm, setMealForm] = useState({
    mealType: "lunch",
    foodName: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    notes: ""
  });
  
  // Lifestyle tracking
  const [activeTracker, setActiveTracker] = useState<string | null>(null);
  const [trackerForm, setTrackerForm] = useState({
    value: "",
    notes: ""
  });
  
  // Feedback section
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  
  // First load effect
  useEffect(() => {
    if (!userId) {
      navigate("/auth");
      return;
    }
    
    // Fetch nutrition plan and food logs
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch nutrition plan
        const nutritionResponse = await fetch(`/api/nutrition-plan/${userId}`);
        if (nutritionResponse.ok) {
          const nutritionData = await nutritionResponse.json();
          setNutritionPlan(nutritionData);
        }
        
        // Fetch food logs for selected date
        await fetchFoodLogs();
        
        // Set sample lifestyle logs (will be replaced with API call in production)
        setLifestyleLogs([
          {
            id: "weight-1",
            type: "weight",
            value: 75.5,
            unit: "kg",
            time: "08:00 AM"
          },
          {
            id: "steps-1",
            type: "steps",
            value: 7500,
            unit: "steps",
            time: "All day"
          },
          {
            id: "water-1",
            type: "water",
            value: 6,
            unit: "glasses",
            time: "All day"
          },
          {
            id: "sleep-1",
            type: "sleep",
            value: 7.5,
            unit: "hours",
            time: "Last night"
          }
        ]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load dashboard data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [userId, navigate, toast]);
  
  // Fetch food logs whenever date changes
  useEffect(() => {
    if (userId) {
      fetchFoodLogs();
    }
  }, [selectedDate, userId]);
  
  // Helper function to fetch food logs
  const fetchFoodLogs = async () => {
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const response = await fetch(`/api/food-logs/${userId}?date=${formattedDate}`);
      
      if (response.ok) {
        const logs = await response.json();
        setFoodLogs(logs);
      }
    } catch (error) {
      console.error("Error fetching food logs:", error);
    }
  };
  
  // Handle date filter changes
  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    
    switch (value) {
      case "today":
        setSelectedDate(today);
        break;
      case "yesterday":
        setSelectedDate(subDays(today, 1));
        break;
      case "custom":
        setShowCalendar(true);
        break;
      default:
        setSelectedDate(today);
    }
  };
  
  // Handle date selection from calendar
  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setShowCalendar(false);
    }
  };
  
  // Handle meal image upload
  const handleMealImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMealImage(event.target.result as string);
          processMealImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  // Process meal image with AI
  const processMealImage = async (imageData: string) => {
    setMealImageProcessing(true);
    
    // In a real implementation, this would call an API endpoint to process the image
    // For now, we'll simulate a delay and then set some mock data
    try {
      // Set form to open with loading state
      setMealFormOpen(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, this would come from the AI analysis
      setMealForm({
        mealType: "lunch",
        foodName: "Mixed Salad with Grilled Chicken",
        calories: "350",
        protein: "25",
        carbs: "20",
        fat: "15",
        notes: "Includes lettuce, tomatoes, cucumber, grilled chicken, olive oil dressing"
      });
      
    } catch (error) {
      toast({
        title: "Error analyzing image",
        description: "Could not process your meal image",
        variant: "destructive"
      });
    } finally {
      setMealImageProcessing(false);
    }
  };
  
  // Handle meal form submission
  const handleMealSubmit = async () => {
    if (!userId || !mealForm.foodName) return;
    
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      
      // Convert string values to numbers where needed
      const mealData = {
        userId,
        date: formattedDate,
        mealType: mealForm.mealType,
        foodName: mealForm.foodName,
        calories: mealForm.calories ? parseInt(mealForm.calories) : null,
        protein: mealForm.protein ? parseInt(mealForm.protein) : null,
        carbs: mealForm.carbs ? parseInt(mealForm.carbs) : null,
        fat: mealForm.fat ? parseInt(mealForm.fat) : null,
        notes: mealForm.notes || null
      };
      
      // First analyze the meal with AI for recommendations
      const aiAnalysisResponse = await apiRequest("POST", "/api/ai/analyze-meal", mealData);
      const aiAnalysis = await aiAnalysisResponse.json();
      
      // Create the food log entry
      const response = await apiRequest("POST", "/api/food-logs", mealData);
      
      if (response.ok) {
        // Refresh the food logs
        fetchFoodLogs();
        
        toast({
          title: "Meal logged successfully",
          description: "AI Analysis: " + aiAnalysis.recommendation,
        });
        
        // Reset form
        setMealForm({
          mealType: "lunch",
          foodName: "",
          calories: "",
          protein: "",
          carbs: "",
          fat: "",
          notes: ""
        });
        setMealImage(null);
        setMealFormOpen(false);
      }
    } catch (error) {
      toast({
        title: "Error logging meal",
        description: "Could not save your meal data",
        variant: "destructive"
      });
    }
  };
  
  // Handle lifestyle tracker submission
  const handleTrackerSubmit = async () => {
    if (!activeTracker || !trackerForm.value) return;
    
    try {
      // In a real implementation, this would call an API endpoint to save the tracker data
      const newLog: LifestyleLog = {
        id: `${activeTracker}-${Date.now()}`,
        type: activeTracker,
        value: trackerForm.value,
        unit: getTrackerUnit(activeTracker),
        time: format(new Date(), "h:mm a"),
        notes: trackerForm.notes
      };
      
      // Add to existing logs
      setLifestyleLogs([newLog, ...lifestyleLogs]);
      
      toast({
        title: "Tracked successfully",
        description: `${activeTracker.charAt(0).toUpperCase() + activeTracker.slice(1)} has been logged`,
      });
      
      // Reset form
      setTrackerForm({ value: "", notes: "" });
      setActiveTracker(null);
    } catch (error) {
      toast({
        title: "Error logging tracker",
        description: "Could not save your tracker data",
        variant: "destructive"
      });
    }
  };
  
  // Get feedback from AI based on logs
  const generateFeedback = async () => {
    if (!userId) return;
    
    try {
      setLoadingInsight(true);
      
      // In a real implementation, this would get all the user's relevant data
      // and send it to the AI endpoint for personalized feedback
      const userLogs = {
        foodLogs,
        lifestyleLogs,
        nutritionPlan
      };
      
      // Call AI endpoint
      const response = await apiRequest("POST", "/api/ai/nutrition-insight", {
        age: 30, // This would come from user profile
        gender: "male", // This would come from user profile
        conditions: ["none"], // This would come from user profile
        goals: ["weight", "healthy"], // This would come from user profile
        activity: "regularly-walking" // This would come from user profile
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiInsight(data.insight);
      }
      
    } catch (error) {
      toast({
        title: "Error generating feedback",
        description: "Could not get AI insights at this time",
        variant: "destructive"
      });
      
      setAiInsight("We couldn't generate personalized insights right now. Please try again later.");
    } finally {
      setLoadingInsight(false);
    }
  };
  
  // Helper functions
  const formatDateDisplay = (date: Date) => {
    if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) {
      return "Today";
    } else if (format(date, "yyyy-MM-dd") === format(subDays(today, 1), "yyyy-MM-dd")) {
      return "Yesterday";
    } else {
      return format(date, "MMMM d, yyyy");
    }
  };
  
  const getTrackerUnit = (type: string) => {
    switch (type) {
      case "weight": return "kg";
      case "workout": return "minutes";
      case "steps": return "steps";
      case "sleep": return "hours";
      case "water": return "glasses";
      case "medicine": return "dose";
      case "food": return "servings";
      case "mood": return "rating";
      default: return "";
    }
  };
  
  const getTrackerIcon = (type: string) => {
    switch (type) {
      case "weight": return <Weight className="h-5 w-5" />;
      case "workout": return <Dumbbell className="h-5 w-5" />;
      case "steps": return <Footprints className="h-5 w-5" />;
      case "sleep": return <MoonStar className="h-5 w-5" />;
      case "water": return <Droplets className="h-5 w-5" />;
      case "medicine": return <Pill className="h-5 w-5" />;
      case "food": return <Apple className="h-5 w-5" />;
      case "mood": return <Smile className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };
  
  const getMealTypeColor = (type: string) => {
    switch (type) {
      case "breakfast": return "bg-yellow-500";
      case "lunch": return "bg-green-500";
      case "dinner": return "bg-indigo-500";
      case "snack": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };
  
  const calculateTotalNutrients = () => {
    let totals = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    };
    
    foodLogs.forEach(log => {
      if (log.calories) totals.calories += log.calories;
      if (log.protein) totals.protein += log.protein;
      if (log.carbs) totals.carbs += log.carbs;
      if (log.fat) totals.fat += log.fat;
    });
    
    return totals;
  };
  
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };
  
  const nutrients = calculateTotalNutrients();
  const calorieGoal = nutritionPlan?.calorieGoal || 2000;
  const calorieProgress = getProgressPercentage(nutrients.calories, calorieGoal);
  
  if (isLoading) {
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
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 py-4 px-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="hidden md:flex"
            >
              Dashboard
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="hidden md:flex"
              onClick={() => navigate("/profile")}
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="" alt="Profile" />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow py-6 px-4">
        <div className="container mx-auto">
          {/* Date Filter */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">My Dashboard</h1>
            <div className="flex items-center space-x-2">
              <Select value={dateFilter} onValueChange={handleDateFilterChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="custom">Select Date</SelectItem>
                </SelectContent>
              </Select>
              <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formatDateDisplay(selectedDate)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleCalendarSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Dashboard Tabs */}
          <Tabs defaultValue="overview" className="mb-6" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              {/* Nutrition Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-primary" />
                    Daily Progress
                  </CardTitle>
                  <CardDescription>
                    Your nutrition and lifestyle summary for {formatDateDisplay(selectedDate)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Calories: {nutrients.calories} / {calorieGoal}
                        </span>
                        <span className="text-sm font-medium text-neutral-500">
                          {calorieProgress}%
                        </span>
                      </div>
                      <Progress value={calorieProgress} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-neutral-100 rounded-lg p-3">
                        <div className="text-sm text-neutral-500 mb-1">Protein</div>
                        <div className="text-lg font-semibold">{nutrients.protein}g</div>
                      </div>
                      <div className="bg-neutral-100 rounded-lg p-3">
                        <div className="text-sm text-neutral-500 mb-1">Carbs</div>
                        <div className="text-lg font-semibold">{nutrients.carbs}g</div>
                      </div>
                      <div className="bg-neutral-100 rounded-lg p-3">
                        <div className="text-sm text-neutral-500 mb-1">Fat</div>
                        <div className="text-lg font-semibold">{nutrients.fat}g</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Meals */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      <Utensils className="w-5 h-5 mr-2 text-primary" />
                      Recent Meals
                    </CardTitle>
                    <Button 
                      size="sm" 
                      onClick={() => setMealFormOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Meal
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {foodLogs.length === 0 ? (
                    <div className="text-center py-8">
                      <Utensils className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                      <p className="text-neutral-500">No meals logged for this day</p>
                      <Button 
                        variant="outline" 
                        className="mt-4" 
                        onClick={() => setMealFormOpen(true)}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Log a meal
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {foodLogs.map(log => (
                        <div key={log.id} className="flex gap-4 border-b pb-4">
                          <div className={`w-2 self-stretch ${getMealTypeColor(log.mealType)} rounded-full`}></div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">{log.foodName}</h4>
                                <p className="text-sm text-neutral-500 capitalize">{log.mealType}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold">
                                  {log.calories} kcal
                                </span>
                                <div className="text-xs text-neutral-500">
                                  P: {log.protein}g • C: {log.carbs}g • F: {log.fat}g
                                </div>
                              </div>
                            </div>
                            {log.notes && (
                              <p className="mt-2 text-sm text-neutral-600">{log.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Lifestyle Trackers */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-primary" />
                      Today's Health Trackers
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {["weight", "workout", "steps", "sleep", "water", "medicine", "food", "mood"].map(tracker => (
                      <div 
                        key={tracker}
                        className="border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors"
                        onClick={() => setActiveTracker(tracker)}
                      >
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                            {getTrackerIcon(tracker)}
                          </div>
                          <span className="text-sm font-medium capitalize">{tracker}</span>
                        </div>
                        
                        {lifestyleLogs.find(log => log.type === tracker) ? (
                          <div className="text-sm">
                            <span className="font-semibold">
                              {lifestyleLogs.find(log => log.type === tracker)?.value}
                              {" "}
                              {getTrackerUnit(tracker)}
                            </span>
                          </div>
                        ) : (
                          <div className="text-xs text-neutral-500 flex items-center">
                            <Plus className="w-3 h-3 mr-1" />
                            <span>Add {tracker}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Wellness Log & Feedback */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary" />
                    Your Wellness Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-neutral-600 text-sm">
                      Get AI-powered feedback based on your nutrition and lifestyle data.
                    </p>
                  </div>
                  
                  {aiInsight ? (
                    <div className="bg-neutral-100 rounded-lg p-4 mb-4">
                      <div className="flex items-start mb-2">
                        <MessageSquare className="w-5 h-5 mr-2 text-primary" />
                        <div className="font-medium">AI Feedback</div>
                      </div>
                      <p className="text-neutral-700">{aiInsight}</p>
                    </div>
                  ) : (
                    <Button 
                      onClick={generateFeedback}
                      disabled={loadingInsight}
                      className="w-full"
                    >
                      {loadingInsight ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          Generating insights...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Get Detailed Feedback
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Nutrition Tab */}
            <TabsContent value="nutrition" className="space-y-4">
              {/* Nutrition Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <PieChart className="w-5 h-5 mr-2 text-primary" />
                    Your Nutrition Plan
                  </CardTitle>
                  <CardDescription>
                    Personalized nutrition recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-neutral-100 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Daily Calorie Goal</h3>
                      <div className="text-2xl font-bold text-primary">
                        {nutritionPlan?.calorieGoal || 2000} kcal
                      </div>
                      <p className="text-sm text-neutral-500 mt-2">
                        Based on your age, gender, weight, and activity level
                      </p>
                    </div>
                    
                    <div className="bg-neutral-100 rounded-lg p-4">
                      <h3 className="font-medium mb-2">Macro Split</h3>
                      <div className="text-lg font-medium">
                        {nutritionPlan?.nutritionSplit || "40% Carbs, 30% Protein, 30% Fat"}
                      </div>
                      <p className="text-sm text-neutral-500 mt-2">
                        Recommended distribution for your goals
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Foods to Focus On</h3>
                    <div className="flex flex-wrap gap-2">
                      {nutritionPlan?.focusFoods?.map((food, index) => (
                        <Badge key={index} variant="secondary">
                          {food}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {nutritionPlan?.aiInsight && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-4">
                      <div className="flex items-start mb-2">
                        <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                        <div className="font-medium">AI Nutrition Insight</div>
                      </div>
                      <p className="text-sm">{nutritionPlan.aiInsight}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Track Your Meal */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Utensils className="w-5 h-5 mr-2 text-primary" />
                    Track Your Meal
                  </CardTitle>
                  <CardDescription>
                    Upload a photo or manually log your meal
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Photo Upload Option */}
                    <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                      <Camera className="w-12 h-12 text-neutral-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Upload Meal Photo</h3>
                      <p className="text-sm text-neutral-500 mb-4">
                        Our AI will detect your food and estimate nutrition
                      </p>
                      <label className="cursor-pointer">
                        <Button className="relative">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photo
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={handleMealImageUpload}
                          />
                        </Button>
                      </label>
                    </div>
                    
                    {/* Manual Entry Option */}
                    <div className="border rounded-lg p-6 flex flex-col items-center justify-center text-center">
                      <FileText className="w-12 h-12 text-neutral-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Manual Entry</h3>
                      <p className="text-sm text-neutral-500 mb-4">
                        Keep track of your meals and their nutritional content
                      </p>
                      <Button onClick={() => setMealFormOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Manually
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Meals */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-primary" />
                    Today's Meals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {foodLogs.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-neutral-500">No meals logged for today</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {foodLogs.map(log => (
                        <div key={log.id} className="flex gap-4 border-b pb-4">
                          <div className={`w-2 self-stretch ${getMealTypeColor(log.mealType)} rounded-full`}></div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="font-medium">{log.foodName}</h4>
                                <p className="text-sm text-neutral-500 capitalize">{log.mealType}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-semibold">
                                  {log.calories} kcal
                                </span>
                                <div className="text-xs text-neutral-500">
                                  P: {log.protein}g • C: {log.carbs}g • F: {log.fat}g
                                </div>
                              </div>
                            </div>
                            {log.notes && (
                              <p className="mt-2 text-sm text-neutral-600">{log.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Lifestyle Tab */}
            <TabsContent value="lifestyle" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Health Trackers Card */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-primary" />
                      Health Trackers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["weight", "workout", "steps", "sleep", "water", "medicine", "food", "mood"].map(tracker => (
                        <div 
                          key={tracker}
                          className="border rounded-lg p-3 hover:border-primary cursor-pointer transition-colors"
                          onClick={() => setActiveTracker(tracker)}
                        >
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                              {getTrackerIcon(tracker)}
                            </div>
                            <span className="text-sm font-medium capitalize">{tracker}</span>
                          </div>
                          
                          {lifestyleLogs.find(log => log.type === tracker) ? (
                            <div className="text-sm">
                              <span className="font-semibold">
                                {lifestyleLogs.find(log => log.type === tracker)?.value}
                                {" "}
                                {getTrackerUnit(tracker)}
                              </span>
                            </div>
                          ) : (
                            <div className="text-xs text-neutral-500 flex items-center">
                              <Plus className="w-3 h-3 mr-1" />
                              <span>Track now</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recent Logs Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-primary" />
                      Recent Logs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lifestyleLogs.map(log => (
                        <div key={log.id} className="border-b pb-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                              {getTrackerIcon(log.type)}
                            </div>
                            <div>
                              <div className="font-medium capitalize">{log.type}</div>
                              <div className="text-sm text-neutral-500">
                                {log.value} {log.unit} • {log.time}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Meal Form Dialog */}
      {mealFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Log a Meal</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setMealFormOpen(false);
                  setMealImage(null);
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4">
              {mealImageProcessing ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-neutral-600">Analyzing your meal with AI...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mealImage && (
                    <div className="mb-4">
                      <p className="text-sm font-medium mb-2">Uploaded image:</p>
                      <img 
                        src={mealImage} 
                        alt="Meal"
                        className="max-h-48 rounded-lg mx-auto"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="mealType">Meal Type</Label>
                    <Select 
                      value={mealForm.mealType} 
                      onValueChange={(value) => setMealForm({...mealForm, mealType: value})}
                    >
                      <SelectTrigger id="mealType">
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="foodName">Food Name</Label>
                    <Input 
                      id="foodName" 
                      value={mealForm.foodName}
                      onChange={(e) => setMealForm({...mealForm, foodName: e.target.value})}
                      placeholder="e.g., Grilled Chicken Salad"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="calories">Calories</Label>
                      <Input 
                        id="calories" 
                        type="number"
                        value={mealForm.calories}
                        onChange={(e) => setMealForm({...mealForm, calories: e.target.value})}
                        placeholder="e.g., 350"
                      />
                    </div>
                    <div>
                      <Label htmlFor="protein">Protein (g)</Label>
                      <Input 
                        id="protein" 
                        type="number"
                        value={mealForm.protein}
                        onChange={(e) => setMealForm({...mealForm, protein: e.target.value})}
                        placeholder="e.g., 25"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="carbs">Carbs (g)</Label>
                      <Input 
                        id="carbs" 
                        type="number"
                        value={mealForm.carbs}
                        onChange={(e) => setMealForm({...mealForm, carbs: e.target.value})}
                        placeholder="e.g., 30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fat">Fat (g)</Label>
                      <Input 
                        id="fat" 
                        type="number"
                        value={mealForm.fat}
                        onChange={(e) => setMealForm({...mealForm, fat: e.target.value})}
                        placeholder="e.g., 15"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      value={mealForm.notes}
                      onChange={(e) => setMealForm({...mealForm, notes: e.target.value})}
                      placeholder="Add any additional details about your meal"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setMealFormOpen(false);
                    setMealImage(null);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleMealSubmit}
                  disabled={mealImageProcessing || !mealForm.foodName}
                >
                  Save Meal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tracker Form Dialog */}
      {activeTracker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center">
                {getTrackerIcon(activeTracker)}
                <span className="ml-2 capitalize">{activeTracker} Tracker</span>
              </h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setActiveTracker(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="trackerValue">
                    {activeTracker === "weight" ? "Current Weight" : 
                     activeTracker === "workout" ? "Minutes Exercised" :
                     activeTracker === "steps" ? "Steps Taken" :
                     activeTracker === "sleep" ? "Hours Slept" :
                     activeTracker === "water" ? "Glasses of Water" :
                     activeTracker === "medicine" ? "Medication Taken" :
                     activeTracker === "food" ? "Servings" :
                     activeTracker === "mood" ? "Mood Rating (1-10)" :
                     "Value"}
                  </Label>
                  <div className="flex">
                    <Input 
                      id="trackerValue" 
                      type={["weight", "workout", "steps", "sleep", "water"].includes(activeTracker) ? "number" : "text"}
                      value={trackerForm.value}
                      onChange={(e) => setTrackerForm({...trackerForm, value: e.target.value})}
                      placeholder={`Enter your ${activeTracker}`}
                      className="rounded-r-none"
                    />
                    <div className="bg-neutral-100 px-3 flex items-center border border-l-0 rounded-r-md">
                      {getTrackerUnit(activeTracker)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea 
                    id="notes" 
                    value={trackerForm.notes}
                    onChange={(e) => setTrackerForm({...trackerForm, notes: e.target.value})}
                    placeholder="Add any additional details"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button 
                  variant="outline"
                  onClick={() => setActiveTracker(null)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleTrackerSubmit}
                  disabled={!trackerForm.value}
                >
                  Save Entry
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}