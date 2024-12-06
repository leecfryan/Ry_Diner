import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your backend URL
});

// Add Authorization header for protected routes
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (userData) => API.post("/users/register", userData);
export const login = (userData) => API.post("/users/login", userData);
export const createOrder = (orderData) => API.post("/orders", orderData);
// Fetch all orders (Admin only)
export const fetchOrders = (activePage = 1, historyPage = 1) =>
  API.get(`/orders?activePage=${activePage}&historyPage=${historyPage}`);
// Update order status
export const updateOrder = (orderId, data) =>
  API.put(`/orders/${orderId}`, data);

export default API;
