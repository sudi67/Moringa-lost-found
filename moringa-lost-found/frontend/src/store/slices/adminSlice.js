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
        state.reports = action.payload;
      })
      .addCase(fetchAllReports.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
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
      });
  },
});

export const { reset, setAdmin } = adminSlice.actions;
export default adminSlice.reducer;