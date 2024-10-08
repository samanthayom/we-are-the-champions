import axios, { AxiosResponse } from 'axios';
import { CustomError } from '../interfaces';


export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});


export const apiRequest = async <T>(request: Promise<AxiosResponse<T>>): Promise<T> => {
  try {
      const response = await request;
      console.log('API Response:', response.data);
      return response.data;
  } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
          const statusCode = error.response.status;
          const errorDetail = error.response.data?.detail || 'An error occurred';

          console.error(`API Error: ${statusCode} - ${errorDetail}`);
          throw new CustomError(errorDetail);
      } else {
          console.error('Unknown API error:', error);
          throw new Error('Unknown error occurred while making API request');
      }
  }
};

