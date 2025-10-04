import {
  Box,
  Button,
  Field,
  HStack,
  Icon,
  Image,
  Link,
  Progress,
  Separator,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import CustomInput from "mangarine/components/customcomponents/Input";
import {
  useColorMode,
} from "mangarine/components/ui/color-mode";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import * as Yup from "yup";
import CustomButton from "mangarine/components/customcomponents/button";
import { Checkbox } from "mangarine/components/ui/checkbox";
import { outfit } from "mangarine/pages/_app";

import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { usePreSignupMutation, useGoogleAuthMutation } from "mangarine/state/services/auth.service";
import { useDispatch } from "react-redux";
import { setPreAuth, setCredentials } from "mangarine/state/reducers/auth.reducer";
import { FaUser } from "react-icons/fa";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { isEmpty } from "es-toolkit/compat";
import Toast from "mangarine/components/ui-components/Error";
import { BiSolidError } from "react-icons/bi";
import { useGoogleLogin } from "@react-oauth/google";


type onboardingData = {
  email: string,
  fullname: string,
  password: string,
  confirmPassword: string,
  isRemember:boolean,
}



const signinSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .matches(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces")
    .min(2, "Full name must be at least 2 characters"),
  email: Yup.string().required("Email is required").email('Eneter a valid email address'),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
   isRemember: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions"),
});

