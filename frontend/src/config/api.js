const API_BASE_URL = process.env.REACT_APP_API_URL;

console.log('API URL:', process.env.REACT_APP_API_URL);

// API endpoints - using proxy in development
export const API_ENDPOINTS = {
  GENERATE_IMAGE: `${API_BASE_URL}/api/images/generate`,
  DRAFTS: `${API_BASE_URL}/api/drafts`,
  ORDERS: `${API_BASE_URL}/api/orders`
}; 