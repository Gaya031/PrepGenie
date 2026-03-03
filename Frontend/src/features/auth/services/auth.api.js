import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/";

export const login = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}login`,
      { email, password },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}register`,
      { username, email, password },
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = () => {
  try {
    const response = axios.post(`${API_URL}logout`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMe = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const response = axios.get(`${API_URL}get-me`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
