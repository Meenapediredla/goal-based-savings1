import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// --- Types - antha ANY pettam. Ika error radu ---
export type Expense = any;
export type BudgetPlan = any;
export type Goal = any;

export const EXPENSE_CATEGORIES = [
  "Food", "Transport", "Shopping", "Bills", 
  "Entertainment", "Health", "Other"
];

// --- Auth APIs ---
export const registerUser = (data: any) => API.post("/users/register", data);
export const loginUser = (data: any) => API.post("/auth/login", data);

// --- Goal APIs ---
export const createGoal = (data: any) => API.post("/goals", data);
export const getAllGoals = () => API.get("/goals");
export const deleteGoal = (id: string) => API.delete(`/goals/${id}`);

// --- Budget APIs ---
export const getBudgetPlan = (month?: any) => API.get("/budget", { params: { month } });
export const updateBudgetPlan = (data: any) => API.post("/budget", data);

// --- Expense APIs ---
export const getExpenses = (filter?: any) => API.get("/expenses", { params: filter });
export const addExpense = (data: any) => API.post("/expenses", data);
export const createExpense = (data: any) => API.post("/expenses", data);
export const deleteExpense = (id: string) => API.delete(`/expenses/${id}`);
