import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Timer, Calendar, ChevronRight, Flame, Clock, Dumbbell, Heart } from 'lucide-react';
import { format } from 'date-fns';

import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SlideIn, StaggerContainer, StaggerItem } from '@/components/animations/motion-components';
import ThreeScene from '@/components/3d/simple-scene';
import { Link } from 'wouter';

// Workout history data
const workoutHistory = [
  {
    id: 1,
    name: "Morning Cardio",
    date: "2025-04-10",
    duration: 45,
    calories: 320,
    type: "cardio"
  },
  {
    id: 2,
    name: "Upper Body Strength",
    date: "2025-04-08",
    duration: 60,
    calories: 450,
    type: "strength"
  },
  {
    id: 3,
    name: "Yoga Flow",
    date: "2025-04-07",
    duration: 30,
    calories: 180,
    type: "flexibility"
  },
  {
    id: 4,
    name: "HIIT Session",
    date: "2025-04-05",
    duration: 25,
    calories: 280,
    type: "cardio"
  },
  {
    id: 5,
    name: "Lower Body Focus",
    date: "2025-04-03",
    duration: 50,
    calories: 380,
    type: "strength"
  }
];

// Workout routine templates
const workoutRoutines = [
  {
    id: 1,
    name: "Quick Morning Burn",
    duration: 20,
    difficulty: "Easy",
    category: "cardio",
    exercises: ["Jumping Jacks", "Mountain Climbers", "Burpees", "High Knees"]
  },
  {
    id: 2,
    name: "Full Body Strength",
    duration: 45,
    difficulty: "Medium",
    category: "strength",
    exercises: ["Push-ups", "Squats", "Lunges", "Planks", "Dumbbell Rows"]
  },
  {
    id: 3,
    name: "Evening Unwinding",
    duration: 30,
    difficulty: "Easy",
    category: "flexibility",
    exercises: ["Forward Fold", "Cat-Cow Stretch", "Child's Pose", "Pigeon Pose"]
  },
  {
    id: 4,
    name: "Intense HIIT",
    duration: 25,
    difficulty: "Hard",
    category: "cardio",
    exercises: ["Burpees", "Box Jumps", "Sprint Intervals", "Kettlebell Swings"]
  }
];

