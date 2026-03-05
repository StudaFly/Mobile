import axios from 'axios';
import { env } from '@/core/config/env';

const apiClient = axios.create({
  baseURL: env.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
