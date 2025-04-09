import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // This will now use the value from .env
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  verifyForgotPasswordOtp: (data) => api.post('/auth/verify-forgot-password-otp', data),
  resetPassword: (data) => api.post('/auth/reset-password', data)
};

// Blog services
export const blogService = {
  getAll: () => api.get('/blogs'),
  getById: (id) => api.get(`/blogs/${id}`),
  getByUser: (userId) => api.get(`/blogs/user/${userId}`),
  create: (blogData) => {
    const token = localStorage.getItem('token');
    return api.post('/blogs', blogData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },
  update: (id, blogData) => api.put(`/blogs/${id}`, blogData),
  delete: (id) => api.delete(`/blogs/${id}`),
  uploadImage: (imageData) => api.post('/blogs/upload-image', imageData)
};

// Article services
export const articleService = {
  getAll: () => api.get('/articles'),
  getById: (id) => api.get(`/articles/${id}`),
  getByUser: (userId) => api.get(`/articles/user/${userId}`),
  create: (articleData) => api.post('/articles', articleData),
  update: (id, articleData) => api.put(`/articles/${id}`, articleData),
  delete: (id) => api.delete(`/articles/${id}`)
};

// Interest services
export const interestService = {
  getAll: () => api.get('/interests'),
  getById: (id) => api.get(`/interests/${id}`),
  create: (interestData) => api.post('/interests', interestData),
  update: (id, interestData) => api.put(`/interests/${id}`, interestData),
  delete: (id) => api.delete(`/interests/${id}`)
};

// User services
export const userService = {
  updateProfile: (data) => api.put('/users/profile', data),
  deleteAccount: () => api.delete('/users/me'),
  changePassword: (data) => api.post('/users/change-password', data)
};

// Admin services
export const adminService = {
  getAllUsers: () => api.get('/admin/users'),
  deleteUser: (id) => api.delete(`/admin/users/${id}`)
};

// Contact services
export const contactService = {
  create: (data) => api.post('/contacts', data),
  getAll: () => api.get('/contacts'),
  updateStatus: (id, status) => api.patch(`/contacts/${id}/status`, { status }),
  delete: (id) => api.delete(`/contacts/${id}`)
};

export default api;