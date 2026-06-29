import {
  Box,
  HStack,
  Input,
  Link,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import GuestLayout from "mangarine/layouts/GuestLayout";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomButton from "mangarine/components/customcomponents/button";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { outfit } from "mangarine/pages/_app";
import { useRouter } from "next/router";
import { useAuth } from "mangarine/state/hooks/user.hook";
import Toast from "mangarine/components/ui-components/Error";
import { BiSolidError } from "react-icons/bi";
import {
  useSendEmailOtpMutation,
  useVerifyTwoFAMutation,
  useVerifyEmailMutation,
  useLoginMutation,
} from "mangarine/state/services/auth.service";
import { toaster } from "mangarine/components/ui/toaster";
import { isEmpty, size } from "es-toolkit/compat";

import { useCountdown } from "usehooks-ts";

import OTPInput from "react-otp-input";
import { useDispatch } from "react-redux";
import { setCredentials, setPreAuth } from "mangarine/state/reducers/auth.reducer";

const schema = Yup.object().shape({
  otp: Yup.string()
    .required("Required")
    .length(6, "OTP must be 6 digits"),
});

const AccountVerification = () => {
  const { forgotInfo, preAuth } = useAuth();
  const emailEnabled = process.env.NEXT_PUBLIC_EMAIL_ENABLED !== "false";
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sendOtp] = useSendEmailOtpMutation();
  const [login, { isLoading: isResending }] = useLoginMutation();
  const [verifyEmail, { isLoading: verifying }] = useVerifyEmailMutation();
  const [verifyTwoFA, { isLoading: verifyingTwoFA }] = useVerifyTwoFAMutation();
  const [visible, setVisible] = useState(true);
  const dispatch = useDispatch();

  const [intervalValue] = useState<number>(1000);
  const [count, { startCountdown, resetCountdown }] =
    useCountdown({
      countStart: 120,
      intervalMs: intervalValue,
    });
  const { handleSubmit, control, getValues } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      otp: "",
    },
  });

  // const otp = watch("otp");
  const router = useRouter();
  const isLoginTwoFAFlow =
    router.query.flow === "login-2fa" || preAuth?.flow === "login-2fa";
  const challengeToken = preAuth?.challengeToken;
  const verificationMethod = preAuth?.method;
  const loginIdentity = preAuth?.email;

  const has2FACredentials =
    typeof window !== "undefined" &&
    !!sessionStorage.getItem("_2fa_pending");
  const canResend = isLoginTwoFAFlow ? has2FACredentials : emailEnabled;

  const onSubmit = async () => {
    const data = getValues();

    if (isLoginTwoFAFlow) {
      verifyTwoFA({
        challengeToken,
        otp: data.otp,
      })
        .unwrap()
        .then((payload) => {
          const responseData = payload?.data ?? payload;
          const { user, token } = responseData;
          sessionStorage.removeItem("_2fa_pending");
          dispatch(setCredentials({ user, token }));
          dispatch(setPreAuth({ info: {} }));
          router.push("/home");
        })
        .catch((error) => {
          const { data } = error;
          if (!isEmpty(data) && data.hasOwnProperty("message")) {
            setErrorMessage(data.message);
          } else {
            setErrorMessage("2FA verification failed");
          }
          setShowToast(true);
        });
      return;
    }

    if (!emailEnabled) {
      router.push("/auth/reset-password");
      return;
    }
    const formdata = {
      email: forgotInfo.email,
      otpCode: data.otp,
    };
    verifyEmail(formdata)
      .unwrap()
      .then(() => {
        router.push("/auth/reset-password");
      })
      .catch((error) => {
        console.log(error);
        const { data } = error;
        if (!isEmpty(data) && data.hasOwnProperty("message")) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("otp verification failed");
        }
        setShowToast(true);
      });
  };

  // Start countdown on mount
  useEffect(() => {
    if (!canResend) return;
    startCountdown();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!canResend) return;
    if (count === 0) setVisible(false);
  }, [count, canResend]);

  // If emails disabled, skip page entirely
  useEffect(() => {
    if (!isLoginTwoFAFlow && !emailEnabled) {
      router.replace("/auth/reset-password");
    }
    if (isLoginTwoFAFlow && !challengeToken) {
      router.replace("/auth/login");
    }
  }, [challengeToken, emailEnabled, isLoginTwoFAFlow, router]);

  const resendOtp = async () => {
    if (!canResend) return;

    if (isLoginTwoFAFlow) {
      const raw = sessionStorage.getItem("_2fa_pending");
      if (!raw) return;
      const { username, password } = JSON.parse(raw);
      await login({ username, password })
        .unwrap()
        .then((payload) => {
          const responseData = payload?.data ?? payload;
          if (responseData?.challengeToken) {
            dispatch(setPreAuth({ info: { challengeToken: responseData.challengeToken } }));
          }
          setVisible(true);
          resetCountdown();
          startCountdown();
          toaster.create({
            title: "Code Resent",
            description: "A new verification code has been sent.",
            type: "success",
            duration: 9000,
            closable: true,
          });
        })
        .catch((error) => {
          const msg = error?.data?.message ?? "Failed to resend code. Please try again.";
          toaster.create({ title: "Error", description: msg, type: "error", duration: 9000, closable: true });
        });
      return;
    }

    await sendOtp({ email: forgotInfo.email })
      .unwrap()
      .then(() => {
        setVisible(true);
        resetCountdown();
        startCountdown();
        toaster.create({
          title: "OTP Sent Successfully",
          description: `OTP code has been sent to ${forgotInfo.email}`,
          type: "success",
          duration: 9000,
          closable: true,
        });
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        toaster.create({ title: "Error", description: errorMessage, type: "error", duration: 9000, closable: true });
      });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  return (
    <GuestLayout>
      <VStack
        className={outfit.className}
        justifyContent={"center"}
        w="full"
        flex={1}
      >
        <VStack w={{ base: "full", md: "4/6" }} spaceY={4}>
          <VStack w="full" alignItems={"center"}>
            <Text
              color="text_primary"
              fontWeight={"600"}
              fontSize={"1.5rem"}
              lineHeight={"2rem"}
            >
              {isLoginTwoFAFlow ? "Two-Factor Verification" : "Email Verification"}
            </Text>
            <Text
              color="grey.500"
              fontWeight={"400"}
              fontSize={"1rem"}
              lineHeight={"2rem"}
              textAlign={"center"}
            >
              {isLoginTwoFAFlow
                ? `Input the code sent via ${verificationMethod ?? "your selected method"}${loginIdentity ? ` for ${loginIdentity}` : ""} to complete login`
                : `Input the code sent to ${forgotInfo.email} to verify your email`}
            </Text>
          </VStack>
          <Box w="full">
            {showToast && (
              <Toast
                message={errorMessage}
                icon={BiSolidError}
                type="error"
                close={() => setShowToast(false)}
              />
            )}
          </Box>

          <Stack gap="4" align="flex-start" maxW="sm">
            <HStack spaceX={3} justify="center">
              <Controller
                name={"otp"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <OTPInput
                    value={value}
                    onChange={(value) => {
                      const input = value.replace(/[^0-9/]/g, "");
                      onChange(input);
                    }}
                    numInputs={6}
                    inputType="number"
                    // renderSeparator={<span> </span>}
                    placeholder={"000000"}
                    renderInput={(props, index) => (
                      <>
                        {/* {size(otp)} */}
                        <Input
                          bg="bg_box"
                          borderWidth={1}
                          borderRadius={"10px"}
                          fontSize={{ base: "16px", lg: "30px" }}
                          fontWeight={"600"}
                          minH={{ base: "50px", lg: "60px" }}
                          minW={{ base: "50px", lg: "60px" }}
                          // cursor={'none'}
                          // _hover={{
                          //   color: "transparent",
                          // }}
                          css={{
                            "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                              {
                                WebkitAppearance: "none",
                                margin: 0,
                              },
                            "&[type=number]": {
                              MozAppearance: "textfield",
                            },
                          }}
                          borderColor={
                            size(value) > index ? "primary.200" : "black"
                          }
                          focusRingColor="primary.200"
                          {...props}
                        />
                      </>
                    )}
                    // renderInput={(props) => <input {...props} />}
                    renderSeparator={<span style={{ width: "6px" }}></span>}
                    containerStyle={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    shouldAutoFocus={true}
                    // inputStyle={{

                    //   width: "70px",
                    //   height: "70px",

                    //   caretColor: "red",
                    // }}
                  />
                )}
              />
            </HStack>
            {/* <FormErrorMessage>
          {errors.otp?.message}
        </FormErrorMessage> */}

            <VStack w="full" alignItems="center" gap={2}>
              {canResend && visible ? (
                <HStack gap={2}>
                  <Text
                    color={count > 60 ? "green.500" : count > 30 ? "orange.400" : "red.500"}
                    fontWeight="600"
                    fontSize="0.875rem"
                  >
                    Code expires in {formatTime(count)}
                  </Text>
                </HStack>
              ) : canResend ? (
                <HStack gap={1}>
                  <Text color="red.500" fontWeight="500" fontSize="0.875rem">
                    Code expired.
                  </Text>
                  <Link
                    textDecor="underline"
                    color="text_primary"
                    fontWeight="600"
                    fontSize="0.875rem"
                    onClick={resendOtp}
                  >
                    Resend code
                  </Link>
                </HStack>
              ) : null}
            </VStack>

            <CustomButton
              customStyle={{
                w: "full",
              }}
              loading={isLoginTwoFAFlow ? verifyingTwoFA : verifying}
              onClick={handleSubmit(onSubmit, (error) => console.log(error))}
            >
              <Text
                color={"button_text"}
                fontWeight={"600"}
                fontSize={"1rem"}
                lineHeight={"100%"}
              >
                {isLoginTwoFAFlow ? "Complete Login" : "Verify"}
              </Text>
            </CustomButton>
          </Stack>
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default AccountVerification;
