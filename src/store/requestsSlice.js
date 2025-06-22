import { createSlice } from '@reduxjs/toolkit';

const requestsSlice = createSlice({
    name: 'requests',
    initialState: {
        sent: [],
    },
    reducers: {
        sendRequest: (state, action) => {
            if (!state.sent.includes(action.payload)) {
                state.sent.push(action.payload);
            }
        },
        cancelRequest: (state, action) => {
            state.sent = state.sent.filter(id => id !== action.payload);
        },
    },
});

export const { sendRequest, cancelRequest } = requestsSlice.actions;
export default requestsSlice.reducer;
