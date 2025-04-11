import React from 'react';
import Lottie from 'lottie-react';
import { cn } from '@/lib/utils';

// Import animation data
import waterAnimation from '@/assets/animations/water-animation.json';
import sleepAnimation from '@/assets/animations/sleep-animation.json';
import workoutAnimation from '@/assets/animations/workout-animation.json';
import foodAnimation from '@/assets/animations/food-animation.json';
import weightAnimation from '@/assets/animations/weight-animation.json';
import stepsAnimation from '@/assets/animations/steps-animation.json';
import moodAnimation from '@/assets/animations/mood-animation.json';
import medicineAnimation from '@/assets/animations/medicine-animation.json';
import loadingAnimation from '@/assets/animations/loading-animation.json';

// Define animation types
type AnimationType = 
  | 'water' 
  | 'sleep' 
  | 'workout' 
  | 'food' 
  | 'weight'
  | 'steps'
  | 'mood'
  | 'medicine'
  | 'loading';

// Map animation types to their data
const animationMap = {
  water: waterAnimation,
  sleep: sleepAnimation,
  workout: workoutAnimation,
  food: foodAnimation,
  weight: weightAnimation,
  steps: stepsAnimation,
  mood: moodAnimation,
  medicine: medicineAnimation,
  loading: loadingAnimation
};

interface LottieIconProps {
  type: AnimationType;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  style?: React.CSSProperties;
  onComplete?: () => void;
}

export const LottieIcon: React.FC<LottieIconProps> = ({
  type,
  className,
  loop = true,
  autoplay = true,
  speed = 1,
  style,
  onComplete
}) => {
  return (
    <div className={cn("w-full h-full", className)} style={style}>
      <Lottie
        animationData={animationMap[type]}
        loop={loop}
        autoplay={autoplay}
        speed={speed}
        onComplete={onComplete}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default LottieIcon;