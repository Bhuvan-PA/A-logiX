import { useOnboardingStore } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GenderOption {
  id: string;
  title: string;
  icon: string;
  bgColor: string;
  layout?: "column" | "row";
}

const genderOptions: GenderOption[] = [
  {
    id: "male",
    title: "Male",
    icon: "fas fa-mars",
    bgColor: "bg-blue-100 text-blue-600",
    layout: "column",
  },
  {
    id: "female",
    title: "Female",
    icon: "fas fa-venus",
    bgColor: "bg-pink-100 text-pink-600",
    layout: "column",
  },
  {
    id: "other",
    title: "Other",
    icon: "fas fa-transgender",
    bgColor: "bg-purple-100 text-purple-600",
    layout: "row",
  },
  {
    id: "prefer-not-say",
    title: "Prefer not to say",
    icon: "fas fa-user-secret",
    bgColor: "bg-gray-100 text-gray-600",
    layout: "row",
  },
];

export default function GenderPage() {
  const { gender, setGender } = useOnboardingStore();

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-3">What's your biological sex?</h2>
      <p className="text-neutral-600 mb-8">This helps us calculate your nutritional needs more accurately</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {genderOptions.slice(0, 2).map((option) => (
          <div
            key={option.id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
              gender === option.id ? "border-primary bg-primary/5" : "border-neutral-200"
            )}
            onClick={() => setGender(option.id)}
          >
            <div className="text-center">
              <div className={cn("w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3", option.bgColor)}>
                <i className={`${option.icon} text-xl`}></i>
              </div>
              <h3 className="font-medium text-neutral-800">{option.title}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-3">
        {genderOptions.slice(2).map((option) => (
          <div
            key={option.id}
            className={cn(
              "border rounded-lg p-4 cursor-pointer flex items-center transition-all hover:shadow-md",
              gender === option.id ? "border-primary bg-primary/5" : "border-neutral-200"
            )}
            onClick={() => setGender(option.id)}
          >
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mr-3", option.bgColor)}>
              <i className={`${option.icon}`}></i>
            </div>
            <h3 className="font-medium text-neutral-800">{option.title}</h3>
          </div>
        ))}
      </div>
      
      <Alert className="mt-6 bg-neutral-50 border-neutral-200">
        <AlertDescription className="text-sm text-neutral-600">
          This information is used only for nutritional calculations. Different bodies have different nutritional needs based on biological factors.
        </AlertDescription>
      </Alert>
    </div>
  );
}
