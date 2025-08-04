import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Clock, 
  Filter, 
  Search, 
  Download, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { currentMathApi, MathOperation } from '../lib/api';
import { cn } from '@/lib/utils';

export const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [operationFilter, setOperationFilter] = useState<string>('all');

  const { data: operations = [], isLoading, refetch } = useQuery({
    queryKey: ['operations-history'],
    queryFn: () => currentMathApi.getHistory(),
  });

  const filteredOperations = operations.filter(op => {
    const matchesSearch = searchTerm === '' || 
      op.operation.includes(searchTerm.toLowerCase()) ||
      op.result.toString().includes(searchTerm);
    
    const matchesFilter = operationFilter === 'all' || op.operation === operationFilter;
    
    return matchesSearch && matchesFilter;
  });

  const getOperationColor = (operation: string) => {
    switch (operation) {
      case 'power': return 'bg-power/10 text-power border-power/20';
      case 'fibonacci': return 'bg-fibonacci/10 text-fibonacci border-fibonacci/20';
      case 'factorial': return 'bg-factorial/10 text-factorial border-factorial/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatInputs = (operation: string, inputs: Record<string, number>) => {
    switch (operation) {
      case 'power':
        return `${inputs.base}^${inputs.exponent}`;
      case 'fibonacci':
        return `F(${inputs.n})`;
      case 'factorial':
        return `${inputs.n}!`;
      default:
        return JSON.stringify(inputs);
    }
  };

  const handleExportCSV = () => {
    console.log("🔁 Export triggered");
    if (!operations || operations.length === 0) {
      alert("No operations available to export.");
      return;
    }

    const headers = [
      "ID",
      "Operation",
      "Inputs",
      "Result",
      "Timestamp",
      "Execution Time (ms)",
      "Status",
    ];

    const rows = operations.map(op => [
      op.id,
      op.operation,
      JSON.stringify(op.inputs).replace(/"/g, '""'),
      op.result,
      new Date(op.timestamp).toISOString(),
      op.executionTime,
      op.status,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map(row =>
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "operation_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };




  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Operation History</h1>
            <p className="text-muted-foreground">
              Complete audit trail of all mathematical operations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <button
              onClick={handleExportCSV}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f4f4f5',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #d1d5db',
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>

          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search operations, results..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={operationFilter} onValueChange={setOperationFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by operation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Operations</SelectItem>
                <SelectItem value="power">Power</SelectItem>
                <SelectItem value="fibonacci">Fibonacci</SelectItem>
                <SelectItem value="factorial">Factorial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
      >
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{operations.length}</div>
          <div className="text-sm text-muted-foreground">Total Operations</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-success">
            {operations.filter(op => op.status === 'success').length}
          </div>
          <div className="text-sm text-muted-foreground">Successful</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-accent">
            {Math.round(operations.reduce((sum, op) => sum + op.executionTime, 0) / operations.length) || 0}ms
          </div>
          <div className="text-sm text-muted-foreground">Avg Time</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-muted-foreground">
            {filteredOperations.length}
          </div>
          <div className="text-sm text-muted-foreground">Filtered Results</div>
        </Card>
      </motion.div>

      {/* Operations List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {isLoading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading operation history...</p>
          </div>
        ) : filteredOperations.length === 0 ? (
          <Card className="p-12 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No operations found</h3>
            <p className="text-muted-foreground">
              {searchTerm || operationFilter !== 'all' 
                ? 'Try adjusting your search criteria' 
                : 'Start by performing some mathematical operations'
              }
            </p>
          </Card>
        ) : (
          filteredOperations.map((operation, index) => (
            <motion.div
              key={operation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      getOperationColor(operation.operation)
                    )}>
                      {operation.status === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={getOperationColor(operation.operation)}>
                          {operation.operation.toUpperCase()}
                        </Badge>
                        <span className="font-mono text-sm text-muted-foreground">
                          {formatInputs(operation.operation, operation.inputs)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(operation.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="font-mono font-bold text-lg">
                      {operation.result.toLocaleString()}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{operation.executionTime}ms</span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
};