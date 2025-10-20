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
import { coursesApi } from './services/coursesApi';

const persistConfig = {
  key: 'root',
  storage: mmkvStorage,
  whitelist: ['quiz'],
  blacklist: ['coursesApi'],
};

const rootReducer = combineReducers({
  quiz: quizReducer,
  [coursesApi.reducerPath]: coursesApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(coursesApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;