import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Droplets, PlusCircle, Info, ArrowLeft, X } from 'lucide-react';
import { format } from 'date-fns';

import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StaggerContainer, StaggerItem, FadeIn, SlideIn } from '@/components/animations/motion-components';
import ThreeScene from '@/components/3d/simple-scene';
import { Link } from 'wouter';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function WaterTrackerPage() {
  const [waterIntake, setWaterIntake] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(8); // Default 8 glasses
  const [waterHistory, setWaterHistory] = useState([
    { date: '2025-04-10', amount: 6 },
    { date: '2025-04-09', amount: 7 },
    { date: '2025-04-08', amount: 5 },
    { date: '2025-04-07', amount: 8 },
    { date: '2025-04-06', amount: 4 },
  ]);
  const [showTip, setShowTip] = useState(false);
  const [activeView, setActiveView] = useState('tracker');

  // Hydration tips
  const hydrationTips = [
    "Start your day with a glass of water to kickstart your metabolism.",
    "Keep a water bottle with you throughout the day for easy access.",
    "Set reminders on your phone to drink water regularly.",
    "Infuse your water with fruits or herbs to add natural flavor.",
    "Eat water-rich foods like cucumber, watermelon, and oranges.",
    "Drink a glass of water before each meal to aid digestion and prevent overeating."
  ];
  
  const [currentTip, setCurrentTip] = useState(0);
  
  // Calculate progress percentage
  const progressPercentage = Math.min(100, (waterIntake / dailyGoal) * 100);
  
  // Add water function
  const addWater = (amount = 1) => {
    setWaterIntake(prev => Math.min(dailyGoal * 2, prev + amount));
  };
  
  // Remove water function
  const removeWater = (amount = 1) => {
    setWaterIntake(prev => Math.max(0, prev - amount));
  };
  
  // Cycle through tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % hydrationTips.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      {/* Top Navigation */}
      <div className="w-full px-4 py-6 flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
          Water Tracker
        </h1>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowTip(!showTip)}>
          <Info className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Main Content */}
      <motion.div 
        className="container mx-auto px-4 pb-20 pt-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Water 3D Model */}
        <motion.div
          variants={itemVariants}
          className="mb-6 h-[300px] w-full flex justify-center items-center"
        >
          <ThreeScene
            modelType="water"
            waterFillLevel={progressPercentage / 100}
            modelColor="#0ea5e9"
            rotationSpeed={0.5}
            className="w-full h-full max-w-[300px]"
          />
        </motion.div>
        
        {/* Daily Goal Card */}
        <motion.div variants={itemVariants}>
          <GlassCard variant="colored" className="mb-6" animate>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-blue-900">Daily Goal</h2>
              <div className="text-blue-800 font-medium">
                {waterIntake} / {dailyGoal} glasses
              </div>
            </div>
            
            <Progress value={progressPercentage} className="h-3 mb-4" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-center p-3 bg-white/30 rounded-lg">
                <Droplets className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-blue-900 font-medium">{(waterIntake * 250).toLocaleString()} ml</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-white/30 rounded-lg">
                <span className="text-blue-900 font-medium">
                  {progressPercentage < 100 
                    ? `${Math.ceil(dailyGoal - waterIntake)} more to go`
                    : 'Goal achieved! 🎉'}
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
        
        {/* Quick Add Card */}
        <motion.div variants={itemVariants}>
          <GlassCard className="mb-6" animate>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Add</h2>
            
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => removeWater()}
                disabled={waterIntake <= 0}
                className="h-12 w-12 rounded-full"
              >
                <Minus className="h-5 w-5" />
              </Button>
              
              <div className="flex items-end">
                <span className="text-4xl font-bold text-blue-600">{waterIntake}</span>
                <span className="text-gray-500 ml-2 mb-1">glasses</span>
              </div>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => addWater()}
                className="h-12 w-12 rounded-full"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(amount => (
                <Button 
                  key={amount}
                  variant="outline" 
                  onClick={() => addWater(amount)}
                  className="py-1"
                >
                  +{amount}
                </Button>
              ))}
            </div>
          </GlassCard>
        </motion.div>
        
        {/* Adjust Goal Card */}
        <motion.div variants={itemVariants}>
          <GlassCard className="mb-6" animate>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Adjust Goal</h2>
              <span className="text-gray-600 font-medium">{dailyGoal} glasses</span>
            </div>
            
            <Slider 
              value={[dailyGoal]} 
              min={4} 
              max={16} 
              step={1}
              onValueChange={(values) => setDailyGoal(values[0])}
              className="mb-1"
            />
            
            <div className="flex justify-between text-sm text-gray-500">
              <span>4 glasses</span>
              <span>16 glasses</span>
            </div>
          </GlassCard>
        </motion.div>
        
        {/* Weekly History */}
        <motion.div variants={itemVariants}>
          <GlassCard variant="solid" animate>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Weekly History</h2>
            
            <div className="space-y-3">
              {waterHistory.map((day, index) => (
                <div 
                  key={day.date} 
                  className="flex items-center"
                >
                  <div className="w-24 text-sm text-gray-600">
                    {format(new Date(day.date), 'EEE, MMM d')}
                  </div>
                  <div className="flex-1 ml-2">
                    <div className="h-7 bg-blue-100 rounded-full relative">
                      <motion.div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(day.amount / dailyGoal) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                      <div className="absolute top-0 right-2 h-full flex items-center text-xs font-medium">
                        {day.amount} / {dailyGoal}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
      
      {/* Hydration Tip Modal */}
      {showTip && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <FadeIn>
            <GlassCard variant="dark" className="max-w-md w-full" hover="scale">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-white">Hydration Tip</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowTip(false)}
                  className="text-white/80 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-4 bg-white/10 rounded-lg mb-4">
                <p className="text-white/90">{hydrationTips[currentTip]}</p>
              </div>
              
              <div className="flex justify-center">
                <div className="flex space-x-1">
                  {hydrationTips.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full ${i === currentTip ? 'w-4 bg-blue-400' : 'w-1.5 bg-white/30'}`}
                    />
                  ))}
                </div>
              </div>
            </GlassCard>
          </FadeIn>
        </div>
      )}
    </div>
  );
}