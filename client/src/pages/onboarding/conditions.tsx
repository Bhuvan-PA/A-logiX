import { useState } from "react";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

interface ConditionOption {
  id: string;
  title: string;
  icon: string;
  category?: "physical" | "mental" | "general";
}

const conditionOptions: ConditionOption[] = [
  { id: "none", title: "None", icon: "fas fa-check", category: "general" },
  { id: "diabetes", title: "Diabetes", icon: "fas fa-heartbeat", category: "physical" },
  { id: "pre-diabetes", title: "Pre-diabetes", icon: "fas fa-chart-line", category: "physical" },
  { id: "cholesterol", title: "Cholesterol", icon: "fas fa-tint", category: "physical" },
  { id: "hypertension", title: "Hypertension", icon: "fas fa-heart", category: "physical" },
  { id: "pcos", title: "PCOS", icon: "fas fa-venus", category: "physical" },
  { id: "thyroid", title: "Thyroid", icon: "fas fa-thermometer", category: "physical" },
  { id: "physical-injury", title: "Physical Injury", icon: "fas fa-bone", category: "physical" },
  { id: "stress-anxiety", title: "Excessive Stress/Anxiety", icon: "fas fa-brain", category: "mental" },
  { id: "sleep-issues", title: "Sleep Issues", icon: "fas fa-moon", category: "mental" },
  { id: "depression", title: "Depression", icon: "fas fa-cloud-rain", category: "mental" },
  { id: "anger-issues", title: "Anger Issues", icon: "fas fa-fire", category: "mental" },
  { id: "loneliness", title: "Loneliness", icon: "fas fa-user", category: "mental" },
  { id: "relationship-stress", title: "Relationship Stress", icon: "fas fa-users", category: "mental" },
];

export default function ConditionsPage() {
  const { conditions, setConditions } = useOnboardingStore();

  const toggleCondition = (conditionId: string) => {
    // If selecting "None", clear other selections
    if (conditionId === "none") {
      setConditions(["none"]);
      return;
    }

    // If selecting a specific condition, remove "None" if it's selected
    let updatedConditions = [...conditions];
    if (updatedConditions.includes("none")) {
      updatedConditions = updatedConditions.filter(id => id !== "none");
    }

    // Toggle the selected condition
    if (updatedConditions.includes(conditionId)) {
      updatedConditions = updatedConditions.filter(id => id !== conditionId);
    } else {
      updatedConditions.push(conditionId);
    }

    setConditions(updatedConditions);
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-3">Any medical conditions we should be aware of?</h2>
      <p className="text-neutral-600 mb-8">Select all that apply to customize your nutrition plan</p>
      
      <div className="space-y-4 mb-8">
        <div
          className={cn(
            "border rounded-lg p-4 cursor-pointer flex items-center transition-all hover:shadow-md",
            conditions.includes("none") ? "border-primary bg-primary/5" : "border-neutral-200"
          )}
          onClick={() => toggleCondition("none")}
        >
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <i className="fas fa-check text-green-600"></i>
          </div>
          <h3 className="font-medium text-neutral-800">None</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {conditionOptions.filter(c => c.id !== "none").map((condition) => (
            <div
              key={condition.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md",
                conditions.includes(condition.id) ? "border-primary bg-primary/5" : "border-neutral-200"
              )}
              onClick={() => toggleCondition(condition.id)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <i className={`${condition.icon} text-primary`}></i>
                </div>
                <h3 className="font-medium text-neutral-800">{condition.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Alert className="bg-neutral-50 border-neutral-200">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle className="text-sm font-medium text-neutral-700">Why we need this</AlertTitle>
        <AlertDescription className="text-sm text-neutral-600">
          Your medical conditions help us tailor your nutrition plan for optimal health. This information is kept private and only used to personalize your experience.
        </AlertDescription>
      </Alert>
    </div>
  );
}
