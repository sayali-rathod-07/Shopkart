import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8007",
  withCredentials: true,
});

// Auth
export const registerCustomer = (data) => API.post("/customers/register", data);
export const loginCustomer = (data) => API.post("/customers/login", data);
export const getCustomerProfile = () => API.get("/customers/me");
export const logoutCustomer = () => API.post("/customers/logout");

// Products
export const fetchProducts = (search = "", category = "") => {
  const params = {};
  if (search) params.search = search;
  if (category && category !== "All") params.category = category;
  return API.get("/products", { params });
};
export const fetchProductById = (id) => API.get(`/products/${id}`);

// Wishlist
export const addToWishlistApi = (productId) => API.post(`/wishlist/${productId}`);
export const getWishlistApi = () => API.get("/wishlist");
export const removeFromWishlistApi = (productId) => API.delete(`/wishlist/${productId}`);

// Cart
export const getCartApi = () => API.get("/cart");
export const addToCartApi = (productId) => API.post(`/cart/${productId}`);
export const updateCartQuantityApi = (productId, quantity) =>
  API.patch(`/cart/${productId}`, { quantity });
export const removeFromCartApi = (productId) => API.delete(`/cart/${productId}`);

// Orders
export const createPaymentOrderApi = (data) => API.post("/orders/create-payment-order", data);
export const verifyPaymentApi = (data) => API.post("/orders/verify-payment", data);
export const getMyOrdersApi = () => API.get("/orders");
export const getOrderByIdApi = (id) => API.get(`/orders/${id}`);

export default API;
