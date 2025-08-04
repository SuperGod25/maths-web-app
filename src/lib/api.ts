import axios from 'axios';

// ✅ Determine base URL based on environment
const API_BASE_URL =
  import.meta.env.MODE === 'development'
    ? import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    : ''; // production uses relative paths like /api/power

export const api = axios.create({
  baseURL: API_BASE_URL || undefined, // ✅ allow Axios to default to relative in production
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Optional Auth Token Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    console.log("📡 API Request to:", (config.baseURL || '') + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global Error Logger
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// --- Types ---
export interface MathOperation {
  id: string;
  operation: 'power' | 'fibonacci' | 'factorial';
  inputs: Record<string, number>;
  result: number;
  timestamp: string;
  executionTime: number;
  status: 'success' | 'error';
}

export interface PowerRequest {
  base: number;
  exponent: number;
}

export interface FibonacciRequest {
  n: number;
}

export interface FactorialRequest {
  n: number;
}

export interface ApiResponse<T> {
  data: T;
  status: string;
  timestamp: string;
  executionTime: number;
}

// --- Live API Methods ---
export const mathApi = {
  calculatePower: async (data: PowerRequest): Promise<ApiResponse<number>> => {
    const response = await api.post('/api/power', data);
    return {
      data: response.data.result,
      status: 'success',
      timestamp: new Date().toISOString(),
      executionTime: response.data.execution_time ?? 0,
    };
  },

  calculateFibonacci: async (data: FibonacciRequest): Promise<ApiResponse<number>> => {
    const response = await api.post('/api/fibonacci', data);
    return {
      data: response.data.result,
      status: 'success',
      timestamp: new Date().toISOString(),
      executionTime: response.data.execution_time ?? 0,
    };
  },

  calculateFactorial: async (data: FactorialRequest): Promise<ApiResponse<number>> => {
    const response = await api.post('/api/factorial', data);
    return {
      data: response.data.result,
      status: 'success',
      timestamp: new Date().toISOString(),
      executionTime: response.data.execution_time ?? 0,
    };
  },

  getHistory: async (): Promise<MathOperation[]> => {
    const response = await api.get('/api/history');
    return response.data;
  },

  getMetrics: async () => {
    const response = await api.get('/api/metrics');
    return response.data;
  },
};

// ✅ Export for use across app
export const currentMathApi = mathApi;
