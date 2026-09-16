import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8007",
  withCredentials: true,
});

export const registerCustomer = (data) => API.post("/customers/register", data);
export const loginCustomer = (data) => API.post("/customers/login", data);
export const getCustomerProfile = () => API.get("/customers/me");
export const logoutCustomer = () => API.post("/customers/logout");

export default API;
