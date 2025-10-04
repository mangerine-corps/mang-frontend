import {
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Link,
  Separator,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import CustomInput from "mangarine/components/customcomponents/Input";
import { useColorMode } from "mangarine/components/ui/color-mode";
import GuestLayout from "mangarine/layouts/GuestLayout";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { outfit } from "../_app";
import CustomButton from "mangarine/components/customcomponents/button";
import { Checkbox } from "mangarine/components/ui/checkbox";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { setCredentials } from "mangarine/state/reducers/auth.reducer";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useLoginMutation, useGoogleAuthMutation } from "mangarine/state/services/auth.service";
import { isEmpty } from "es-toolkit/compat";
import Toast from "mangarine/components/ui-components/Error";
import { BiSolidError } from "react-icons/bi";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { toaster } from "mangarine/components/ui/toaster";



const loginSchema = Yup.object().shape({
  username: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .matches(/[0-9]/, "Password must contain at least one number")
  // .matches(
  //   /[^a-zA-Z0-9]/,
  //   "Password must contain at least one special character"
  // ),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { colorMode } = useColorMode();
  const [isClient, setIsClient] = useState(false);
  const [handleLogin, { isLoading }] = useLoginMutation();
  const [handleGoogleAuth, { isLoading: isGoogleLoading }] = useGoogleAuthMutation();

  useEffect(() => {
    setIsClient(true);

    // Initialize Google OAuth when component mounts
    const initializeGoogleOAuth = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        if (!clientId) {
          console.error('Google Client ID is not configured');
          return;
        }

        try {
          (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: handleSuccess,
          });
          console.log('Google OAuth initialized successfully');
        } catch (error) {
          console.error('Failed to initialize Google OAuth:', error);
        }
      }
    };

    // Try to initialize immediately if Google is already loaded
    initializeGoogleOAuth();

    // If Google is not loaded yet, wait for it
    if (typeof window !== 'undefined' && !(window as any).google) {
      const checkGoogleLoaded = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          clearInterval(checkGoogleLoaded);
          initializeGoogleOAuth();
        }
      }, 100);

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkGoogleLoaded), 10000);
    }
  }, []);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const onSubmit = (data: any) => {
    // console.log(data);
    handleLogin(data)
      .unwrap()
      .then((payload) => {
        const { data } = payload;
        // console.log(data, "payload");
        const { user, token } = data;
        dispatch(setCredentials({ user, token }));
        toaster.create({
          type:"success",
          title:"Success",
          description:"Login Successful",
          closable:true
        })
      })
      .catch((error) => {
        // console.log(error);
        const { data } = error;
        if (!isEmpty(data) && data.hasOwnProperty("message")) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Login failed!! please try again");
        }
        setShowToast(true);
      });
  };

const redirectToApple = () => {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
    redirect_uri: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI!,
    response_type: "code",
    scope: "name email",
    response_mode: "query",
  });

  window.location.href = `https://appleid.apple.com/auth/authorize?${params.toString()}`;
};

const handleSuccess = async (credentialResponse: any) => {
  console.log(credentialResponse, "credentialResponse");
  if (credentialResponse.access_token) {
    try {
      // Send the credential to our backend using the service
      console.log(credentialResponse, "credentialResponse");
      const response = await handleGoogleAuth({ access_token: credentialResponse.access_token }).unwrap();

      if (response.data) {
        const { user, token } = response.data;
        dispatch(setCredentials({ user, token }));

        // Redirect to dashboard after successful Google login
        router.push('/home');
      }
    } catch (error: any) {
      console.error('Google authentication error:', error);
      const errorMessage = error?.data?.message || 'Google authentication failed. Please try again.';
      setErrorMessage(errorMessage);
      setShowToast(true);
    }
  }
};
const loginUser = useGoogleLogin({
  onSuccess: handleSuccess,
  flow: "implicit",
  scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/user.birthday.read',
});


  const handleError = () => {
    console.log("Google Login Failed");
  };
