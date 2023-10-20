import { createSlice } from '@reduxjs/toolkit';

export const countCallSlice = createSlice({
    name: 'countCall',
    initialState: {
        value: 0,
    },

    reducers: {
        incrementCall: (state) => {
            state.value += 1;

            if (state.value > 99) {
                state.value = 100;
            }
        },

        decrementCall: (state, {payload}) => {
            if (state.value > 0) {
                state.value -= payload;
            } else {
                state.value = 0;
            };
        },

        decrementCallAll: (state) => {
            state.value = 0
        },
    },
})

export const { incrementCall, decrementCall, decrementCallAll } = countCallSlice.actions

export default countCallSlice.reducer

