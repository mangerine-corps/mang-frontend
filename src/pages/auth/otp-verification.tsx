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
  useVerifyEmailMutation,
} from "mangarine/state/services/auth.service";
import { toaster } from "mangarine/components/ui/toaster";
import { isEmpty, size } from "es-toolkit/compat";

import { useCountdown } from "usehooks-ts";

import OTPInput from "react-otp-input";

const schema = Yup.object().shape({
  otp: Yup.string()
    .required("Required")
    .length(6, "OTP must be 6 digits"),
});

const AccountVerification = () => {
  const { forgotInfo } = useAuth();
  const emailEnabled = process.env.NEXT_PUBLIC_EMAIL_ENABLED !== "false";
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sendOtp] = useSendEmailOtpMutation();
  const [verifyEmail, { isLoading: verifying }] = useVerifyEmailMutation();
  const [visible, setVisible] = useState(false);

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
  const onSubmit = async () => {
    if (!emailEnabled) {
      router.push("/auth/reset-password");
      return;
    }
    const data = getValues();
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

  useEffect(() => {
    if (!emailEnabled) return; // countdown only if enabled
      if(count === 0){
        setVisible(false);
      }
  }, [count]);

  // If emails disabled, skip page entirely
  useEffect(() => {
    if (!emailEnabled) {
      router.replace("/auth/reset-password");
    }
  }, [emailEnabled]);

  const resendOtp = async () => {
    if (!emailEnabled) return;
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
        toaster.create({
          title: "Error",
          description: errorMessage,
          type: "error",
          duration: 9000,
          closable: true,
        });
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
              Email Verification
            </Text>
            <Text
              color="grey.500"
              fontWeight={"400"}
              fontSize={"1rem"}
              lineHeight={"2rem"}
              textAlign={"center"}
            >
              Input the code sent to {forgotInfo.email} to verify your email
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
                          bg="white"
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

            <VStack
              w="full"
              alignItems="center"
              spaceY={4}
              justifyItems={"center"}
            >
              <HStack>
                <Text
                  color={"text_primary"}
                  fontWeight={"600"}
                  fontSize={"1rem"}
                  lineHeight={"100%"}
                >
                  {" Didn't receive a code?"}
                </Text>
                {visible ? (
                  <Text display={"inline"} color={"text_primary"}>
                    {" "}
                    {formatTime(count)}
                  </Text>
                ) : (
                  <span>
                    <Link
                      textDecor={"underline"}
                      color="text_primary"
                      fontWeight="70%"
                      onClick={resendOtp}
                    >
                      {" "}
                      Resend
                    </Link>
                  </span>
                )}
              </HStack>
            </VStack>

            <CustomButton
              customStyle={{
                w: "full",
              }}
              loading={verifying}
              onClick={handleSubmit(onSubmit, (error) => console.log(error))}
            >
              <Text
                color={"button_text"}
                fontWeight={"600"}
                fontSize={"1rem"}
                lineHeight={"100%"}
              >
                Verify
              </Text>
            </CustomButton>
          </Stack>
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default AccountVerification;
