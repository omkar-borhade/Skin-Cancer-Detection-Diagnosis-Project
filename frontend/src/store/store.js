import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // Adjust the path as per your structure

export const store = configureStore({
  reducer: {
    auth: authReducer, // Authentication reducer
  },
});

export default store;
