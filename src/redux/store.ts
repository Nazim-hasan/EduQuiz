import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import { mmkvStorage } from '../utils/storage';
import quizReducer from './slices/quizSlice';
import courseReducer from './slices/courseSlice';

const persistConfig = {
  key: 'root',
  storage: mmkvStorage,
  whitelist: ['quiz', 'courses'], // Only persist these reducers
};

const rootReducer = combineReducers({
  quiz: quizReducer,
  courses: courseReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;