const OnboardingOne = () => {
  const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const { colorMode } = useColorMode();
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showToast, setShowToast] = useState<boolean>(false)
  const [isClient, setIsClient] = useState(false);
  const [handlePreAuth, { isLoading }] = usePreSignupMutation();
  const [handleGoogleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();

  const loginUser = useGoogleLogin({
    onSuccess: async (credentialResponse) => {
      try {
        console.log(credentialResponse, "credentialResponse");
        if (credentialResponse.access_token) {
          // Send access token to backend
          const response = await handleGoogleAuth({ access_token: credentialResponse.access_token }).unwrap();

          if (response.data) {
            const { user, token } = response.data;
            dispatch(setCredentials({ user, token }));

            // Redirect to dashboard after successful Google authentication
            router.push('/home');
          }
        }
      } catch (error: any) {
        console.error('Google auth error:', error);
        const errorMessage = error?.data?.message || 'Google authentication failed. Please try again.';
        setErrorMessage(errorMessage);
        setShowToast(true);
      }
    },
    onError: () => {
      setErrorMessage('Google authentication failed. Please try again.');
      setShowToast(true);
    },
    flow: "implicit",
    scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/user.birthday.read',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      isRemember:remember,
    },
  });

  const onSubmit = (data: onboardingData) => {
    console.log(data)
    handlePreAuth({ email: data.email })
      .unwrap()
      .then((payload) => {
        console.log(payload, "payload")
        dispatch(setPreAuth({ info: data }));
        router.push("./account-verification");
      })
      .catch((error) => {
        const { data } = error;
        if (!isEmpty(data) && data.hasOwnProperty("message")) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Registration failed");
        }
        setShowToast(true);
      });
  };

  const router = useRouter()
  return (
    <VStack w="full" h="full" flex={1}>
      <VStack
        className={outfit.className}
        justifyContent={"center"}
        w="full"
        flex={1}
        // overflowY={"auto"}
        css={{
          "&::-webkit-scrollbar": {
            width: "0px",

            height: "0px",
          },
          "&::-webkit-scrollbar-track": {
            width: "0px",
            background: "transparent",

            height: "0px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: "0px",
            maxHeight: "0px",
            height: "0px",
            width: 0,
          },
        }}
      >
        <VStack w={{ base: "full", md: "4/6" }} spaceY={2}>
          <Stack
            w="full"
            alignItems="center"
            justifyContent="flex-start"
            display={{ base: "flex", md: "flex", lg: "none" }}
            pb="12"
          >
            <Image
              boxSize={{ base: "64px", md: "64px" }}
              objectFit="contain"
              src={
                !isClient
                  ? "/images/logo.svg"
                  : colorMode === "dark"
                    ? "/images/logoDark.svg"
                    : "/images/logo.svg"
              }
              alt="logo"
            />
          </Stack>
          <VStack w="full" alignItems={"flex-start"}>
            <Progress.Root defaultValue={0} w="full">
              <HStack>
                <Progress.Track bg="mainBlack" rounded={"md"} flex="1">
                  <Progress.Range />
                </Progress.Track>
                <Progress.ValueText color="text_primary">0%</Progress.ValueText>
              </HStack>
            </Progress.Root>
            <Text
              color="text_primary"
              fontWeight={"600"}
              fontSize={"1.5rem"}
              lineHeight={"2rem"}
            >
              Sign Up
            </Text>
            <Text
              color="grey.500"
              fontWeight={"400"}
              fontSize={"1rem"}
              lineHeight={"2rem"}
            >
              Create your Mangerine account.
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

          <Controller
            name="fullName"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Full Name "
                placeholder="John Doe"
                id="FullName"
                required={true}
                name="fullname"
                value={value}
                size="md"
                onChange={onChange}
                error={errors.fullName}
                hasRightIcon={true}
                type={"text"}
                rightIcon={
                  <Icon mr={"4"}>
                    {colorMode === "dark" ? (
                      <Icon size={"md"} color={"white"}>
                        <FaUser />
                      </Icon>
                    ) : (
                      <Image src="/icons/UserIcon.svg" alt="mail-icon" />
                    )}
                  </Icon>
                }
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Email Address"
                placeholder="test@example.com"
                id="email"
                required={true}
                name="email"
                value={value}
                size="md"
                onChange={onChange}
                error={errors.email}
                hasRightIcon={true}
                type={"text"}
                rightIcon={
                  <Icon mr={"4"}>
                    {colorMode === "dark" ? (
                      <Image src="/icons/mailwhite.svg" alt="mail-icon" />
                    ) : (
                      <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                    )}
                  </Icon>
                }
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Password"
                placeholder="******"
                id="password"
                required={true}
                name="password"
                value={value}
                size="md"
                onChange={onChange}
                error={errors.password}
                hasRightIcon={true}
                type={showPassword ? "text" : "password"}
                rightIcon={
                  <Button
                    variant={"ghost"}
                    color={"#697586"}
                    bg="none"
                    p={0}
                    borderWidth={0}
                    _hover={{ bg: "transparent" }}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? (
                      <Icon
                        size={"lg"}
                        color={colorMode === "dark" ? "white" : "black"}
                        mr={"4"}
                      >
                        <IoIosEyeOff />
                      </Icon>
                    ) : (
                      <Icon
                        size={"lg"}
                        color={colorMode === "dark" ? "white" : "black"}
                        mr={"4"}
                      >
                        <IoIosEye />
                      </Icon>
                    )}
                  </Button>
                }
              />
            )}
          />
          <Text
            color="text_primary"
            fontWeight={"400"}
            fontSize={"0.75rem"}
            lineHeight={1}
          >
            Password must be at least 8 characters long and include at least one
            uppercase letter (A - Z).
          </Text>
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Confirm Password"
                placeholder="******"
                id="confirmPasswod"
                required={true}
                name="confirmPasswod"
                value={value}
                size="md"
                onChange={onChange}
                error={errors.confirmPassword}
                hasRightIcon={true}
                type={confirmPassword ? "text" : "password"}
                rightIcon={
                  <Button
                    variant={"ghost"}
                    color={"#697586"}
                    bg="none"
                    p={0}
                    borderWidth={0}
                    _hover={{ bg: "transparent" }}
                    onClick={() =>
                      setConfirmPassword((confirmPassword) => !confirmPassword)
                    }
                  >
                    {confirmPassword ? (
                      <Icon
                        size={"lg"}
                        color={colorMode === "dark" ? "white" : "black"}
                        mr={"4"}
                      >
                        <IoIosEyeOff />
                      </Icon>
                    ) : (
                      <Icon
                        size={"lg"}
                        color={colorMode === "dark" ? "white" : "black"}
                        mr={"4"}
                      >
                        <IoIosEye />
                      </Icon>
                    )}
                  </Button>
                }
              />
            )}
          />
          <HStack w="full" justifyContent={"space-between"}>
            <Controller
              name="isRemember"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Box>
                  <Checkbox
                    checked={value}
                    onChange={(e: any) => onChange(e.target.checked)}
                    variant="outline"
                    rounded="lg"
                  >
                    <Text
                      color="text_primary"
                      fontWeight="400"
                      fontSize="0.875rem"
                      lineHeight="100%"
                    >
                      I agree to the Terms & Conditions
                    </Text>
                  </Checkbox>
                  <Text
                    color="red.500"
                    fontWeight="400"
                    fontSize="0.875rem"
                    lineHeight="0"
                    py="2"
                  >
                    {errors.isRemember?.message}
                  </Text>
                </Box>
              )}
            />
          </HStack>
          <CustomButton
            customStyle={{
              w: "full",
            }}
            loading={isLoading}
            onClick={handleSubmit(onSubmit, (error) => console.log(error))}
          >
            <Text
              color={"button_text"}
              fontWeight={"600"}
              fontSize={"1rem"}
              lineHeight={"100%"}
            >
              Next
            </Text>
          </CustomButton>

          <HStack w="full">
            <Separator color={"grey.500"} size="md" flex="1" />
            <Text color={"grey.500"} flexShrink="0">
              OR
            </Text>
            <Separator color={"grey.500"} size="md" flex="1" />
          </HStack>

          {isGoogleLoading ? (
            <CustomButton
              customStyle={{
                _hover: { bg: "transparent" },
                borderWidth: 1,
                borderColor: "button_border",
                bg: "main_background",
                w: "full",
                color: "text_primary",
                cursor: "not-allowed",
                opacity: 0.7,
              }}
              disabled={true}
              onClick={() => {}} // Empty function for disabled state
            >
              <HStack gap={3} justify="center" align="center">
                <Box
                  w="20px"
                  h="20px"
                  border="2px solid"
                  borderColor="grey.300"
                  borderTopColor="primary.500"
                  borderRadius="full"
                  animation="spin 1s linear infinite"
                />
                <Text
                  color={"grey.500"}
                  fontWeight={"500"}
                  fontSize={"1rem"}
                  lineHeight={"100%"}
                >
                  Authenticating...
                </Text>
              </HStack>
            </CustomButton>
          ) : (
            <CustomButton
              customStyle={{
                _hover: {
                  bg: "transparent",
                },
                borderWidth: 1,
                borderColor: "button_border",
                bg: "main_background",
                w: "full",
                color: "text_primary",
              }}
              onClick={loginUser}
            >
              <HStack justify="center" align="center" w="full" gap={3}>
                <Image alt="google logo" src="/icons/google_logo_light.svg" />
                <Text
                  color={"grey.500"}
                  fontWeight={"500"}
                  fontSize={"1rem"}
                  lineHeight={"100%"}
                >
                  Continue with Google
                </Text>
              </HStack>
            </CustomButton>
          )}
          {/* <CustomButton
            customStyle={{
              _hover: {
                bg: "transparent",
              },
              borderWidth: 1,
              borderColor: "button_border",
              bg: "main_background",
              w: "full",
            }}
            onClick={handleSubmit(onSubmit)}
          >
            <HStack>
              {colorMode === "dark" ? (
                <Image alt="apple logo" src={"/icons/apple_logo_dark.svg"} />
              ) : (
                <Image alt="apple logo" src="/icons/apple_logo_light.svg" />
              )}
              <Text
                color={"grey.500"}
                fontWeight={"500"}
                fontSize={"1rem"}
                lineHeight={"100%"}
              >
                Login with Apple
              </Text>
            </HStack>
          </CustomButton> */}
          <HStack w="full" justifyContent={"flex-start"}>
            <Text
              color={"text_primary"}
              fontWeight={"500"}
              fontSize={"1rem"}
              lineHeight={"100%"}
            >
              Already have and Account?{" "}
            </Text>

            <Link
              color="primary.500"
              fontWeight={"700"}
              fontSize={"0.875rem"}
              lineHeight={"100%"}
              href="/auth/login"
            >
              Login
            </Link>
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
};

export default OnboardingOne;