//   useEffect(() => {
//   fetch("/api/auth/me") // checks cookie
//     .then((res) => {
//       if (!res.ok) throw new Error("Failed to fetch user");
//       return res.json();
//     })
//     .then((data) => {
//       dispatch(setCredentials({ user: data.user, token: data.token }));
//     })
//     .catch((err) => {
//       console.error("Auth bootstrap failed:", err);
//       // Optionally dispatch signOut() or leave Redux as is
//     });
// }, [dispatch]);
  // const handleCheckLinkPress = () => {
  //   setRemember(!remember);
  // };

  return (
    <GuestLayout>
      <VStack
        className={outfit.className}
        justifyContent={"center"}
        w="full"
        flex={1}
      >
        <VStack w={{ base: "full", md: "4/6" }} spaceY={1}>
          <Stack w="full" alignItems="center" justifyContent="flex-start"  display={{base:"flex", md:"flex", lg:"none"}} pb="12">
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
            <Text
              color="text_primary"
              fontWeight={"600"}
              fontSize={"1.5rem"}
              lineHeight={"2rem"}
            >
              Welcome Back!
            </Text>
            <Text
              color="grey.500"
              fontWeight={"400"}
              fontSize={"1rem"}
              lineHeight={"2rem"}
            >
              Login to your account to continue
            </Text>
          </VStack>
          {showToast && (
            <Toast
              message={errorMessage}
              icon={BiSolidError}
              type="error"
              close={() => setShowToast(false)}
            />
          )}
          <Controller
            name="username"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Email Address"
                placeholder="test@example.com"
                id="email"
                required={true}
                name="email"
                value={value}
                size="lg"
                onChange={onChange}
                error={errors.username}
                hasRightIcon={true}
                type={"text"}
                rightIcon={
                  <Icon mr={"4"}>
                    {!isClient ? (
                      <Image src="/icons/mailwhite.svg" alt="mail-icon" />
                    ) : colorMode === "dark" ? (
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
                placeholder="***"
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
                        color={
                          !isClient
                            ? "black"
                            : colorMode === "dark"
                              ? "white"
                              : "black"
                        }
                        mr={"4"}
                      >
                        <IoIosEyeOff />
                      </Icon>
                    ) : (
                      <Icon
                        size={"lg"}
                        color={
                          !isClient
                            ? "black"
                            : colorMode === "dark"
                              ? "white"
                              : "black"
                        }
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
            <Checkbox
              checked={remember}
              variant="outline"
              rounded="lg"
              onCheckedChange={(e: any) => setRemember(!!e.checked)}
            >
              <Text
                color="text_primary"
                fontWeight={"400"}
                fontSize={"0.875rem"}
                lineHeight={"100%"}
              >
                Remember me
              </Text>
            </Checkbox>
            <Link
              color="text_primary"
              fontWeight={"400"}
              fontSize={"0.875rem"}
              lineHeight={"100%"}
              href="/auth/forgot-password"
            >
              Forgot Password?
            </Link>
          </HStack>
          <CustomButton
            customStyle={{
              w: "full",
              color: "button_text",
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
              Login
            </Text>
          </CustomButton>

          <HStack w="full">
            <Separator color={"grey.500"} size="md" flex="1" />
            <Text color={"grey.500"} flexShrink="0">
              OR
            </Text>
            <Separator color={"grey.500"} size="md" flex="1" />
          </HStack>

          {/* <CustomButton
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
            onClick={()=>{}}
          >
            <HStack>
              <Image alt="google logo" src="/icons/google_logo_light.svg" />
              <Text
                color={"grey.500"}
                fontWeight={"500"}
                fontSize={"1rem"}
                lineHeight={"100%"}
              >
                Login with Google
              </Text>

            </HStack>
          </CustomButton> */}
          <Box w="full">
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
                    Login with Google
                  </Text>
                </HStack>
              </CustomButton>
            )}
          </Box>
          {/*
          <CustomButton
            customStyle={{
              _hover: {
                bg: "transparent",
              },
              borderWidth: 1,
              borderColor: "button_border",
              bg: "main_background",
              w: "full",
            }}
            onClick={redirectToApple}
          >
            <HStack>
              {!isClient ? (
                <Image alt="apple logo" src="/icons/apple_logo_light.svg" />
              ) : colorMode === "dark" ? (
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
          {/* </CustomButton>  */}
          <HStack w="full" justifyContent={"flex-start"}>
            <Text
              color={"text_primary"}
              fontWeight={"500"}
              fontSize={"1rem"}
              lineHeight={"100%"}
            >
              {"Don't have and Account?"}
            </Text>

            <Link
              color="primary.500"
              fontWeight={"700"}
              fontSize={"0.875rem"}
              lineHeight={"100%"}
              href="/auth/onboarding/register"
            >
              Sign Up
            </Link>
          </HStack>
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default Login;
