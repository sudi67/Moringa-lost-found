import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import rewardService from '../../services/rewardService';

// Async thunks
export const fetchMyRewards = createAsyncThunk(
  'rewards/fetchMyRewards',
  async (_, { rejectWithValue }) => {
    try {
      const response = await rewardService.getMyRewards();
      return response;
    } catch (error) {
      return rejectWithValue(error.error || 'Failed to fetch rewards');
    }
  }
);

export const fetchRewardsByItemId = createAsyncThunk(
  'rewards/fetchRewardsByItemId',
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await rewardService.getRewardsByItemId(itemId);
      return response;
    } catch (error) {
      return rejectWithValue(error.error || 'Failed to fetch rewards for item');
    }
  }
);

export const createReward = createAsyncThunk(
  'rewards/createReward',
  async (rewardData, { rejectWithValue }) => {
    try {
      const response = await rewardService.createReward(rewardData);
      return response;
    } catch (error) {
      return rejectWithValue(error.error || 'Failed to create reward');
    }
  }
);

export const initiatePayment = createAsyncThunk(
  'rewards/initiatePayment',
  async (rewardId, { rejectWithValue }) => {
    try {
      const response = await rewardService.initiatePayment(rewardId);
      return response;
    } catch (error) {
      return rejectWithValue(error.error || 'Failed to initiate payment');
    }
  }
);

const rewardSlice = createSlice({
  name: 'rewards',
  initialState: {
    rewardsGiven: [],
    rewardsReceived: [],
    itemRewards: [],
    loading: false,
    error: null,
    selectedReward: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedReward: (state, action) => {
      state.selectedReward = action.payload;
    },
    clearSelectedReward: (state) => {
      state.selectedReward = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch rewards
      .addCase(fetchMyRewards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyRewards.fulfilled, (state, action) => {
        state.loading = false;
        state.rewardsGiven = action.payload.rewards_given || [];
        state.rewardsReceived = action.payload.rewards_received || [];
      })
      .addCase(fetchMyRewards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch rewards by item ID
      .addCase(fetchRewardsByItemId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRewardsByItemId.fulfilled, (state, action) => {
        state.loading = false;
        state.itemRewards = action.payload.rewards || [];
      })
      .addCase(fetchRewardsByItemId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create reward
      .addCase(createReward.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReward.fulfilled, (state, action) => {
        state.loading = false;
        // Add to appropriate list based on reward type
        const newReward = action.payload.reward;
        if (newReward) {
          state.rewardsGiven.unshift(newReward);
        }
      })
      .addCase(createReward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Initiate payment
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        // Update reward status after payment initiation
        const { transaction_id } = action.payload;
        // This would need to be handled more specifically based on the reward ID
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setSelectedReward, clearSelectedReward } = rewardSlice.actions;

export default rewardSlice.reducer;
