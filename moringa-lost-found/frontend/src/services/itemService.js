import axios from 'axios';

const API_URL = 'https://moringa-lost-found-api.onrender.com/api/reports';

const getAuthToken = () => {
  try {
    const userItem = localStorage.getItem('user');
    if (!userItem) return null;
    
    const user = JSON.parse(userItem);
    return user?.token || null;
  } catch (e) {
    console.error("Failed to parse user from localStorage", e);
    return null;
  }
};

const authAxios = axios.create({
  baseURL: API_URL,
});

authAxios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const itemService = {
  // Use public axios for fetching all items, in case it's a public endpoint
  getItems: () => axios.get(API_URL),
  
  // Use authenticated axios for user-specific actions
  createItem: (itemData) => authAxios.post('/create', itemData),
  updateItem: (id, itemData) => authAxios.put(`/${id}`, itemData),
  deleteItem: (id) => authAxios.delete(`/${id}`),
};

export default itemService;
