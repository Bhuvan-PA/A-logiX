import { useOnboardingStore } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";

interface GoalOption {
  id: string;
  title: string;
  description?: string;
  icon: string;
  bgColor: string;
  isPro?: boolean;
}

const goalOptions: GoalOption[] = [
  {
    id: "coach",
    title: "Coach Guidance",
    icon: "fas fa-user-tie",
    bgColor: "bg-primary/10 text-primary",
  },
  {
    id: "snap",
    title: "SNAP",
    description: "Smart Nutrition AI Plan",
    icon: "fas fa-brain",
    bgColor: "bg-blue-100 text-blue-600",
  },
  {
    id: "diet",
    title: "Diet Plan",
    icon: "fas fa-utensils",
    bgColor: "bg-green-100 text-green-600",
  },
  {
    id: "weight",
    title: "Weight Loss",
    icon: "fas fa-weight",
    bgColor: "bg-red-100 text-red-600",
  },
  {
    id: "fasting",
    title: "Intermittent Fasting",
    icon: "fas fa-hourglass-half",
    bgColor: "bg-purple-100 text-purple-600",
  },
  {
    id: "calories",
    title: "Calorie Tracker",
    icon: "fas fa-fire",
    bgColor: "bg-orange-100 text-orange-600",
  },
  {
    id: "muscle",
    title: "Muscle Gain",
    icon: "fas fa-dumbbell",
    bgColor: "bg-blue-100 text-blue-600",
  },
  {
    id: "workout",
    title: "Workouts and Yoga",
    icon: "fas fa-running",
    bgColor: "bg-indigo-100 text-indigo-600",
  },
  {
    id: "healthy",
    title: "Healthy Foods",
    icon: "fas fa-apple-alt",
    bgColor: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "cgm",
    title: "CGM",
    description: "Continuous Glucose Monitoring",
    icon: "fas fa-tachometer-alt",
    bgColor: "bg-gray-100 text-gray-600",
    isPro: true,
  },
];

export default function GoalsPage() {
  const { goals, setGoals } = useOnboardingStore();

  const toggleGoal = (goalId: string) => {
    if (goals.includes(goalId)) {
      setGoals(goals.filter(id => id !== goalId));
    } else {
      setGoals([...goals, goalId]);
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-3">What are you looking for?</h2>
      <p className="text-neutral-600 mb-8">Select all that apply to customize your experience</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {goalOptions.map((option) => (
          <div
            key={option.id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-1",
              goals.includes(option.id) ? "border-primary bg-primary/5" : "border-neutral-200"
            )}
            onClick={() => toggleGoal(option.id)}
          >
            <div className="text-center">
              <div className={cn("w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3", option.bgColor)}>
                <i className={`${option.icon} text-xl`}></i>
              </div>
              <h3 className="font-medium text-neutral-800">{option.title}</h3>
              {option.description && (
                <p className="text-xs text-neutral-500">{option.description}</p>
              )}
              {option.isPro && (
                <div className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
                  PRO
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
