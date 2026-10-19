import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toast: null,
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toast = action.payload; // { message, type: 'success'|'error'|'info' }
    },
    clearToast: (state) => {
      state.toast = null;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const { showToast, clearToast, setMobileMenuOpen } = uiSlice.actions;
export default uiSlice.reducer;
