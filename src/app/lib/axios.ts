import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// ⬇️ Interceptor para incluir el token en cada request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // o desde algún auth context
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
// ⬇️ Interceptor para manejar errores globalmente