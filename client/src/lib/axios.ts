import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this to your server port
  headers: {
    'Content-Type': 'application/json',
  },
});

// This "Interceptor" automatically attaches your token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;