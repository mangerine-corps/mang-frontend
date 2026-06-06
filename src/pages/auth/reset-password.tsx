import { Box, Button, Icon, Text, VStack } from "@chakra-ui/react";
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
  otpCode: Yup.string().required("OTP is required").length(6, "OTP must be 6 digits"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const ResetPassword = () => {
  const { forgotInfo } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { colorMode } = useColorMode();
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: { otpCode: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async () => {
    const data = getValues();
    resetPassword({
      email: forgotInfo?.email ?? "",
      otpCode: data.otpCode,
      newPassword: data.password,
    })
      .unwrap()
      .then(() => {
        router.push("/auth/login");
      })
      .catch((error) => {
        const { data } = error;
        if (!isEmpty(data) && data.hasOwnProperty("message")) {
          setErrorMessage(data.message);
        } else {
          setErrorMessage("Reset failed");
        }
        setShowToast(true);
      });
  };

  const eyeIcon = (
    <Button
      variant="ghost"
      color="#697586"
      bg="none"
      p={0}
      borderWidth={0}
      _hover={{ bg: "transparent" }}
      onClick={() => setShowPassword((v) => !v)}
    >
      <Icon size="lg" color={colorMode === "dark" ? "white" : "black"} mr="4">
        {showPassword ? <IoIosEyeOff /> : <IoIosEye />}
      </Icon>
    </Button>
  );

  return (
    <GuestLayout>
      <VStack className={outfit.className} justifyContent="center" w="full" flex={1}>
        <VStack w={{ base: "full", md: "4/6" }} spaceY={4}>
          <VStack w="full" alignItems="center">
            <Text color="text_primary" fontWeight="600" fontSize="1.5rem" lineHeight="2rem">
              Reset Password
            </Text>
            <Text color="grey.500" fontWeight="400" fontSize="1rem" lineHeight="2rem">
              Enter the OTP sent to your email and set a new password.
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
            name="otpCode"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="OTP Code"
                placeholder="Enter 6-digit code"
                id="otpCode"
                required
                name="otpCode"
                value={value}
                size="md"
                onChange={onChange}
                error={errors.otpCode}
                hasRightIcon={false}
                type="text"
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
              <CustomInput
                label="New Password"
                placeholder="***"
                id="password"
                required
                name="password"
                value={value}
                size="md"
                onChange={onChange}
                error={errors.password}
                hasRightIcon
                type={showPassword ? "text" : "password"}
                rightIcon={eyeIcon}
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
                id="confirmPassword"
                required
                name="confirmPassword"
                value={value}
                size="md"
                onChange={onChange}
                error={errors.confirmPassword}
                hasRightIcon
                type={showPassword ? "text" : "password"}
                rightIcon={eyeIcon}
              />
            )}
          />

          <CustomButton
            customStyle={{ w: "full" }}
            loading={isLoading}
            onClick={handleSubmit(onSubmit, (e) => console.log(e))}
          >
            <Text color="button_text" fontWeight="600" fontSize="1rem" lineHeight="100%">
              Reset Password
            </Text>
          </CustomButton>
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default ResetPassword;
