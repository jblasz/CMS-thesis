import axios from 'axios';
import { appEnv } from '../../appEnv';

export const axiosInstance = axios.create({
  baseURL: appEnv().backendAddress,
  withCredentials: false,
});
