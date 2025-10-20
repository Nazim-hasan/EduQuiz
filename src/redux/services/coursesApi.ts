import { createApi } from '@reduxjs/toolkit/query/react';
import axios from 'axios';
import { storage } from '../../utils/storage';

const COURSES_CACHE_KEY = 'rtk_courses_cache';
const CACHE_TIMESTAMP_KEY = 'rtk_courses_timestamp';

const axiosBaseQuery =
  ({ baseUrl }: { baseUrl: string }) =>
  async ({ url, method = 'GET', data, params }: any) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        params,
        timeout: 10000,
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
      
      try {
        storage.set(COURSES_CACHE_KEY, JSON.stringify(result.data));
        storage.set(CACHE_TIMESTAMP_KEY, Date.now());
      } catch (cacheError) {
      }
      
      return { data: result.data };
    } catch (axiosError: any) {
      console.error('❌ API Error:', axiosError.message);
      
      try {
        const cachedData = storage.getString(COURSES_CACHE_KEY);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          return { 
            data: parsed,
            meta: { fromCache: true }
          };
        }
      } catch (cacheError) {
        console.error('❌ Cache load error:', cacheError);
      }
      
      const err = axiosError;
      return {
        error: {
          status: err.response?.status || 'NETWORK_ERROR',
          data: err.response?.data || err.message || 'Network request failed',
        },
      };
    }
  };

export const coursesApi = createApi({
  reducerPath: 'coursesApi',
  baseQuery: axiosBaseQuery({
    baseUrl: 'https://raw.githubusercontent.com/Nazim-hasan/EduQuizApi/main/',
  }),
  tagTypes: ['Courses'],

  keepUnusedDataFor: 0,
  refetchOnMountOrArgChange: true,
  refetchOnFocus: true,
  refetchOnReconnect: true,
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: () => ({
        url: `courses.json`,
        method: 'GET',
      }),
      providesTags: ['Courses'],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetCoursesQuery } = coursesApi;

export const getCacheTimestamp = () => {
  return storage.getNumber(CACHE_TIMESTAMP_KEY) || null;
};

export const clearCoursesCache = () => {
  try {
    storage.delete(COURSES_CACHE_KEY);
    storage.delete(CACHE_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Error:', error);
  }
};