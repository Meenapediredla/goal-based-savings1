import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Types ---
export interface Expense {
  _id: string;
  id: string; 
  amount: number;
  category: string;
  date: string;
  expenseDate: string;
  description: string;
}

export interface BudgetPlan {
  _id: string;
  month: string;
  monthlyIncome: number;
  monthlyBudgetLimit: number;
  categories: { name: string; limit: number }[];
}

export interface Goal {
  _id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

export const EXPENSE_CATEGORIES = [
  "Food", "Transport", "Shopping", "Bills", 
  "Entertainment", "Health", "Other"
];

// --- Auth APIs ---
export const registerUser = (data: { name?: string; email: string; password: string }) => {
  return API.post("/users/register", data);
};

export const loginUser = (data: { email: string; password: string }) => {
  return API.post("/auth/login", data);
};

// --- Goal APIs ---
export const createGoal = (data: any) => API.post("/goals", data);
export const getAllGoals = () => API.get("/goals");
export const deleteGoal = (id: string) => API.delete(`/goals/${id}`);

// --- Budget APIs - ARGUMENT ADD CHESAM 👇 ---
export const getBudgetPlan = (month?: string) => API.get("/budget", { params: { month } });
export const updateBudgetPlan = (data: any) => API.post("/budget", data);

// --- Expense APIs - ARGUMENT ADD CHESAM 👇 ---
export const getExpenses = (filter?: any) => API.get("/expenses", { params: filter });
export const addExpense = (data: any) => API.post("/expenses", data);
export const createExpense = (data: any) => API.post("/expenses", data);
export const deleteExpense = (id: string) => API.delete(`/expenses/${id}`);
