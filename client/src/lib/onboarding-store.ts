import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserOnboarding } from "@shared/schema";

interface OnboardingState extends UserOnboarding {
  userId: number | null;
  currentStep: number;
  totalSteps: number;
  
  // Methods
  setUserId: (id: number | null) => void;
  setGoals: (goals: string[]) => void;
  setActivity: (activity: string) => void;
  setAge: (age: number) => void;
  setCountry: (country: string) => void;
  setLanguages: (languages: string[]) => void;
  setGender: (gender: string) => void;
  setConditions: (conditions: string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

const initialState: Omit<OnboardingState, 'setUserId' | 'setGoals' | 'setActivity' | 'setAge' | 'setCountry' | 'setLanguages' | 'setGender' | 'setConditions' | 'nextStep' | 'prevStep' | 'goToStep' | 'reset'> = {
  userId: null,
  goals: [],
  activity: '',
  age: 30,
  country: '',
  languages: ['English'],
  gender: '',
  conditions: [],
  currentStep: 1,
  totalSteps: 6
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setUserId: (id) => set({ userId: id }),
      setGoals: (goals) => set({ goals }),
      setActivity: (activity) => set({ activity }),
      setAge: (age) => set({ age }),
      setCountry: (country) => set({ country }),
      setLanguages: (languages) => set({ languages }),
      setGender: (gender) => set({ gender }),
      setConditions: (conditions) => set({ conditions }),
      
      nextStep: () => set((state) => ({ 
        currentStep: Math.min(state.currentStep + 1, state.totalSteps) 
      })),
      
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(state.currentStep - 1, 1) 
      })),
      
      goToStep: (step) => set({ currentStep: step }),
      
      reset: () => set(initialState)
    }),
    {
      name: 'nutritrack-onboarding'
    }
  )
);
