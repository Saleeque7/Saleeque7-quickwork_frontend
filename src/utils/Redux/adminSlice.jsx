import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    admin: null,
    isadminAuthenticated: false,
}

const adminAuth = createSlice({
    name:"admin",
    initialState,
    reducers: {
        setAdmin(state, action) {
            state.admin = action.payload;
        },
        setAdminAuth(state) {
            state.isadminAuthenticated = true;
        },
        logoutAdmin(state) {
            state.admin = null;
            state.isadminAuthenticated = false;
            localStorage.removeItem('adminrefreshToken');
            localStorage.removeItem('adminaccessToken');
        },
    },
})

export const {setAdmin , setAdminAuth , logoutAdmin} = adminAuth.actions;
export default adminAuth.reducer;

