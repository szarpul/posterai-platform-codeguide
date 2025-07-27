import axios from 'axios';
import { supabase } from '../lib/supabaseClient';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

console.log('🌐 API Base URL:', API_BASE_URL);
console.log('🌐 Environment variable:', process.env.REACT_APP_API_URL);

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('🔐 Auth interceptor - Session:', session ? 'exists' : 'null');
  console.log('🔐 Auth interceptor - Access token:', session?.access_token ? 'exists' : 'null');
  
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
    console.log('🔐 Auth interceptor - Added Authorization header');
  } else {
    console.log('🔐 Auth interceptor - No session or access token');
    // TEMPORARY: For testing without auth, add a dummy token
    // config.headers.Authorization = `Bearer dummy-token-for-testing`;
  }
  return config;
});

export const paymentService = {
  // Create payment intent for an order
  createPaymentIntent: async (orderId) => {
    try {
      const response = await api.post(`/orders/${orderId}/payment`);
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error(error.response?.data?.error || 'Failed to create payment intent');
    }
  },

  // Create a new order
  createOrder: async (orderData) => {
    try {
      console.log('📡 Making request to:', `${API_BASE_URL}/orders`);
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error(error.response?.data?.error || 'Failed to create order');
    }
  },

  // Get order details
  getOrder: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch order');
    }
  },

  // Get user's orders
  getUserOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new Error(error.response?.data?.error || 'Failed to fetch orders');
    }
  },

  // Cancel a pending order
  cancelOrder: async (orderId) => {
    try {
      const response = await api.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw new Error(error.response?.data?.error || 'Failed to cancel order');
    }
  }
};

export default paymentService; 