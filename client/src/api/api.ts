import axios from "axios";

const API = axios.create({
  baseURL: "https://goal-based-savings-backend.onrender.com/api", // 👈 Hardcode chesey for testing
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
      console.error("Backend down or CORS issue");
    } else if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.clear();
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// 👇 Backend /api/login aithe ila unchali
export const registerUser = (data: { name?: string; email: string; password: string }) => {
  return API.post("/register", data);
};

export const loginUser = (data: { email: string; password: string }) => {
  return API.post("/login", data);
};

// Migilina functions alane unchuko
export const createGoal = (data: GoalPayload) => {
  return API.post("/goals", data);
};

export const getAllGoals = () => {
  return API.get("/goals");
};

export const deleteGoal = (id: number) => {
  return API.delete(`/goals/${id}`);
};
