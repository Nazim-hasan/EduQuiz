import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course, CourseState } from '../../types';
import coursesData from '../../data/courses.json';
import { storage } from '../../utils/storage';

const COURSES_CACHE_KEY = 'cached_courses';
const CACHE_TIMESTAMP_KEY = 'courses_cache_timestamp';

// Try to load cached courses
const loadCachedCourses = (): Course[] => {
  try {
    const cachedData = storage.getString(COURSES_CACHE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData) as Course[];
    }
  } catch (error) {
    console.error('Error loading cached courses:', error);
  }
  return [];
};

const initialCourses = loadCachedCourses();

const initialState: CourseState = {
  courses: initialCourses.length > 0 ? initialCourses : [],
  loading: false,
  error: null,
  lastFetched: storage.getNumber(CACHE_TIMESTAMP_KEY) || null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    fetchCoursesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCoursesSuccess: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
      state.loading = false;
      state.lastFetched = Date.now();
      
      // Cache courses in MMKV
      try {
        storage.set(COURSES_CACHE_KEY, JSON.stringify(action.payload));
        storage.set(CACHE_TIMESTAMP_KEY, Date.now());
      } catch (error) {
        console.error('Error caching courses:', error);
      }
    },
    fetchCoursesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearCoursesCache: (state) => {
      storage.delete(COURSES_CACHE_KEY);
      storage.delete(CACHE_TIMESTAMP_KEY);
      state.lastFetched = null;
    },
  },
});

export const {
  fetchCoursesStart,
  fetchCoursesSuccess,
  fetchCoursesFailure,
  clearCoursesCache,
} = courseSlice.actions;

// Thunk to fetch courses (simulating API call)
export const fetchCourses = () => async (dispatch: any) => {
  dispatch(fetchCoursesStart());
  
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In real app, this would be: const response = await fetch('API_URL');
    const courses = coursesData as Course[];
    
    dispatch(fetchCoursesSuccess(courses));
  } catch (error) {
    dispatch(fetchCoursesFailure('Failed to fetch courses'));
  }
};

export default courseSlice.reducer;