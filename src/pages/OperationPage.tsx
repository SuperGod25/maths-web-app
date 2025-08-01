import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { OperationForm } from '@/components/operations/OperationForm';

const operationConfig = {
  power: {
    title: 'Power Calculation',
    description: 'Calculate the result of raising a base number to a given exponent',
    variant: 'power' as const,
  },
  fibonacci: {
    title: 'Fibonacci Sequence',
    description: 'Find the nth number in the Fibonacci sequence using optimized algorithms',
    variant: 'fibonacci' as const,
  },
  factorial: {
    title: 'Factorial Calculation',
    description: 'Calculate the factorial of a given non-negative integer',
    variant: 'factorial' as const,
  },
};

export const OperationPage = () => {
  const { operation } = useParams<{ operation: string }>();
  
  if (!operation || !operationConfig[operation as keyof typeof operationConfig]) {
    return <Navigate to="/" replace />;
  }

  const config = operationConfig[operation as keyof typeof operationConfig];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link to="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Operations
          </Button>
        </Link>
      </motion.div>

      {/* Operation Form */}
      <OperationForm
        operation={operation as 'power' | 'fibonacci' | 'factorial'}
        title={config.title}
        description={config.description}
        variant={config.variant}
      />
    </div>
  );
};