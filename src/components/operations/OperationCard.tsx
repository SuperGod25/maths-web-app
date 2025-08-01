import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OperationCardProps {
  title: string;
  description: string;
  formula: string;
  icon: LucideIcon;
  path: string;
  variant: 'power' | 'fibonacci' | 'factorial';
  delay?: number;
}

const variantStyles = {
  power: {
    gradient: 'from-power to-power-glow',
    shadow: 'shadow-power/20',
    iconBg: 'bg-power/10 text-power',
  },
  fibonacci: {
    gradient: 'from-fibonacci to-fibonacci-glow',
    shadow: 'shadow-fibonacci/20',
    iconBg: 'bg-fibonacci/10 text-fibonacci',
  },
  factorial: {
    gradient: 'from-factorial to-factorial-glow',
    shadow: 'shadow-factorial/20',
    iconBg: 'bg-factorial/10 text-factorial',
  },
};

export const OperationCard = ({
  title,
  description,
  formula,
  icon: Icon,
  path,
  variant,
  delay = 0,
}: OperationCardProps) => {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <Card className={cn(
        "relative overflow-hidden border-0 bg-gradient-to-br transition-all duration-500 hover:shadow-2xl",
        styles.gradient,
        styles.shadow
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
        </div>

        <div className="relative p-6 text-white">
          {/* Icon */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-xs font-mono bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              {variant.toUpperCase()}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold mb-1">{title}</h3>
              <p className="text-white/80 text-sm">{description}</p>
            </div>

            {/* Formula */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="text-xs text-white/70 mb-1">Formula:</div>
              <code className="font-mono text-sm text-white font-medium">{formula}</code>
            </div>

            {/* Action Button */}
            <Link to={path} className="block relative z-10">
              <Button
                variant="secondary"
                size="lg"
                className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white hover:text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] cursor-pointer"
                asChild
              >
                <div className="flex items-center justify-center">
                  Calculate
                  <span className="ml-2 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Card>
    </motion.div>
  );
};