import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from '../../services/commentService';

const initialState = {
  comments: {},
  claims: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Fetch comments for an item
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (itemId, thunkAPI) => {
    try {
      const response = await commentService.getComments(itemId);
      return { itemId, comments: response.comments || response };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add a comment to an item
export const addComment = createAsyncThunk(
  'comments/addComment',
  async ({ itemId, commentData }, thunkAPI) => {
    try {
      const response = await commentService.addComment(itemId, commentData);
      // Refresh comments after adding
      thunkAPI.dispatch(fetchComments(itemId));
      return response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Claim an item
export const claimItem = createAsyncThunk(
  'comments/claimItem',
  async ({ itemId, claimData }, thunkAPI) => {
    try {
      const response = await commentService.claimItem(itemId, claimData);
      // Refresh claims after claiming
      thunkAPI.dispatch(fetchClaims(itemId));
      return response;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Fetch claims for an item
export const fetchClaims = createAsyncThunk(
  'comments/fetchClaims',
  async (itemId, thunkAPI) => {
    try {
      const response = await commentService.getClaims(itemId);
      return { itemId, claims: response.claims || response };
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    clearComments: (state) => {
      state.comments = {};
      state.claims = {};
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { itemId, comments } = action.payload;
        state.comments[itemId] = comments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addComment.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Claim item
      .addCase(claimItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(claimItem.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(claimItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Fetch claims
      .addCase(fetchClaims.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { itemId, claims } = action.payload;
        state.claims[itemId] = claims;
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearComments } = commentSlice.actions;
export default commentSlice.reducer;