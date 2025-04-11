import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import OnboardingLayout from "@/pages/onboarding/layout";
import GoalsPage from "@/pages/onboarding/goals";
import ActivityPage from "@/pages/onboarding/activity";
import AgePage from "@/pages/onboarding/age";
import LocationPage from "@/pages/onboarding/location";
import GenderPage from "@/pages/onboarding/gender";
import ConditionsPage from "@/pages/onboarding/conditions";
import SummaryPage from "@/pages/onboarding/summary";
import Dashboard from "@/pages/dashboard";
import ProfilePage from "@/pages/profile-page";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthPage} />
      <Route path="/onboarding/goals" component={() => <OnboardingLayout><GoalsPage /></OnboardingLayout>} />
      <Route path="/onboarding/activity" component={() => <OnboardingLayout><ActivityPage /></OnboardingLayout>} />
      <Route path="/onboarding/age" component={() => <OnboardingLayout><AgePage /></OnboardingLayout>} />
      <Route path="/onboarding/location" component={() => <OnboardingLayout><LocationPage /></OnboardingLayout>} />
      <Route path="/onboarding/gender" component={() => <OnboardingLayout><GenderPage /></OnboardingLayout>} />
      <Route path="/onboarding/conditions" component={() => <OnboardingLayout><ConditionsPage /></OnboardingLayout>} />
      <Route path="/onboarding/summary" component={() => <OnboardingLayout><SummaryPage /></OnboardingLayout>} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/profile" component={ProfilePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
