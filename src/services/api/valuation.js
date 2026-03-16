import { api } from "./client.js";

export const getValuation  = ()        => api.get("/api/valuation");
export const saveValuation = (answers) => api.post("/api/valuation", answers);
