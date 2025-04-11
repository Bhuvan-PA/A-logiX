import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const glassCardVariants = cva(
  "relative rounded-xl overflow-hidden backdrop-blur shadow-lg border border-white/10", 
  {
    variants: {
      variant: {
        default: "bg-white/10 backdrop-blur-md",
        solid: "bg-white/20 backdrop-blur-sm",
        heavy: "bg-white/30 backdrop-blur-lg",
        colored: "bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-md",
        dark: "bg-black/40 backdrop-blur-md"
      },
      size: {
        sm: "p-2",
        default: "p-4",
        lg: "p-6",
        xl: "p-8"
      },
      hover: {
        none: "",
        scale: "hover:scale-[1.02] transition-transform",
        glow: "hover:shadow-glow transition-shadow",
        lift: "hover:-translate-y-1 transition-transform"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      hover: "none"
    }
  }
);

export interface GlassCardProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassCardVariants> {
  animate?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant, size, hover, animate = false, children, ...props }, ref) => {
    const Card = animate ? motion.div : 'div';
    
    return (
      <Card
        ref={ref}
        className={cn(glassCardVariants({ variant, size, hover }), className)}
        initial={animate ? { opacity: 0, y: 20 } : undefined}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        exit={animate ? { opacity: 0, y: 20 } : undefined}
        transition={animate ? { duration: 0.3 } : undefined}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

GlassCard.displayName = 'GlassCard';

export { GlassCard, glassCardVariants };