import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { useOnboardingStore } from "@/lib/onboarding-store";

const steps = [
  { path: "/onboarding/goals", title: "Goals" },
  { path: "/onboarding/activity", title: "Activity" },
  { path: "/onboarding/age", title: "Age" },
  { path: "/onboarding/location", title: "Location" },
  { path: "/onboarding/gender", title: "Gender" },
  { path: "/onboarding/conditions", title: "Conditions" },
  { path: "/onboarding/summary", title: "Summary" },
];

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  const [location, navigate] = useLocation();
  const { currentStep, totalSteps, nextStep, prevStep, userId } = useOnboardingStore();

  useEffect(() => {
    // Redirect to auth if no userId
    if (userId === null) {
      navigate("/");
    }
  }, [userId, navigate]);

  const handleNextClick = () => {
    nextStep();
    const nextPath = steps[currentStep] || steps[steps.length - 1];
    navigate(nextPath.path);
  };

  const handlePreviousClick = () => {
    prevStep();
    const prevPath = steps[currentStep - 2] || steps[0];
    navigate(prevPath.path);
  };

  // Calculate progress percentage
  // Subtract 1 from currentStep because arrays are 0-indexed and our steps start at 1
  const currentStepIndex = steps.findIndex(step => step.path === location);
  const progressPercentage = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-neutral-200 py-4 px-4 fixed top-0 w-full z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
        </div>
      </header>

      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Progress Bar */}
          <div className="mb-8 mt-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-medium text-neutral-500">Your Progress</h2>
              <span className="text-sm font-medium text-neutral-500">
                {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
            <div className="w-full h-1 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
            {children}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePreviousClick}
              disabled={currentStepIndex === 0}
            >
              Previous
            </Button>

            <Button 
              onClick={handleNextClick}
              disabled={currentStepIndex === steps.length - 1}
            >
              {currentStepIndex === steps.length - 1 ? "Finish" : "Next"}
            </Button>
          </div>
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
