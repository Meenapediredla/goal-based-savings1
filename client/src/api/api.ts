import axios, { type AxiosInstance } from "axios";
import { getApiBaseUrl, loadRuntimeConfig, normalizeApiUrl } from "../config/apiBase";

let api: AxiosInstance | null = null;

export function getAPI(): AxiosInstance {
  if (!api) {
    throw new Error("API not initialized. Call initAPI() first.");
  }
  return api;
}

export async function initAPI(): Promise<string> {
  await loadRuntimeConfig();
  const baseURL = getApiBaseUrl();
  api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.code === "ERR_NETWORK") {
        const hint = baseURL
          ? `Backend: ${baseURL}`
          : "Check VITE_API_URL or public/config.json";
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

  return baseURL;
}

export const API_BASE_URL = () => normalizeApiUrl(getApiBaseUrl());

export interface GoalPayload {
  goalName: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
}

export const registerUser = (data: { name?: string; email: string; password: string }) => {
  return getAPI().post("/users/register", data);
};

export const loginUser = (data: { email: string; password: string }) => {
  return getAPI().post("/auth/login", data);
};

export const createGoal = (data: GoalPayload) => {
  return getAPI().post("/goals", data);
};

export const getAllGoals = () => {
  return getAPI().get("/goals");
};

export const deleteGoal = (id: number) => {
  return getAPI().delete(`/goals/${id}`);
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
  return getAPI().get<BudgetPlan>("/budget/plan", { params: { month } });
};

export const updateBudgetPlan = (data: {
  month: string;
  monthlyIncome: number;
  monthlyBudgetLimit: number;
}) => {
  return getAPI().put<BudgetPlan>("/budget/plan", data);
};

export const getExpenses = (month: string) => {
  return getAPI().get<Expense[]>("/budget/expenses", { params: { month } });
};

export const addExpense = (data: ExpensePayload) => {
  return getAPI().post<Expense>("/budget/expenses", data);
};

export const deleteExpense = (id: number) => {
  return getAPI().delete(`/budget/expenses/${id}`);
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
