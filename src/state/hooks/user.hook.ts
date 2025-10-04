import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  selectUser,
  selectToken,
  selectPreAuth,
  selectResetInfo,
  selectForgotInfo,
} from "../reducers/auth.reducer";
import { selectUserInfo } from "../reducers/user.reducer";

export const useAuth = () => {
  const user = useSelector(selectUser);
    const userInfo = useSelector(selectUserInfo);
  const token = useSelector(selectToken);
  const preAuth = useSelector(selectPreAuth);
  const resetInfo = useSelector(selectResetInfo);
  const forgotInfo = useSelector(selectForgotInfo);
  return useMemo(
    () => ({ user, token, preAuth, resetInfo,forgotInfo,userInfo }),
    [user, token, preAuth, resetInfo,userInfo, forgotInfo]
  );
};
