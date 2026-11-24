import axios from 'axios';
import { signOut } from 'next-auth/react';
import { AppRoutes } from '@/utils/routes';

// Several requests (e.g. the polling) can get a 401 at the same time: sign out only once.
let isSigningOut = false;

const signOutOnUnauthorized = () => {
  if (isSigningOut) {
    return;
  }

  isSigningOut = true;
  // After the new login the user goes back to the page they were on.
  const loginParams = new URLSearchParams({
    error: 'unauthorized',
    callbackUrl: `${window.location.pathname}${window.location.search}`,
  });
  void signOut({ callbackUrl: `${AppRoutes.login}?${loginParams}` });
};

const axiosInstance = axios.create({
  baseURL: '/api/hawkbit',
  headers: {
    Accept: 'application/json, application/hal+json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      signOutOnUnauthorized();
    }
    if (error.response) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      exceptionClass: 'NetworkError',
      errorCode: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
    });
  }
);

export default axiosInstance;
