import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const registerUser = (data: { name?: string; email: string; password: string }) => {
  return API.post("/users/register", data);
};

export const loginUser = (data: { email: string; password: string }) => {
  return API.post("/auth/login", data);
};
