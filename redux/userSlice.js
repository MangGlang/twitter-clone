import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  username: null,
  name: null,
  email: null,
  uid: null,
  photoUrl: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // state, action ==> basically passing in arguments for redux
    setUser: (state, action) => {
        // payload = argument passed in; which is an object with the initialState properties above
        state.username = action.payload.username,
        state.name = action.payload.name,
        state.email = action.payload.email,
        // **uid** ==> store information about tweets, and etc; need uid to add or edit documents in firebase
        state.uid = action.payload.uid,
        state.photoUrl = action.payload.photoUrl
    },

    signOutUser: (state) => {
        state.username = null,
        state.name = null,
        state.email = null,
        // **uid** ==> store information about tweets, and etc; need uid to add or edit documents in firebase
        state.uid = null,
        state.photoUrl = null
    }
  },
});

export const {setUser, signOutUser} = userSlice.actions;

export default userSlice.reducer;
