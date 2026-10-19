import { createSlice } from '@reduxjs/toolkit';
import { SESSIONS, TAGS } from '../../data/mockData';

const initialState = {
  sessions: SESSIONS,
  tags: TAGS,
  filters: {
    search: '',
    tags: [],
    mode: '',
    dateRange: '',
    sortBy: 'recommended',
    priceMax: null,
  },
};

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    addSession: (state, action) => {
      state.sessions.unshift(action.payload);
    },
    updateSession: (state, action) => {
      const idx = state.sessions.findIndex(s => s.id === action.payload.id);
      if (idx !== -1) {
        state.sessions[idx] = action.payload;
      }
    },
    deactivateSession: (state, action) => {
      const session = state.sessions.find(s => s.id === action.payload);
      if (session) {
        session.status = 'inactive';
      }
    },
    addTag: (state, action) => {
      state.tags.push(action.payload);
    },
    updateTag: (state, action) => {
      const idx = state.tags.findIndex(t => t.id === action.payload.id);
      if (idx !== -1) {
        state.tags[idx] = action.payload;
      }
    },
    deleteTag: (state, action) => {
      state.tags = state.tags.filter(t => t.id !== action.payload);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        tags: [],
        mode: '',
        dateRange: '',
        sortBy: 'recommended',
        priceMax: null,
      };
    },
  },
});

export const {
  addSession,
  updateSession,
  deactivateSession,
  addTag,
  updateTag,
  deleteTag,
  setFilters,
  clearFilters,
} = sessionsSlice.actions;
export default sessionsSlice.reducer;
