import { useOnboardingStore } from "@/lib/onboarding-store";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function AgePage() {
  const { age, setAge } = useOnboardingStore();

  const handleAgeChange = (value: number[]) => {
    setAge(value[0]);
  };

  const getAgeCategory = (age: number): string => {
    if (age < 18) return "Teen";
    if (age < 30) return "Young Adult";
    if (age < 50) return "Adult";
    if (age < 65) return "Mature Adult";
    return "Senior";
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-3">What's your age?</h2>
      <p className="text-neutral-600 mb-8">Your age determines how much you should consume</p>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="ageSlider" className="block text-sm font-medium text-neutral-700">
            Your age: <span className="font-semibold">{age}</span> years
          </label>
          <span className="text-sm text-neutral-500">{getAgeCategory(age)}</span>
        </div>
        
        <Slider
          id="ageSlider"
          min={15}
          max={90}
          step={1}
          defaultValue={[age]}
          onValueChange={handleAgeChange}
          className="w-full"
        />
      </div>
      
      <Alert variant="default" className="bg-neutral-50 border-neutral-200">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle className="text-sm font-medium text-neutral-700">Why we need this</AlertTitle>
        <AlertDescription className="text-sm text-neutral-600">
          Your metabolic rate and nutritional needs vary with age. We use this information to calculate appropriate calorie and nutrient targets.
        </AlertDescription>
      </Alert>
    </div>
  );
}
