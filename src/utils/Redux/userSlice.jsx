import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthenticated: false,
};


const userAuth = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setUserAuth(state) {
            state.isAuthenticated = true;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem('userrefreshToken');
            localStorage.removeItem('useraccessToken');
        },
    },
});

export const { setUserAuth , setUser, logout } = userAuth.actions;

export default userAuth.reducer;
