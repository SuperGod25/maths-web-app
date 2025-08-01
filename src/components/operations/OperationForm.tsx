import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { currentMathApi } from '@/lib/api'; // ✅ Axios API
import { cn } from '@/lib/utils';

// Validation schemas
const powerSchema = z.object({
  base: z.number().min(-1000000).max(1000000),
  exponent: z.number().min(-1000).max(1000),
});

const fibonacciSchema = z.object({
  n: z.number().min(0).max(1000),
});

const factorialSchema = z.object({
  n: z.number().min(0).max(100),
});

interface OperationFormProps {
  operation: 'power' | 'fibonacci' | 'factorial';
  title: string;
  description: string;
  variant: 'power' | 'fibonacci' | 'factorial';
}

interface CalculationResult {
  result: number;
  executionTime?: number;
  timestamp?: string;
}

export const OperationForm = ({ operation, title, description, variant }: OperationFormProps) => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const { toast } = useToast();

  const getSchema = () => {
    switch (operation) {
      case 'power': return powerSchema;
      case 'fibonacci': return fibonacciSchema;
      case 'factorial': return factorialSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: operation === 'power'
      ? { base: 2, exponent: 8 }
      : { n: operation === 'fibonacci' ? 10 : 5 },
  });

  const onSubmit = async (data: any) => {
    setIsCalculating(true);
    setResult(null);

    try {
      let response;

      switch (operation) {
        case 'power':
          response = await currentMathApi.calculatePower(data);
          break;
        case 'fibonacci':
          response = await currentMathApi.calculateFibonacci(data);
          break;
        case 'factorial':
          response = await currentMathApi.calculateFactorial(data);
          break;
      }

      setResult({
        result: response.data,
        executionTime: response.executionTime,
        timestamp: response.timestamp,
      });

      toast({
        title: 'Calculation Complete',
        description: `${title} calculated successfully`,
      });
    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: 'Calculation Failed',
        description: 'An error occurred during calculation',
        variant: 'destructive',
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const renderInputs = () => {
    switch (operation) {
      case 'power':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="base">Base</Label>
              <Input
                id="base"
                type="number"
                {...form.register('base', { valueAsNumber: true })}
                placeholder="Enter base number"
                className="font-mono"
              />
              {form.formState.errors.base && (
                <p className="text-sm text-destructive">{form.formState.errors.base.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="exponent">Exponent</Label>
              <Input
                id="exponent"
                type="number"
                {...form.register('exponent', { valueAsNumber: true })}
                placeholder="Enter exponent"
                className="font-mono"
              />
              {form.formState.errors.exponent && (
                <p className="text-sm text-destructive">{form.formState.errors.exponent.message}</p>
              )}
            </div>
          </>
        );

      case 'fibonacci':
      case 'factorial':
        return (
          <div className="space-y-2">
            <Label htmlFor="n">Number (n)</Label>
            <Input
              id="n"
              type="number"
              {...form.register('n', { valueAsNumber: true })}
              placeholder={`Enter number for ${operation}`}
              className="font-mono"
            />
            {form.formState.errors.n && (
              <p className="text-sm text-destructive">{form.formState.errors.n.message}</p>
            )}
          </div>
        );
    }
  };

  const variantClasses = {
    power: 'border-power/20 bg-power/5',
    fibonacci: 'border-fibonacci/20 bg-fibonacci/5',
    factorial: 'border-factorial/20 bg-factorial/5',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className={cn('p-6', variantClasses[variant])}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4">{renderInputs()}</div>
            <Button type="submit" variant={variant} size="lg" disabled={isCalculating} className="w-full">
              {isCalculating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Calculate {title}
                </>
              )}
            </Button>
          </form>
        </Card>
      </motion.div>

      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 border-success/20 bg-success/5">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg mb-1">Result</h3>
                  <div className="code-display">
                    <span className="text-2xl font-bold font-mono">{result.result.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Execution Time:</span>
                    <span className="font-mono font-medium">{result.executionTime ?? 'N/A'}ms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Timestamp:</span>
                    <span className="font-mono font-medium">
                      {result.timestamp ? new Date(result.timestamp).toLocaleTimeString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
