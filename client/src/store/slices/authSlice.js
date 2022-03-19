import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  status: 'idle',
  isLoggedIn: false,
  user: {},
  token: ''
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData) => {
    const { data } = await axios.post('/auth/login', userData);
    return data;
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData) => {
    const { data } = await axios.post('/auth/register', userData);
    return data;
  }
);

export const getConversationsToken = createAsyncThunk(
  'auth/getConversationsToken',
  async (userEmail) => {
    const { data } = await axios.get(`/auth/user/${userEmail}`);
    return data;
  }
);

export const updateUserFriendlyName = createAsyncThunk(
  'auth/updateUserFriendlyName',
  async (userData) => {
    const { data } = await axios.post('/auth/update', userData);
    return data;
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logout: (state) => {
      localStorage.clear();
      state.isLoggedIn = false;
      axios.defaults.headers.common.authorization = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: {
    [loginUser.pending]: (state) => {
      state.status = 'loading';
    },
    [loginUser.fulfilled]: (state, action) => {
      const {
        token, name, email, id
      } = action.payload.response;
      localStorage.setItem(
        'user',
        JSON.stringify({
          name, email
        })
      );
      state.user.name = name;
      state.user.email = email;
      state.user.id = id;
      state.status = 'success';
      state.token = token;
      state.isLoggedIn = true;
    },
    [loginUser.rejected]: (state) => {
      state.status = 'failed';
      state.isLoggedIn = false;
    },
    [registerUser.pending]: (state) => {
      state.status = 'loading';
    },
    [registerUser.fulfilled]: (state, action) => {
      const {
        token, name, email, id
      } = action.payload.response;
      localStorage.setItem(
        'user',
        JSON.stringify({
          name, email
        })
      );
      state.user.name = name;
      state.user.email = email;
      state.user.id = id;
      state.status = 'success';
      state.token = token;
      state.isLoggedIn = true;
    },
    [registerUser.rejected]: (state) => {
      state.status = 'failed';
    },
    [getConversationsToken.pending]: (state) => {
      state.status = 'loading';
    },
    [getConversationsToken.fulfilled]: (state, action) => {
      const {
        token, name, email, id
      } = action.payload.response;
      state.token = action.payload.token;
      state.user.name = name;
      state.user.email = email;
      state.user.id = id;
      state.status = 'success';
      state.token = token;
      state.isLoggedIn = true;
    },
    [updateUserFriendlyName.pending]: (state) => {
      state.status = 'loading';
    },
    [updateUserFriendlyName.fulfilled]: (state, action) => {
      const { name } = action.payload.response;
      state.user.name = name;
      state.status = 'success';
    }
  }
});

export default authSlice.reducer;
