import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Check if backend server is available
 * @returns {Promise<boolean>} true if backend is online, false otherwise
 */
export const checkBackendStatus = async () => {
  try {
    // Try to hit a public endpoint (items or health check)
    const response = await axios.get(`${API_BASE_URL}/items`, {
      timeout: 5000, // 5 second timeout
    });
    return response.status === 200;
  } catch (error) {
    // Network error, timeout, or server not responding
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response) {
      return false;
    }
    // If we get any response (even 401, 403, 500), server is online
    return true;
  }
};

/**
 * Check backend status with retry
 * @param {number} retries - Number of retry attempts
 * @returns {Promise<boolean>}
 */
export const checkBackendWithRetry = async (retries = 2) => {
  for (let i = 0; i < retries; i++) {
    const isOnline = await checkBackendStatus();
    if (isOnline) return true;
    
    // Wait 2 seconds before retry
    if (i < retries - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return false;
};
