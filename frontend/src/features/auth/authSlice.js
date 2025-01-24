import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const initialState = {
  isLoggedIn: !!Cookies.get('token'), // Check if token is stored in cookies
  user: (() => {
    try {
      return Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    } catch (error) {
      console.error("Error parsing 'user' cookie:", error);
      Cookies.remove('user');
      return null;
    }
  })(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      Cookies.set('token', action.payload.token, { expires: 1 });
      Cookies.set('user', JSON.stringify(action.payload.user), { expires: 1 });
    },
    logoutSuccess: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      Cookies.remove('token');
      Cookies.remove('user');
    },
  },
});

export const { loginSuccess, logoutSuccess } = authSlice.actions;

export default authSlice.reducer;
