import { motion } from 'framer-motion';
import { Power, Sigma, Hash } from 'lucide-react';
import { OperationCard } from '@/components/operations/OperationCard';

const operations = [
  {
    title: 'Power Calculation',
    description: 'Calculate base raised to the power of exponent',
    formula: 'base^exponent',
    icon: Power,
    path: '/operation/power',
    variant: 'power' as const,
  },
  {
    title: 'Fibonacci Sequence',
    description: 'Find the nth number in the Fibonacci sequence',
    formula: 'F(n) = F(n-1) + F(n-2)',
    icon: Sigma,
    path: '/operation/fibonacci',
    variant: 'fibonacci' as const,
  },
  {
    title: 'Factorial',
    description: 'Calculate factorial of a given number',
    formula: 'n! = n × (n-1) × ... × 1',
    icon: Hash,
    path: '/operation/factorial',
    variant: 'factorial' as const,
  },
];

export const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Mathematical Operations
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          High-performance mathematical computations with real-time monitoring and comprehensive history tracking
        </p>
      </motion.div>

      {/* Statistics Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <div className="metric-card text-center">
          <div className="text-2xl font-bold text-primary">1,247</div>
          <div className="text-sm text-muted-foreground">Total Calculations</div>
        </div>
        <div className="metric-card text-center">
          <div className="text-2xl font-bold text-accent">156ms</div>
          <div className="text-sm text-muted-foreground">Avg Response Time</div>
        </div>
        <div className="metric-card text-center">
          <div className="text-2xl font-bold text-success">99.9%</div>
          <div className="text-sm text-muted-foreground">System Uptime</div>
        </div>
      </motion.div>

      {/* Operations Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {operations.map((operation, index) => (
          <OperationCard
            key={operation.variant}
            {...operation}
            delay={0.1 * (index + 1)}
          />
        ))}
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16 text-center"
      >
        <h2 className="text-2xl font-bold mb-8">Built for Performance & Reliability</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
              <Power className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold">High Performance</h3>
            <p className="text-sm text-muted-foreground">
              Optimized algorithms with sub-millisecond execution times
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
              <Sigma className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold">Real-time Monitoring</h3>
            <p className="text-sm text-muted-foreground">
              Live metrics and performance insights for all operations
            </p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-factorial/10 rounded-lg flex items-center justify-center mx-auto">
              <Hash className="w-6 h-6 text-factorial" />
            </div>
            <h3 className="font-semibold">Complete History</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive logging and audit trail for all calculations
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};