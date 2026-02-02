import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/lib/axios";

// User ka structure
interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  profilePic?: string;
  bio?: string;
  github?: string;
  portfolio?: string;
  linkedin?: string;
  techstack?: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Login user
export const loginUser = createAsyncThunk<User, any, { rejectValue: string }>(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/login", userData);
      localStorage.setItem("token", response.data.token);
      return response.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    setAuth: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Signup user
export const signupUser = createAsyncThunk<User, any, { rejectValue: string }>(
  "auth/signup",
  async (userData, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/signup", userData);
      localStorage.setItem("token", response.data.token);
      return response.data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer;
