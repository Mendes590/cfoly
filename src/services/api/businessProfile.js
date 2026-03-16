import { api } from "./client.js";

export const getBusinessProfile = ()       => api.get("/api/business-profile");
export const saveBusinessProfile = (data)  => api.post("/api/business-profile", data);
