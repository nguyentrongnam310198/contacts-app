import axios from 'axios';
import { API_URL } from '@env';
import StorageService, { StorageKeys } from '../storage/storage';

const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Interceptor: Tự động gắn Token vào header mỗi khi gọi API
axiosClient.interceptors.request.use(async (config) => {
    const token = await StorageService.getItem(StorageKeys.ACCESS_TOKEN);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosClient;