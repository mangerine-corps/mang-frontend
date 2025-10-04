import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type BusinessUserState = {
  user: any | null;
  token: any;
  resetInfo: any;

  forgotInfo: any;
  preAuth: any;
  profileImg: any;
  updatedInfo: any;
  defaultUserName: any;
};

const slice = createSlice({
  name: "userauth",
  initialState: {
    user: null,
    token: {},
    forgotInfo:{},
    resetInfo: {},
    updatedInfo: null,
    preAuth: {},
    profileImg: {},
    defaultUserName: null,
  } as unknown as BusinessUserState,
  reducers: {
    setCredentials: (state, { payload: { user, token } }) => {
      state.user = user;
      state.token = token;
    },
    setForgotPassword: (state, { payload: { forgotInfo} }) => {
      state.forgotInfo = forgotInfo;

    },
    setPreAuth: (state, { payload: { info } }) => {
      state.preAuth = { ...state.preAuth, ...info };
    },
    setUpdatedInfo: (state, { payload: { updatedInfo } }) => {
      state.user = updatedInfo;
    },

    setProfileImg: (state, { payload: { profileImg } }) => {
      state.user = profileImg;
    },

    setResetInfo: (state, { payload: { resetInfo } }) => {
      state.resetInfo = resetInfo;
    },

    signOut: () => {},
  },
});

export const {
  setCredentials,
  setPreAuth,
  setProfileImg,
  setUpdatedInfo,
  setResetInfo,
  signOut,
  setForgotPassword
} = slice.actions;

export default slice.reducer;

export const selectUser = (state: RootState) => state.userAuth.user;
export const selectToken = (state: RootState) => state.userAuth.token;
export const selectResetInfo = (state: RootState) => state.userAuth.resetInfo;
export const selectPreAuth = (state: RootState) => state.userAuth.preAuth;
export const selectProfileImg = (state: RootState) => state.userAuth.profileImg;
export const selectupdatedInfo = (state: RootState) =>
  state.userAuth.updatedInfo;
export const selectDefaultUserName = (state: RootState) =>
  state.userAuth.defaultUserName;
export const selectForgotInfo = (state: RootState) =>
  state.userAuth.forgotInfo;
