import { createSlice } from '@reduxjs/toolkit';
import { MOCK_USER } from '../../data/mockData';

const initialState = {
  isAuthenticated: false,
  user: null,
  isAdmin: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload || MOCK_USER;
      state.isAdmin = false;
    },
    loginAsAdmin: (state) => {
      state.isAuthenticated = true;
      state.user = { ...MOCK_USER, name: 'Admin User', email: 'admin@bookmytherapy.com' };
      state.isAdmin = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isAdmin = false;
    },
    toggleAdmin: (state) => {
      state.isAdmin = !state.isAdmin;
    },
  },
});

export const { login, loginAsAdmin, logout, toggleAdmin } = authSlice.actions;
export default authSlice.reducer;
