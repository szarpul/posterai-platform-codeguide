const API_BASE_URL = process.env.REACT_APP_API_URL;

console.log('API URL:', process.env.REACT_APP_API_URL);

// API endpoints - using proxy in development
export const API_ENDPOINTS = {
  GENERATE_IMAGE: `${API_BASE_URL}/images/generate`,
  DRAFTS: `${API_BASE_URL}/drafts`,
  ORDERS: `${API_BASE_URL}/orders`,
  QUESTIONNAIRE_OPTIONS: `${API_BASE_URL}/questionnaire/options`,
  QUESTIONNAIRE_BASE: `${API_BASE_URL}/questionnaire`,
};
