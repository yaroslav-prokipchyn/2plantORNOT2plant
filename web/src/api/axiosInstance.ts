import axios from 'axios';
import { notification } from 'antd';
import { config } from 'src/config/config';
import { fetchAuthSession } from 'aws-amplify/auth';
import { t } from 'i18next';

type Error = {
  status: number,
  message: string
}

const baseURL = config.API_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = (await fetchAuthSession()).tokens?.accessToken.toString();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['Admin-Role'] = document.cookie.split(';').find(c => c.includes('role'))?.split('=')[1] ?? 'admin'
  }
  return config;
})

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const customError: Error = {
      message: error.message,
      status: error.response?.status,
    };

    notification.config({
      top: 80,
      placement: 'top',
      maxCount: 3
    })

    notification.error({
      message: getErrorMessage(customError),
      description: t('Error code',  { httpCode :customError.status }),
    })

    return Promise.reject(customError);
  }
);

export default axiosInstance;

function getErrorMessage(error: Error) {
  switch (error.status) {
    case 400:
      return t('Unknown request route! The request could not be understood by the server.')
    case 409:
      return t('An organization with such information already exists!')
    case 500:
      return t('Service Error: Something went wrong.')
    default:
      return error.message
  }
}
