import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type UserState = {
  userType: any | null;

  userInfo:any,
//   token: any;
  resetInfo: any;
//   preAuth: any;
  profileImg: any;
  updatedInfo: any;
  isFollowing:boolean;
  defaultUserName: any;
};

const slice = createSlice({
  name: "usertype",
  initialState: {
    user: {},
    // token: {},
    resetInfo: {},
    updatedInfo: null,
    // preAuth: {},
    profileImg: {},
    isFollowing:false,
    defaultUserName: null,
  } as unknown as UserState,
  reducers: {
    // setCredentials: (state, { payload: { user, token } }) => {
    //   state.user = user;
    //   state.token = token;
    // },
    // setPreAuth: (state, { payload: { info } }) => {
    //   state.preAuth = { ...state.preAuth, ...info };
    // },
    setUserType: (state, { payload: { userType } }) => {
      state.userType = userType;
    },
    setIsFollowing:(state, {payload:{isFollowing}})=>{
state.isFollowing = isFollowing;
    },
    setUserInfo: (state, { payload: { userInfo } }) => {
      state.userInfo = userInfo;
    },
    setProfileImg: (state, { payload: { profileImg } }) => {
      state.profileImg = profileImg;
    },
    setUpdatedInfo: (state, { payload: { updatedInfo } }) => {
      state.updatedInfo =updatedInfo;
    },

    setResetInfo: (state, { payload: { resetInfo } }) => {
      state.resetInfo = resetInfo;
    },

    signOut: () => {},
  },
});

export const {
    setUserType,
    setUserInfo,
  // setCredentials,
  // setPreAuth,
  setProfileImg,
  // setUpdatedInfo,
  setResetInfo,
  signOut,
} = slice.actions;

export default slice.reducer;

export const selectUserType = (state: RootState) => state.userType.userType;
export const selectUserInfo = (state: RootState) => state.userType.userInfo;
// export const selectToken = (state: RootState) => state.userAuth.token;
export const selectResetInfo = (state: RootState) => state.userAuth.resetInfo;
// export const selectPreAuth = (state: RootState) => state.userAuth.preAuth;
export const selectProfileImg = (state: RootState) => state.userAuth.profileImg;
export const selectupdatedInfo = (state: RootState) =>
  state.userAuth.updatedInfo;
export const selectDefaultUserName = (state: RootState) =>
  state.userAuth.defaultUserName;
