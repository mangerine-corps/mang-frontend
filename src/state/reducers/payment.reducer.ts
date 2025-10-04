import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type PaymentState = {
  paymentType: any | null;

 transaction:any,
//   token: any;
  resetInfo: any;
//   preAuth: any;
  profileImg: any;
  updatedInfo: any;
  defaultUserName: any;
};

const slice = createSlice({
  name: "paymentType",
  initialState: {
    transaction: {},
    // token: {},
    resetInfo: {},
    updatedInfo: null,
    // preAuth: {},
    profileImg: {},
    defaultUserName: null,
  } as unknown as PaymentState,
  reducers: {
    // setCredentials: (state, { payload: { user, token } }) => {
    //   state.user = user;
    //   state.token = token;
    // },
    // setPreAuth: (state, { payload: { info } }) => {
    //   state.preAuth = { ...state.preAuth, ...info };
    // },
    setTransaction: (state, { payload: { transaction } }) => {
      state.transaction = transaction;
    },
    // setUserInfo: (state, { payload: { userInfo } }) => {
    //   state.userInfo = userInfo;
    // },

  },
});

export const {
    setTransaction,
  
} = slice.actions;

export default slice.reducer;

// export const selectUserType = (state: RootState) => state.transaction.userType;
export const selectUserInfo = (state: RootState) => state.userType.userInfo;
// export const selectToken = (state: RootState) => state.userAuth.token;

export const selectTransaction = (state: RootState) => state.payment.transaction;
// export const selectResetInfo = (state: RootState) => state.payment.resetInfo;