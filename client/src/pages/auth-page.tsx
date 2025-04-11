import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Logo } from "@/components/logo";
import { useOnboardingStore } from "@/lib/onboarding-store";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const setUserId = useOnboardingStore(state => state.setUserId);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiRequest("POST", "/api/register", formData);
      const userData = await response.json();
      
      toast({
        title: "Account created successfully",
        description: "Welcome to NutriTrack!",
      });
      
      setUserId(userData.id);
      navigate("/onboarding/goals");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiRequest("POST", "/api/login", {
        username: formData.username,
        password: formData.password,
      });
      const userData = await response.json();
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      setUserId(userData.id);
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-neutral-200 py-4 px-4 fixed top-0 w-full z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="hidden md:block">
            <Button variant="ghost" onClick={() => setIsLogin(true)}>Log in</Button>
            <Button onClick={() => setIsLogin(false)}>Sign up</Button>
          </div>
          <button className="md:hidden text-neutral-600">
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </header>

      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">
                  {isLogin ? "Welcome Back" : "Welcome to NutriTrack"}
                </h1>
                <p className="text-neutral-600">
                  {isLogin ? "Log in to your account" : "Your personal health and nutrition coach"}
                </p>
              </div>

              <div className="mb-8">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <Button variant="outline" className="w-full">
                    <img src="https://cdn.jsdelivr.net/npm/simple-icons@v6/icons/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                    <span>Continue with Google</span>
                  </Button>
                  <Button variant="outline" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    <i className="fab fa-facebook mr-2"></i>
                    <span>Continue with Facebook</span>
                  </Button>
                </div>

                <div className="flex items-center my-6">
                  <Separator className="flex-grow" />
                  <span className="flex-shrink px-4 text-neutral-400 text-sm">
                    or {isLogin ? "log in" : "sign up"} with email
                  </span>
                  <Separator className="flex-grow" />
                </div>

                {isLogin ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-3"
                        placeholder="username"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3"
                        placeholder="At least 8 characters"
                      />
                    </div>

                    <div className="mt-2">
                      <Button type="submit" className="w-full">Log In</Button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-3"
                        placeholder="johnsmith"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3"
                        placeholder="At least 8 characters"
                      />
                    </div>

                    <div className="mt-2">
                      <Button type="submit" className="w-full">Create Account</Button>
                    </div>
                  </form>
                )}
              </div>

              <div className="text-center text-neutral-600 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Button
                  variant="link"
                  className="text-primary font-medium"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign up" : "Log in"}
                </Button>
              </div>
            </CardContent>
          </Card>
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
