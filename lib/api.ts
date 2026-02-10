// API configuration and utilities
// IMPORTANT: Use localhost (not 127.0.0.1) to avoid cookie issues
const API_BASE_URL = 'http://localhost:8000/api';

// Helper function to make authenticated requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include', // Include cookies for session auth
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Performance Log API
export const performanceLogAPI = {
  // Create a new performance log entry
  create: async (data: {
    event: string;
    value: number;
    intensity?: number;
    notes?: string;
    date_logged?: string;
  }) => {
    return apiRequest('/performance-logs/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all performance logs for the current user
  getAll: async () => {
    return apiRequest('/performance-logs/');
  },

  // Get performance logs by event type
  getByEvent: async (event: string) => {
    return apiRequest(`/performance-logs/by_event/?event=${encodeURIComponent(event)}`);
  },
};

// Goals API
export const goalsAPI = {
  // Create a new goal
  create: async (data: {
    event: string;
    target_value: number;
    deadline: string;
    benchmark_id?: number;
  }) => {
    return apiRequest('/goals/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Get all goals for the current user
  getAll: async () => {
    return apiRequest('/goals/');
  },

  // Get active goals only
  getActive: async () => {
    return apiRequest('/goals/active/');
  },

  // Get completed goals only
  getCompleted: async () => {
    return apiRequest('/goals/completed/');
  },

  // Mark a goal as completed
  markCompleted: async (goalId: number) => {
    return apiRequest(`/goals/${goalId}/mark_completed/`, {
      method: 'POST',
    });
  },

  // Update a goal
  update: async (goalId: number, data: Partial<{
    event: string;
    target_value: number;
    deadline: string;
    benchmark_id?: number;
    status: string;
  }>) => {
    return apiRequest(`/goals/${goalId}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Delete a goal
  delete: async (goalId: number) => {
    return apiRequest(`/goals/${goalId}/`, {
      method: 'DELETE',
    });
  },
};

// Benchmarks API
export const benchmarksAPI = {
  // Get all benchmarks
  getAll: async () => {
    return apiRequest('/benchmarks/');
  },
};

// Types for TypeScript
export interface PerformanceLog {
  id: number;
  event: string;
  value: number;
  intensity: number;
  notes: string;
  date_logged: string;
  created_at: string;
}

export interface Goal {
  id: number;
  event: string;
  target_value: number;
  current_value: number;
  benchmark?: Benchmark;
  benchmark_id?: number;
  deadline: string;
  status: 'active' | 'completed' | 'on_hold';
  progress: {
    percentage: number;
    is_completed: boolean;
    distance_to_target: number;
  };
  created_at: string;
  updated_at: string;
}

export interface Benchmark {
  id: number;
  event: string;
  level: string;
  benchmark_value: number;
  unit: string;
  created_at: string;
}