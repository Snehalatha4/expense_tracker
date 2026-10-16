import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Request interceptor to attach JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('spendsmart_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors uniformly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customMessage =
      error.response?.data?.message ||
      error.message ||
      'Network error. Please ensure the backend is running.';
    return Promise.reject(new Error(customMessage));
  }
);

// --- Auth API methods ---
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const demoLogin = async () => {
  const response = await api.post('/auth/demo');
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};

// --- Transaction API methods ---
export const getTransactions = async (params = {}) => {
  const response = await api.get('/transactions', { params });
  return response.data;
};

export const createTransaction = async (transactionData) => {
  const response = await api.post('/transactions', transactionData);
  return response.data;
};

export const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/transactions/${id}`, transactionData);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

export const getMonthlySummary = async (month) => {
  const response = await api.get('/transactions/summary', { params: { month } });
  return response.data;
};

// --- Budget API methods ---
export const getBudget = async (month) => {
  const response = await api.get('/budget', { params: { month } });
  return response.data;
};

export const setBudget = async (budgetData) => {
  const response = await api.post('/budget', budgetData);
  return response.data;
};

// --- Goals & Targets API methods ---
export const getGoals = async () => {
  const response = await api.get('/goals');
  return response.data;
};

export const createGoal = async (goalData) => {
  const response = await api.post('/goals', goalData);
  return response.data;
};

export const addFundsToGoal = async (id, amount) => {
  const response = await api.post(`/goals/${id}/deposit`, { amount });
  return response.data;
};

export const updateGoal = async (id, goalData) => {
  const response = await api.put(`/goals/${id}`, goalData);
  return response.data;
};

export const deleteGoal = async (id) => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
};

// --- Health Check API ---
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
