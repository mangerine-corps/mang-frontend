import { Box, Button, Icon, Image, Text, VStack } from "@chakra-ui/react";
import CustomInput from "mangarine/components/customcomponents/Input";
import GuestLayout from "mangarine/layouts/GuestLayout";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { outfit } from "../_app";
import CustomButton from "mangarine/components/customcomponents/button";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useResetPasswordMutation } from "mangarine/state/services/auth.service";
import { useRouter } from "next/router";
import { isEmpty } from "es-toolkit/compat";
import { useAuth } from "mangarine/state/hooks/user.hook";
import Toast from "mangarine/components/ui-components/Error";
import { BiSolidError } from "react-icons/bi";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useColorMode } from "mangarine/components/ui/color-mode";

const resetPasswordSchema = Yup.object({
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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const ResetPassword = () => {
  const { forgotInfo } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { colorMode } = useColorMode();
  const [isClient, setIsClient] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetPassword, { }] = useResetPasswordMutation();
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async () => {
    const data = getValues();
    // console.log(data.email, "dsta")
    const formdata = {
      email: forgotInfo.email,
      password: data.password,
    };
    resetPassword(formdata)
      .unwrap()
      .then(() => {
        router.push("/auth/login");
      })
      .catch((error) => {
        console.log(error);
        const { data } = error;
        if (!isEmpty(data) && data.hasOwnProperty("message")) {
          setErrorMessage(data.message);
         
        } else {
          setErrorMessage(" failed");
        }
        setShowToast(true);
      });
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
              Reset Password
            </Text>
            <Text
              color="grey.500"
              fontWeight={"400"}
              fontSize={"1rem"}
              lineHeight={"2rem"}
            >
              Set a new password below
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
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="New Password"
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
                        color={ colorMode === "dark" ? "white" : "black"}
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
          <Controller
            name="confirmPassword"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="Confirm Password"
                placeholder="***"
                id="password"
                required={true}
                name="password"
                value={value}
                size="md"
                onChange={onChange}
                error={errors.confirmPassword}
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

          <CustomButton
            customStyle={{
              w: "full",
            }}
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
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default ResetPassword;
