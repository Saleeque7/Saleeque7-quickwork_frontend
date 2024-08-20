import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    client: null,
    isClientAuthenticated: false,
};

const clientAuth = createSlice ({
    name:"client",
    initialState , 
    reducers:{
        setClient(state,action){
            state.client =action.payload;
        },
        setClientAuth(state){
            state.isClientAuthenticated = true;
        },
        logoutClient(state) {
            state.client = null;
            state.isClientAuthenticated = false;
            localStorage.removeItem('clientrefreshToken');
            localStorage.removeItem('clientaccessToken');
            

        },

    }
})

export const { setClient ,setClientAuth , logoutClient} = clientAuth.actions
export default clientAuth.reducer

