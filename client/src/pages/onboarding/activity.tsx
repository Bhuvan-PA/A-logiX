import { useOnboardingStore } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";

interface ActivityOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const activityOptions: ActivityOption[] = [
  {
    id: "mostly-sitting",
    title: "Mostly Sitting",
    description: "E.g., desk job, driving",
    icon: "fas fa-chair",
  },
  {
    id: "often-standing",
    title: "Often Standing",
    description: "E.g., retail, teaching",
    icon: "fas fa-store",
  },
  {
    id: "regularly-walking",
    title: "Regularly Walking",
    description: "E.g., fieldwork, nursing",
    icon: "fas fa-walking",
  },
  {
    id: "physically-intense",
    title: "Physically Intense Work",
    description: "E.g., construction, athletics",
    icon: "fas fa-hammer",
  },
];

export default function ActivityPage() {
  const { activity, setActivity } = useOnboardingStore();

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-3">How active are you?</h2>
      <p className="text-neutral-600 mb-8">Based on your lifestyle, we can assess your daily calorie requirements</p>
      
      <div className="space-y-4">
        {activityOptions.map((option) => (
          <div
            key={option.id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer flex items-center transition-all hover:shadow-md",
              activity === option.id ? "border-primary bg-primary/5" : "border-neutral-200"
            )}
            onClick={() => setActivity(option.id)}
          >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
              <i className={`${option.icon} text-primary text-xl`}></i>
            </div>
            <div>
              <h3 className="font-medium text-neutral-800">{option.title}</h3>
              <p className="text-sm text-neutral-500">{option.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
