import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';

const initialState = {
  admin: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  reports: [],
  inventory: [],
  foundItems: [],
  claimedItems: [],
  pendingItems: [],
  pendingClaims: [],
};

// Admin authentication
export const adminLogin = createAsyncThunk(
  'admin/login',
  async (credentials, thunkAPI) => {
    try {
      return await adminService.adminLogin(credentials);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminSignup = createAsyncThunk(
  'admin/signup',
  async (adminData, thunkAPI) => {
    try {
      return await adminService.adminSignup(adminData);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminLogout = createAsyncThunk('admin/logout', async () => {
  adminService.adminLogout();
});

export const fetchCurrentAdmin = createAsyncThunk(
  'admin/fetchCurrentAdmin',
  async (_, thunkAPI) => {
    try {
      const admin = await adminService.getCurrentAdmin();
      if (!admin) {
        thunkAPI.dispatch(adminLogout());
        return thunkAPI.rejectWithValue('Session expired. Please login again.');
      }
      return admin;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Report management
export const fetchAllReports = createAsyncThunk(
  'admin/fetchAllReports',
  async (_, thunkAPI) => {
    try {
      return await adminService.getAllReports();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const approveReport = createAsyncThunk(
  'admin/approveReport',
  async (reportId, thunkAPI) => {
    try {
      const result = await adminService.approveReport(reportId);
      // Refresh reports after approval
      thunkAPI.dispatch(fetchAllReports());
      return result;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Inventory management
export const fetchInventory = createAsyncThunk(
  'admin/fetchInventory',
  async (_, thunkAPI) => {
    try {
      return await adminService.getInventory();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchFoundItems = createAsyncThunk(
  'admin/fetchFoundItems',
  async (_, thunkAPI) => {
    try {
      return await adminService.getFoundItems();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const fetchClaimedItems = createAsyncThunk(
  'admin/fetchClaimedItems',
  async (_, thunkAPI) => {
    try {
      return await adminService.getClaimedItems();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addItemToInventory = createAsyncThunk(
  'admin/addItemToInventory',
  async (itemId, thunkAPI) => {
    try {
      const result = await adminService.addItemToInventory(itemId);
      // Refresh inventory after adding item
      thunkAPI.dispatch(fetchInventory());
      thunkAPI.dispatch(fetchFoundItems());
      return result;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeItemFromInventory = createAsyncThunk(
  'admin/removeItemFromInventory',
  async (itemId, thunkAPI) => {
    try {
      const result = await adminService.removeItem(itemId);
      // Refresh inventory after removing item
      thunkAPI.dispatch(fetchInventory());
      return result;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Item approval management
export const fetchPendingItems = createAsyncThunk(
  'admin/fetchPendingItems',
  async (_, thunkAPI) => {
    try {
      return await adminService.getPendingItems();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const approveItem = createAsyncThunk(
  'admin/approveItem',
  async (itemId, thunkAPI) => {
    try {
      const result = await adminService.approveItem(itemId);
      // Refresh pending items after approval
      thunkAPI.dispatch(fetchPendingItems());
      return result;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const rejectItem = createAsyncThunk(
  'admin/rejectItem',
  async ({ itemId, reason }, thunkAPI) => {
    try {
      const result = await adminService.rejectItem(itemId, reason);
      // Refresh pending items after rejection
      thunkAPI.dispatch(fetchPendingItems());
      return result;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Claim approval management
export const fetchPendingClaims = createAsyncThunk(
  'admin/fetchPendingClaims',
  async (_, thunkAPI) => {
    try {
      return await adminService.getPendingClaims();
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const approveClaim = createAsyncThunk(
  'admin/approveClaim',
  async (claimId, thunkAPI) => {
    try {
      const result = await adminService.approveClaim(claimId);
      // Refresh pending claims and claimed items after approval
      thunkAPI.dispatch(fetchPendingClaims());
      thunkAPI.dispatch(fetchClaimedItems());
      return result;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const rejectClaim = createAsyncThunk(
  'admin/rejectClaim',
  async (claimId, thunkAPI) => {
    try {
      const result = await adminService.rejectClaim(claimId);
      // Refresh pending claims after rejection
      thunkAPI.dispatch(fetchPendingClaims());
      return result;
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin login
      .addCase(adminLogin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.admin = action.payload;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.admin = null;
      })
      // Admin signup
      .addCase(adminSignup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(adminSignup.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(adminSignup.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Admin logout
      .addCase(adminLogout.fulfilled, (state) => {
        state.admin = null;
        state.reports = [];
        state.inventory = [];
        state.foundItems = [];
        state.claimedItems = [];
        state.pendingItems = [];
        state.pendingClaims = [];
      })
      // Fetch current admin
      .addCase(fetchCurrentAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.admin = action.payload;
      })
      .addCase(fetchCurrentAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.admin = null;
      })
      // Fetch reports
      .addCase(fetchAllReports.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = Array.isArray(action.payload) ? action.payload :
                       action.payload?.lost_items || action.payload?.reports || [];
      })
      .addCase(fetchAllReports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.reports = [];
      })
      // Approve report
      .addCase(approveReport.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveReport.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(approveReport.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Fetch inventory
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.inventory = action.payload.inventory_items || [];
      })
      // Fetch found items
      .addCase(fetchFoundItems.fulfilled, (state, action) => {
        state.foundItems = action.payload.found_items || [];
      })
      // Fetch claimed items
      .addCase(fetchClaimedItems.fulfilled, (state, action) => {
        state.claimedItems = action.payload.claimed_items || [];
      })
      // Fetch pending items
      .addCase(fetchPendingItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPendingItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingItems = action.payload.pending_items || [];
      })
      .addCase(fetchPendingItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.pendingItems = [];
      })
      // Approve item
      .addCase(approveItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveItem.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(approveItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Reject item
      .addCase(rejectItem.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rejectItem.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(rejectItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Fetch pending claims
      .addCase(fetchPendingClaims.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPendingClaims.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingClaims = action.payload.pending_claims || [];
      })
      .addCase(fetchPendingClaims.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.pendingClaims = [];
      })
      // Approve claim
      .addCase(approveClaim.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(approveClaim.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(approveClaim.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Reject claim
      .addCase(rejectClaim.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rejectClaim.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(rejectClaim.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, setAdmin } = adminSlice.actions;
export default adminSlice.reducer;