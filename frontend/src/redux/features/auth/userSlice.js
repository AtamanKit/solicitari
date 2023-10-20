import { createSlice } from '@reduxjs/toolkit';


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        item: "",
    },

    reducers: {
        addUser: (state, { payload }) => {
            state.item = payload
        },

        removeUser: (state) => {
            state.item = ""
        }
    }
})

export const { addUser, removeUser } = userSlice.actions

export default userSlice.reducer