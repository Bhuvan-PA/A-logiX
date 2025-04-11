import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useOnboardingStore } from "@/lib/onboarding-store";
import { Logo } from "@/components/logo";

// Import mockup icons and images
import { User, Users, Activity, Heart, Utensils, Camera, Calendar, Edit, Save } from "lucide-react";

export default function ProfilePage() {
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const userId = useOnboardingStore(state => state.userId);
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // User profile data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    age: 30,
    gender: "male",
    country: "US",
    languages: [] as string[],
    goals: [] as string[],
    conditions: [] as string[],
    dietaryPreferences: [] as string[],
    profilePicture: ""
  });
  
  // Options arrays for selections
  const countries = [
    { id: "US", name: "United States" },
    { id: "CA", name: "Canada" },
    { id: "IN", name: "India" },
    { id: "UK", name: "United Kingdom" },
    { id: "AU", name: "Australia" },
    { id: "DE", name: "Germany" },
    { id: "FR", name: "France" },
    { id: "JP", name: "Japan" },
    { id: "BR", name: "Brazil" },
    { id: "MX", name: "Mexico" },
  ];
  
  const languages = [
    { id: "english", name: "English" },
    { id: "spanish", name: "Spanish" },
    { id: "hindi", name: "Hindi" },
    { id: "french", name: "French" },
    { id: "german", name: "German" },
  ];
  
  const goalOptions = [
    { id: "coach", title: "Coach Guidance" },
    { id: "snap", title: "SNAP (Smart Nutrition AI Plan)" },
    { id: "diet", title: "Diet Plan" },
    { id: "weight", title: "Weight Loss" },
    { id: "fasting", title: "Intermittent Fasting" },
    { id: "calories", title: "Calorie Tracker" },
    { id: "muscle", title: "Muscle Gain" },
    { id: "workout", title: "Workouts and Yoga" },
    { id: "healthy", title: "Healthy Foods" },
    { id: "cgm", title: "CGM (Continuous Glucose Monitoring)" },
  ];
  
  const conditionOptions = [
    { id: "none", title: "None" },
    { id: "diabetes", title: "Diabetes" },
    { id: "pre-diabetes", title: "Pre-diabetes" },
    { id: "cholesterol", title: "Cholesterol" },
    { id: "hypertension", title: "Hypertension" },
    { id: "pcos", title: "PCOS" },
    { id: "thyroid", title: "Thyroid" },
    { id: "physical-injury", title: "Physical Injury" },
    { id: "stress-anxiety", title: "Excessive Stress/Anxiety" },
    { id: "sleep-issues", title: "Sleep Issues" },
    { id: "depression", title: "Depression" },
  ];
  
  const dietaryPreferences = [
    { id: "all", title: "No restrictions" },
    { id: "vegetarian", title: "Vegetarian" },
    { id: "vegan", title: "Vegan" },
    { id: "keto", title: "Keto" },
    { id: "paleo", title: "Paleo" },
    { id: "gluten-free", title: "Gluten-Free" },
    { id: "dairy-free", title: "Dairy-Free" },
    { id: "low-carb", title: "Low-Carb" },
    { id: "low-fat", title: "Low-Fat" },
    { id: "pescatarian", title: "Pescatarian" },
  ];
  
  // Fetch profile data on component mount
  useEffect(() => {
    if (!userId) {
      navigate("/");
      return;
    }
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/user/${userId}`);
        
        if (response.ok) {
          const userData = await response.json();
          
          // Update profile data with user information
          setProfileData({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            username: userData.username || "",
            age: userData.age || 30,
            gender: userData.gender || "male",
            country: userData.country || "US",
            languages: userData.languages || [],
            goals: userData.goals || [],
            conditions: userData.conditions || [],
            dietaryPreferences: userData.dietaryPreferences || [],
            profilePicture: userData.profilePicture || ""
          });
        } else {
          toast({
            title: "Error fetching profile",
            description: "Could not load your profile data",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [userId, navigate, toast]);
  
  // Handle profile picture change
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileData({
            ...profileData,
            profilePicture: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  // Toggle item in array function
  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };
  
  // Handle saving profile changes
  const handleSaveProfile = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Save profile changes
      await apiRequest("PATCH", `/api/user/${userId}`, profileData);
      
      // If onboarding data exists, also update it
      await apiRequest("POST", `/api/onboarding/${userId}`, {
        goals: profileData.goals,
        activity: "regularly-walking", // Default - can be customized in the future
        age: profileData.age,
        country: profileData.country,
        languages: profileData.languages,
        gender: profileData.gender,
        conditions: profileData.conditions,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile changes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !isEditing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-neutral-200 py-4 px-4 fixed top-0 w-full z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-2" />
              <span>Profile</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-20 pb-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Profile</h1>
            {isEditing ? (
              <Button onClick={handleSaveProfile} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Profile Summary Card */}
            <Card className="lg:col-span-1">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-4">
                    {profileData.profilePicture ? (
                      <img 
                        src={profileData.profilePicture} 
                        alt="Profile" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-neutral-200 flex items-center justify-center">
                        <User className="w-16 h-16 text-neutral-400" />
                      </div>
                    )}
                    
                    {isEditing && (
                      <label 
                        htmlFor="profile-picture" 
                        className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 cursor-pointer shadow-md"
                      >
                        <Camera className="w-4 h-4" />
                        <input 
                          id="profile-picture" 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleProfilePictureChange}
                        />
                      </label>
                    )}
                  </div>
                  
                  <h2 className="text-xl font-semibold">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <p className="text-neutral-500 mb-4">@{profileData.username}</p>
                  
                  <div className="w-full">
                    <div className="flex items-center mb-2">
                      <Calendar className="w-4 h-4 mr-2 text-neutral-500" />
                      <span className="text-sm text-neutral-600">Age: {profileData.age}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      <User className="w-4 h-4 mr-2 text-neutral-500" />
                      <span className="text-sm text-neutral-600 capitalize">{profileData.gender}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-neutral-500" />
                      <span className="text-sm text-neutral-600">
                        {countries.find(c => c.id === profileData.country)?.name || ""}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Profile Details */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="personal-info">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
                  <TabsTrigger value="health-goals">Health Goals</TabsTrigger>
                  <TabsTrigger value="medical">Medical</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>
                
                {/* Personal Information Tab */}
                <TabsContent value="personal-info">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            disabled={!isEditing}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="age">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            value={profileData.age}
                            onChange={(e) => setProfileData({...profileData, age: parseInt(e.target.value) || 0})}
                            disabled={!isEditing}
                          />
                        </div>
                        <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select 
                            value={profileData.gender} 
                            onValueChange={(value) => setProfileData({...profileData, gender: value})}
                            disabled={!isEditing}
                          >
                            <SelectTrigger id="gender">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                              <SelectItem value="prefer-not-say">Prefer not to say</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Select 
                          value={profileData.country} 
                          onValueChange={(value) => setProfileData({...profileData, country: value})}
                          disabled={!isEditing}
                        >
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map(country => (
                              <SelectItem key={country.id} value={country.id}>
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>Languages</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                          {languages.map(language => (
                            <div key={language.id} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`lang-${language.id}`} 
                                checked={profileData.languages.includes(language.id)}
                                onCheckedChange={() => {
                                  if (isEditing) {
                                    setProfileData({
                                      ...profileData,
                                      languages: toggleArrayItem(profileData.languages, language.id)
                                    });
                                  }
                                }}
                                disabled={!isEditing}
                              />
                              <label 
                                htmlFor={`lang-${language.id}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {language.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Health Goals Tab */}
                <TabsContent value="health-goals">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Activity className="w-5 h-5 mr-2" />
                        Health Goals
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {goalOptions.map(goal => (
                          <div 
                            key={goal.id}
                            className={`border rounded-lg p-3 ${
                              profileData.goals.includes(goal.id) 
                                ? "border-primary bg-primary/5" 
                                : "border-neutral-200"
                            } ${isEditing ? "cursor-pointer" : ""}`}
                            onClick={() => {
                              if (isEditing) {
                                setProfileData({
                                  ...profileData,
                                  goals: toggleArrayItem(profileData.goals, goal.id)
                                });
                              }
                            }}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                <Activity className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-sm font-medium">{goal.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Medical Tab */}
                <TabsContent value="medical">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Heart className="w-5 h-5 mr-2" />
                        Medical Conditions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {conditionOptions.map(condition => (
                          <div 
                            key={condition.id}
                            className={`border rounded-lg p-3 ${
                              profileData.conditions.includes(condition.id) 
                                ? "border-primary bg-primary/5" 
                                : "border-neutral-200"
                            } ${isEditing ? "cursor-pointer" : ""}`}
                            onClick={() => {
                              if (isEditing) {
                                let updatedConditions = [...profileData.conditions];
                                
                                // Handle special case for "none"
                                if (condition.id === "none") {
                                  updatedConditions = updatedConditions.includes("none") ? [] : ["none"];
                                } else {
                                  // Remove "none" if it's present and another condition is selected
                                  if (updatedConditions.includes("none")) {
                                    updatedConditions = updatedConditions.filter(id => id !== "none");
                                  }
                                  
                                  // Toggle the selected condition
                                  updatedConditions = toggleArrayItem(updatedConditions, condition.id);
                                }
                                
                                setProfileData({
                                  ...profileData,
                                  conditions: updatedConditions
                                });
                              }
                            }}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                <Heart className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-sm font-medium">{condition.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Preferences Tab */}
                <TabsContent value="preferences">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Utensils className="w-5 h-5 mr-2" />
                        Dietary Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {dietaryPreferences.map(pref => (
                          <div 
                            key={pref.id}
                            className={`border rounded-lg p-3 ${
                              profileData.dietaryPreferences.includes(pref.id) 
                                ? "border-primary bg-primary/5" 
                                : "border-neutral-200"
                            } ${isEditing ? "cursor-pointer" : ""}`}
                            onClick={() => {
                              if (isEditing) {
                                let updatedPrefs = [...profileData.dietaryPreferences];
                                
                                // Handle special case for "all"
                                if (pref.id === "all") {
                                  updatedPrefs = updatedPrefs.includes("all") ? [] : ["all"];
                                } else {
                                  // Remove "all" if it's present and another pref is selected
                                  if (updatedPrefs.includes("all")) {
                                    updatedPrefs = updatedPrefs.filter(id => id !== "all");
                                  }
                                  
                                  // Toggle the selected preference
                                  updatedPrefs = toggleArrayItem(updatedPrefs, pref.id);
                                }
                                
                                setProfileData({
                                  ...profileData,
                                  dietaryPreferences: updatedPrefs
                                });
                              }
                            }}
                          >
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                                <Utensils className="w-4 h-4 text-primary" />
                              </div>
                              <span className="text-sm font-medium">{pref.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
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