import { api } from "./client.js";

export async function signup({ name, email, password, companyName }) {
  const data = await api.post("/api/auth/signup", { name, email, password, companyName });
  localStorage.setItem("cfoly_token", data.token);
  return data;
}

export async function login({ email, password }) {
  const data = await api.post("/api/auth/login", { email, password });
  localStorage.setItem("cfoly_token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("cfoly_token");
}

export async function getMe() {
  return api.get("/api/auth/me");
}

export function hasToken() {
  return !!localStorage.getItem("cfoly_token");
}
