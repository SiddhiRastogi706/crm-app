import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Broadcast channel for multi-tab auth sync
const authChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel('pulse_crm_auth')
  : null;

export const broadcastAuthEvent = (event: 'LOGIN' | 'LOGOUT', payload?: any) => {
  if (authChannel) {
    authChannel.postMessage({ event, payload });
  }
};

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('pulse_crm_auth');
        if (stored) {
          const parsed = JSON.parse(stored);
          const token = parsed?.state?.tokens?.accessToken;
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch (err) {
        console.error('Error reading token from storage', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and auto refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and not already retrying and not login/refresh endpoint
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        let refreshToken: string | null = null;
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('pulse_crm_auth');
          if (stored) {
            const parsed = JSON.parse(stored);
            refreshToken = parsed?.state?.tokens?.refreshToken || null;
          }
        }

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post('/api/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update local storage auth store
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('pulse_crm_auth');
          if (stored) {
            const parsed = JSON.parse(stored);
            parsed.state.tokens = { accessToken, refreshToken: newRefreshToken };
            localStorage.setItem('pulse_crm_auth', JSON.stringify(parsed));
          }
        }

        processQueue(null, accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear storage and broadcast logout
        if (typeof window !== 'undefined') {
          localStorage.removeItem('pulse_crm_auth');
          broadcastAuthEvent('LOGOUT');
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
