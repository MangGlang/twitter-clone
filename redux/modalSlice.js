// rxslice --> redux boiler plate
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signUpModalOpen: false,
  loginModalOpen: false,
  commentModalOpen: false,

  commentTweetDetails: {
    // Upon clicking comment, update state with information of current tweet clicked
    id: null,
    tweet: null,
    photoUrl: null,
    name: null,
    username: null,
  },
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    // actions
    openSignUpModal: (state) => {
      state.signUpModalOpen = true;
    },
    closeSignUpModal: (state) => {
      state.signUpModalOpen = false;
    },
    openLoginModal: (state) => {
      state.loginModalOpen = true;
    },
    closeLoginModal: (state) => {
      state.loginModalOpen = false;
    },
    openCommentModal: (state) => {
      state.commentModalOpen = true;
    },
    closeCommentModal: (state) => {
      state.commentModalOpen = false;
    },

    setCommentTweet: (state, action) => {
      // payload = argument passed in; which is an object with the initialState properties above
      (state.commentTweetDetails.username = action.payload.username),
        (state.commentTweetDetails.name = action.payload.name),
        // **uid** ==> store information about tweets, and etc; need uid to add or edit documents in firebase
        (state.commentTweetDetails.id = action.payload.id),
        (state.commentTweetDetails.photoUrl = action.payload.photoUrl);
      state.commentTweetDetails.tweet = action.payload.tweet;
    },
  },
});

export const {
  openSignUpModal,
  closeSignUpModal,
  openLoginModal,
  closeLoginModal,
  openCommentModal,
  closeCommentModal,
  setCommentTweet,
} = modalSlice.actions;

export default modalSlice.reducer;
