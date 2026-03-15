import api from './api';

const AUTH_PREFIX = '/api/auth';

/**
 * Login user — stores JWT token in localStorage on success.
 * @param {string} email
 * @param {string} password
 * @returns {Object} Response data including token and user
 */
export const loginUser = async (email, password) => {
    const { data } = await api.post(`${AUTH_PREFIX}/login`, { email, password });
    if (data.token) {
        localStorage.setItem('token', data.token);
    }
    return data;
};

/**
 * Register a new user — does NOT store token (user must login after).
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Object} Response data
 */
export const registerUser = async (name, email, password) => {
    const { data } = await api.post(`${AUTH_PREFIX}/register`, { name, email, password });
    return data;
};

/**
 * Logout user — removes JWT token from localStorage.
 */
export const logoutUser = () => {
    localStorage.removeItem('token');
};
