import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    showReportModal: false,
    showSearchModal: false,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setShowReportModal: (state, action) => {
      state.showReportModal = action.payload;
    },
    setShowSearchModal: (state, action) => {
      state.showSearchModal = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const {
  setShowReportModal,
  setShowSearchModal,
  setLoading,
  setError,
  setSuccessMessage,
  clearMessages,
} = uiSlice.actions;

export default uiSlice.reducer;
