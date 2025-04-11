import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Fade In Animation Component
export const FadeIn = ({ 
  children, 
  className, 
  delay = 0,
  duration = 0.5,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  duration?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Slide In Animation Component
export const SlideIn = ({ 
  children, 
  className,
  direction = 'up',
  delay = 0,
  duration = 0.5,
  distance = 20,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
}) => {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance }
  };

  const initial = directionMap[direction];
  
  return (
    <motion.div
      initial={{ ...initial, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ ...initial, opacity: 0 }}
      transition={{ duration, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Scale Animation Component
export const ScaleIn = ({ 
  children, 
  className,
  delay = 0,
  duration = 0.5,
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
  duration?: number;
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Staggered Children Animation Component
export const StaggerContainer = ({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  staggerDelay?: number;
  initialDelay?: number;
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: initialDelay
      }
    }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger Item for use inside StaggerContainer
export const StaggerItem = ({
  children,
  className,
  duration = 0.5,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  duration?: number;
}) => {
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration
      }
    }
  };

  return (
    <motion.div
      variants={item}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Hover Effect Component
export const HoverCard = ({
  children,
  className,
  scale = 1.05,
  rotate = 0,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  scale?: number;
  rotate?: number;
}) => {
  return (
    <motion.div
      className={cn(className)}
      whileHover={{ 
        scale,
        rotate: rotate,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Page Transition Component
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Floating Animation Component (for 3D-like hover effects)
export const FloatingElement = ({
  children,
  className,
  floatIntensity = 10,
  rotateIntensity = 2,
  speed = 1.5,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  floatIntensity?: number;
  rotateIntensity?: number;
  speed?: number;
}) => {
  return (
    <motion.div
      className={cn(className)}
      animate={{
        y: [-floatIntensity, floatIntensity],
        rotate: [-rotateIntensity, rotateIntensity]
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Glassmorphism Container
export const GlassContainer = ({
  children,
  className,
  blur = "16px",
  opacity = 0.25,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  blur?: string;
  opacity?: number;
}) => {
  return (
    <motion.div
      className={cn(
        "relative backdrop-blur rounded-xl border border-white/20 bg-white/10 shadow-xl",
        className
      )}
      style={{ 
        backdropFilter: `blur(${blur})`,
        backgroundColor: `rgba(255, 255, 255, ${opacity})` 
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Pulsing Effect Component
export const PulsingElement = ({
  children,
  className,
  scale = 1.05,
  duration = 2,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  scale?: number;
  duration?: number;
}) => {
  return (
    <motion.div
      className={cn(className)}
      animate={{ scale: [1, scale, 1] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Progress Bar Animation
export const AnimatedProgressBar = ({
  value,
  maxValue = 100,
  className,
  barClassName,
  duration = 1,
  ...props
}: {
  value: number;
  maxValue?: number;
  className?: string;
  barClassName?: string;
  duration?: number;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  
  return (
    <div className={cn("w-full bg-slate-200 rounded-full h-2.5", className)} {...props}>
      <motion.div
        className={cn("h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400", barClassName)}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration }}
      />
    </div>
  );
};