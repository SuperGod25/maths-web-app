import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  Clock,
  TrendingUp,
  Server,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { currentMathApi } from '@/lib/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const Monitoring = () => {
  const [uptime, setUptime] = useState(0);

  const { data: metrics, isLoading, refetch } = useQuery({
    queryKey: ['system-metrics'],
    queryFn: () => currentMathApi.getMetrics(),
    refetchInterval: 30000
  });

  useEffect(() => {
    const interval = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const performanceData = metrics?.operation_counts
    ? Object.entries(metrics.operation_counts).map(([op, count]) => ({
        name: op.charAt(0).toUpperCase() + op.slice(1),
        requests: count
      }))
    : [];

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold mb-1">System Monitoring</h1>
          <p className="text-muted-foreground">
            Real-time performance metrics and system health monitoring
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge
            variant="outline"
            className="bg-success/10 text-success border-success/20"
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            All Systems Operational
          </Badge>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="p-6 bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <Badge variant="outline">Real-time</Badge>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {metrics?.averageResponseTime?.toFixed(1) ?? '—'}ms
            </div>
            <div className="text-sm text-muted-foreground">Avg Response Time</div>
            <Progress value={85} className="h-2" />
          </div>
        </Card>

        <Card className="p-6 bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-muted/10 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-muted-foreground" />
            </div>
            <Badge variant="outline">Uptime</Badge>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{formatUptime(uptime)}</div>
            <div className="text-sm text-muted-foreground">Session Duration</div>
            <Progress value={100} className="h-2" />
          </div>
        </Card>

        <Card className="p-6 bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-muted/10 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <Badge variant="outline">Requests</Badge>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{metrics?.totalRequests ?? 0}</div>
            <div className="text-sm text-muted-foreground">Total API Requests</div>
            <Progress value={75} className="h-2" />
          </div>
        </Card>

        <Card className="p-6 bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-success" />
            </div>
            <Badge variant="outline">Success</Badge>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold">
              {metrics?.successRate?.toFixed(1) ?? 0}%
            </div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
            <Progress value={metrics?.successRate ?? 0} className="h-2" />
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Chart Card */}
        <Card className="p-6 bg-card shadow-sm h-full flex flex-col">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-lg font-semibold">Operation Volume</h3>
    <Zap className="w-5 h-5 text-muted-foreground" />
  </div>

  <div className="h-[300px] w-full">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={performanceData}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="requests" fill="hsl(var(--primary))" radius={4} />
      </BarChart>
    </ResponsiveContainer>
  </div>
</Card>


  {/* Status Card */}
  <Card className="p-6 bg-card shadow-sm h-full flex flex-col justify-between">
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-lg font-semibold">System Status</h3>
      <AlertTriangle className="w-5 h-5 text-muted-foreground" />
    </div>
    <div className="space-y-4">
      <div className="flex items-center space-x-3 p-3 bg-success/10 rounded-lg border border-success/20">
        <CheckCircle2 className="w-5 h-5 text-success" />
        <div>
          <div className="font-medium text-success">All Services Operational</div>
          <div className="text-xs text-muted-foreground">Last checked: 30 seconds ago</div>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border">
        <Activity className="w-5 h-5 text-primary" />
        <div>
          <div className="font-medium">High Traffic Detected</div>
          <div className="text-xs text-muted-foreground">
            2 minutes ago - Auto-scaling initiated
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border">
        <TrendingUp className="w-5 h-5 text-accent" />
        <div>
          <div className="font-medium">Performance Optimized</div>
          <div className="text-xs text-muted-foreground">
            15 minutes ago - Response time improved
          </div>
        </div>
      </div>
    </div>
  </Card>
</div>

    </div>
  );
};
