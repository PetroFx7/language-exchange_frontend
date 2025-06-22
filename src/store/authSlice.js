import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const register = createAsyncThunk('auth/register', async (credentials) => {
    const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    return res.json();
});

export const login = createAsyncThunk('auth/login', async (credentials) => {
    const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    return res.json();
});

export const fetchCurrentUser = createAsyncThunk('auth/fetchCurrentUser', async (token) => {
    const res = await fetch('http://localhost:5000/users/me', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.json();
});

const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, token: null, status: 'idle', error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(register.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export default authSlice.reducer;