import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { User, UserFormData, UserState } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async (_,{rejectWithValue}) => {
  try {
    const response = await axios.get(`${API_URL}/api/users`);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.error || error.message);
  }

});

export const createUser = createAsyncThunk<User, UserFormData>('users/createUser', async (userData, {rejectWithValue}) => {
  try {
    const response = await axios.post(`${API_URL}/api/users`, userData);
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error?.response?.data?.error || error.message);
  }
});

const initialState: UserState = {
  users: [],
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch users';
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create user';
      });
  }
});

export default userSlice.reducer;