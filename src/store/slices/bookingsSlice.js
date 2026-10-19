import { createSlice } from '@reduxjs/toolkit';
import { MOCK_BOOKINGS } from '../../data/mockData';

const initialState = {
  bookings: MOCK_BOOKINGS,
  lastBooking: null,
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    addBooking: (state, action) => {
      state.bookings.unshift(action.payload);
      state.lastBooking = action.payload;
    },
    cancelBooking: (state, action) => {
      const booking = state.bookings.find(b => b.id === action.payload);
      if (booking) {
        booking.status = 'cancelled';
      }
    },
    setLastBooking: (state, action) => {
      state.lastBooking = action.payload;
    },
  },
});

export const { addBooking, cancelBooking, setLastBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
