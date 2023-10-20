import { createSlice } from '@reduxjs/toolkit';

export const itemCallSlice = createSlice({
    name: 'itemCall',
    initialState: {
        items: [],
    },

    reducers: {
        incrementItemCall: (state, { payload }) => {
            if (state.items.length > 99) {
                state.items.splice(99, 1)
            }
            state.items.splice(0, 0, payload);
        },

        seenToTrue: (state, { payload }) => {
            const item = state.items.find(item => item.id === payload)
            if (item) {
               item.seen = true
            }
        },

        seenAllTrue: (state) => {
            state.items.map(item => {
                    if (item.seen === false) {
                        item.seen = true
                    }
                }
            )
        },
    }
})

export const { incrementItemCall, seenToTrue, seenAllTrue } = itemCallSlice.actions

export default itemCallSlice.reducer;