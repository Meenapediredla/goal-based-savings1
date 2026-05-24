import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Auth
export const registerUser = (data: { name?: string; email: string; password: string }) => {
  return API.post("/users/register", data);
};

export const loginUser = (data: { email: string; password: string }) => {
  return API.post("/auth/login", data);
};

// Goals  
export const createGoal = (data: any) => API.post("/goals", data);
export const getAllGoals = () => API.get("/goals");
export const deleteGoal = (id: string) => API.delete(`/goals/${id}`);

// Budget
export const getBudgetPlan = () => API.get("/budget");
export const updateBudgetPlan = (data: any) => API.post("/budget", data);

// Expenses
export const getExpenses = () => API.get("/expenses");
export const createExpense = (data: any) => API.post("/expenses", data);

// Types - ee types export cheyali
export interface Expense {
  _id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
}

export interface BudgetPlan {
  _id: string;
  categories: { name: string; limit: number }[];
  month: string;
}

// Constants
export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport", 
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Other"
];
