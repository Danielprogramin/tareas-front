import axios from '@/app/lib/axios';


export const login = async (email: string, password: string) => {
  const res = await axios.post('/auth/login', { email, password });
  const token = res.data.token;

  localStorage.setItem('token', token); 
  return token;
};

export const register = async (email: string, password: string) => {
  return await axios.post('/auth/register', { email, password });
};

export const logout = async () => {
  localStorage.removeItem('token');
};

export const getUser = async (token: string) => {
  return await axios.get('/auth/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
