import { createSlice } from '@reduxjs/toolkit';

export const itemChatSlice = createSlice({
    name: 'itemChat',
    initialState: {
        items: [],
        value: 0,
    },

    reducers: {
        incrementItemChat: (state, { payload }) => {
            if (state.items.length > 99) {
                if (!state.items[99].seen) {
                    state.value -= 1;
                }
                state.items.splice(99, 1)
            }
            state.items.splice(0, 0, payload);

            if (state.value > 99) {
                state.value = 100;
            } else {
                if (!payload.seen) {
                    state.value += 1;
                }
            }
        },

        chatSeenToTrue: (state, { payload }) => {
            state.items.map(item => {
                    if (item.group === payload) {
                        item.seen = true;
                    }
                }
            )
        },

        // incrementChat: (state) => {
        //     state.value = 0;
        //     state.items.map(item => {
        //         if (item.seen === false) {
        //             state.value += 1;
        //         };
        //     });
        // },

        decrementChat: (state, { payload }) => {
            state.value -= payload
        }

    }
})

export const { incrementItemChat, chatSeenToTrue, decrementChat } = itemChatSlice.actions

export default itemChatSlice.reducer;