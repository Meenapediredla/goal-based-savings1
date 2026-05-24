import axios from "axios";

const API = axios.create({
  baseURL: "https://goal-based-savings-backend.onrender.com/api", // 👈 Hardcoded
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
      console.error("Cannot reach the server");
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.clear();
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// 👇 Interfaces mundhu ravali
export interface GoalPayload {
  goalName: string;
  targetAmount: number;
  savedAmount: number;
  deadline: string;
}

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

// 👇 Auth APIs - Backend /api/login aithe /login vadali
export const registerUser = (data: { name?: string; email: string; password: string }) => {
  return API.post("/users/register", data);
};

export const loginUser = (data: { email: string; password: string }) => {
  return API.post("/auth/login", data);
};

// 👇 Goals APIs
export const createGoal = (data: GoalPayload) => {
  return API.post("/goals", data);
};

export const getAllGoals = () => {
  return API.get("/goals");
};

export const deleteGoal = (id: number) => {
  return API.delete(`/goals/${id}`);
};

// 👇 Budget APIs
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