export default function WorkoutTrackerPage() {
  const [activeTab, setActiveTab] = useState("history");
  
  // Get workout type icon
  const getWorkoutTypeIcon = (type: string) => {
    switch(type) {
      case "cardio": 
        return <Heart className="h-5 w-5 text-red-500" />;
      case "strength": 
        return <Dumbbell className="h-5 w-5 text-blue-500" />;
      case "flexibility": 
        return <div className="h-5 w-5 text-purple-500 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="2" />
          </svg>
        </div>;
      default: 
        return <Flame className="h-5 w-5 text-orange-500" />;
    }
  };
  
  // Get animated color for workout category
  const getCategoryColor = (category: string) => {
    switch(category) {
      case "cardio": return "from-red-500 to-orange-400";
      case "strength": return "from-blue-500 to-cyan-400";
      case "flexibility": return "from-purple-500 to-pink-400";
      default: return "from-green-500 to-teal-400";
    }
  };
  
  // Get animated model for workout category
  const getCategoryModel = (category: string) => {
    switch(category) {
      case "cardio": return "sphere";
      case "strength": return "fancy";
      case "flexibility": return "health";
      default: return "sphere";
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      {/* Top Navigation */}
      <div className="w-full px-4 py-6 flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Workout Tracker
        </h1>
        <Avatar className="h-9 w-9">
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20 pt-4">
        {/* Stats Cards */}
        <SlideIn className="mb-6" direction="up">
          <div className="grid grid-cols-3 gap-4">
            <GlassCard className="text-center py-4" variant="colored">
              <Flame className="h-6 w-6 mx-auto mb-1 text-orange-500" />
              <div className="text-xl font-bold">1,245</div>
              <div className="text-xs text-gray-600">Weekly Calories</div>
            </GlassCard>
            
            <GlassCard className="text-center py-4">
              <Clock className="h-6 w-6 mx-auto mb-1 text-blue-500" />
              <div className="text-xl font-bold">210</div>
              <div className="text-xs text-gray-600">Weekly Minutes</div>
            </GlassCard>
            
            <GlassCard className="text-center py-4">
              <Calendar className="h-6 w-6 mx-auto mb-1 text-green-500" />
              <div className="text-xl font-bold">5</div>
              <div className="text-xs text-gray-600">Workouts</div>
            </GlassCard>
          </div>
        </SlideIn>
        
        {/* Tabs */}
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="routines">Routines</TabsTrigger>
          </TabsList>
          
          {/* History Tab */}
          <TabsContent value="history" className="mt-4">
            <StaggerContainer className="space-y-4">
              {workoutHistory.map((workout) => (
                <StaggerItem key={workout.id}>
                  <GlassCard hover="scale" className="overflow-visible">
                    <div className="flex items-center">
                      <div className="mr-4 relative">
                        <div className="h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 border border-white shadow-md">
                          {getWorkoutTypeIcon(workout.type)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-white shadow flex items-center justify-center">
                          <Flame className="h-3.5 w-3.5 text-orange-500" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-800">{workout.name}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-3.5 w-3.5 mr-1" />
                              <span>{format(new Date(workout.date), 'MMMM d')}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-indigo-600">{workout.calories} kcal</div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Timer className="h-3.5 w-3.5 mr-1" />
                              <span>{workout.duration} min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            {/* Add Workout Button */}
            <div className="mt-6 flex justify-center">
              <Button className="rounded-full px-6">
                <Plus className="h-4 w-4 mr-1" />
                Add Workout
              </Button>
            </div>
          </TabsContent>
          
          {/* Routines Tab */}
          <TabsContent value="routines" className="mt-4">
            <StaggerContainer className="space-y-6">
              {workoutRoutines.map((routine) => (
                <StaggerItem key={routine.id}>
                  <GlassCard className="p-0 overflow-hidden" hover="scale">
                    <div className="flex h-[180px]">
                      {/* Routine Details */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <div className="px-2 py-1 rounded-full bg-white/50 inline-block mb-2">
                            <div className="text-xs font-medium uppercase bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
                              {routine.category}
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">{routine.name}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {routine.exercises.slice(0, 3).map((exercise, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/50 text-gray-700">
                                {exercise}
                              </span>
                            ))}
                            {routine.exercises.length > 3 && (
                              <span className="text-xs px-2 py-1 rounded-full bg-white/50 text-gray-700">
                                +{routine.exercises.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span className="text-sm text-gray-600">{routine.duration} min</span>
                            </div>
                            <div className="px-2 py-0.5 rounded-full bg-white/50 text-xs font-medium text-gray-700">
                              {routine.difficulty}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="rounded-full">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* 3D Model */}
                      <div className="w-[140px] bg-gradient-to-br shadow-inner-xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br opacity-40 z-10"></div>
                        <div className="h-full">
                          <ThreeScene
                            modelType={getCategoryModel(routine.category)}
                            className="h-full w-full"
                            backgroundColor="transparent"
                            modelColor={
                              routine.category === "cardio" ? "#ef4444" : 
                              routine.category === "strength" ? "#3b82f6" : "#8b5cf6"
                            }
                            rotationSpeed={0.5}
                          />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
            
            {/* Create Routine Button */}
            <div className="mt-6 flex justify-center">
              <Button className="rounded-full px-6 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                <Plus className="h-4 w-4 mr-1" />
                Create Routine
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Weekly Analysis */}
        <SlideIn className="mb-6" direction="up" delay={0.3}>
          <GlassCard variant="colored">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly Analysis</h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">Activity Consistency</div>
                  <div className="text-sm font-medium text-gray-700">71%</div>
                </div>
                <div className="h-2 bg-white/40 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "71%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">Workout Variety</div>
                  <div className="text-sm font-medium text-gray-700">85%</div>
                </div>
                <div className="h-2 bg-white/40 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">Goal Progress</div>
                  <div className="text-sm font-medium text-gray-700">62%</div>
                </div>
                <div className="h-2 bg-white/40 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "62%" }}
                    transition={{ duration: 1, delay: 0.9 }}
                  />
                </div>
              </div>
            </div>
          </GlassCard>
        </SlideIn>
      </div>
    </div>
  );
}