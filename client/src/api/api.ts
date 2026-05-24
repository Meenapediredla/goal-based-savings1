import axios from "axios";
import { getApiBaseUrl } from "../config/apiBase";

export const API_BASE_URL = getApiBaseUrl();

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      const hint = API_BASE_URL
        ? `Backend: ${API_BASE_URL}`
        : "Set VITE_API_URL to your Render API URL in Vercel/host env, then rebuild.";
      alert(`Cannot reach the server. ${hint}`);
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.clear();
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export interface GoalPayload {
  goalName: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
}

export const registerUser = (data: { name?: string; email: string; password: string }) => {
  return API.post("/users/register", data);
};

export const loginUser = (data: { email: string; password: string }) => {
  return API.post("/auth/login", data);
};

export const createGoal = (data: GoalPayload) => {
  return API.post("/goals", data);
};

export const getAllGoals = () => {
  return API.get("/goals");
};

export const deleteGoal = (id: number) => {
  return API.delete(`/goals/${id}`);
};

export interface BudgetPlan {
  id: number;
  month: string;
  monthlyIncome: number;
  monthlyBudgetLimit: number;
}

export interface Expense {
  id: number;
  category: string;
  amount: number;
  description?: string;
  expenseDate: string;
}

export interface ExpensePayload {
  category: string;
  amount: number;
  description?: string;
  expenseDate: string;
}

export const getBudgetPlan = (month: string) => {
  return API.get<BudgetPlan>("/budget/plan", { params: { month } });
};

export const updateBudgetPlan = (data: {
  month: string;
  monthlyIncome: number;
  monthlyBudgetLimit: number;
}) => {
  return API.put<BudgetPlan>("/budget/plan", data);
};

export const getExpenses = (month: string) => {
  return API.get<Expense[]>("/budget/expenses", { params: { month } });
};

export const addExpense = (data: ExpensePayload) => {
  return API.post<Expense>("/budget/expenses", data);
};

export const deleteExpense = (id: number) => {
  return API.delete(`/budget/expenses/${id}`);
};

export const EXPENSE_CATEGORIES = [
  "Housing",
  "Food",
  "Transport",
  "Utilities",
  "Health",
  "Entertainment",
  "Shopping",
  "Education",
  "Other",
] as const;
