import { Icon, Image, Link, Stack, Text, VStack } from "@chakra-ui/react";
import CustomInput from "mangarine/components/customcomponents/Input";
import GuestLayout from "mangarine/layouts/GuestLayout";
import { Controller, useForm } from "react-hook-form";
import { outfit } from "../_app";
import CustomButton from "mangarine/components/customcomponents/button";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import { useForgotPasswordMutation } from "mangarine/state/services/auth.service";
import { isEmpty } from "es-toolkit/compat";
import Toast from "mangarine/components/ui-components/Error";
import { useState } from "react";
import { BiSolidError } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { setForgotPassword } from "mangarine/state/reducers/auth.reducer";
import { useColorMode } from "mangarine/components/ui/color-mode";

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const ForgotPassword = () => {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const router = useRouter();
  const [forgotPassword, {isLoading}] = useForgotPasswordMutation();
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { colorMode } = useColorMode()
  //  const { preAuth } = useAuth();
  const dispatch = useDispatch()
  const onSubmit = async () => {
    const data = getValues();
    // console.log(data.email, "dsta")
    const formdata = {
      email: data.email,
    };
    forgotPassword(formdata)
      .unwrap()
      .then(() => {
        dispatch(setForgotPassword({ forgotInfo: formdata }))
        router.push("/auth/otp-verification");
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
          <VStack w="full" alignItems={"flex-start"}>
            <Text
              color="text_primary"
              fontWeight={"600"}
              fontSize={"1.5rem"}
              lineHeight={"2rem"}
            >
              Forgot Password!
            </Text>
            {showToast && (
              <Toast
                message={errorMessage}
                icon={BiSolidError}
                type="error"
                close={() => setShowToast(false)}
              />
            )}
            <Text
              color="grey.500"
              fontWeight={"400"}
              fontSize={"1rem"}
              lineHeight={"2rem"}
            >
              Input your email address below to receive your password reset
              instruction.
            </Text>
          </VStack>
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
                size="lg"
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

          <CustomButton
            customStyle={{
              w: "full",
            }}
            loading={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            <Text
              color={"button_text"}
              fontWeight={"600"}
              fontSize={"1rem"}
              lineHeight={"100%"}
            >
              Continue
            </Text>
          </CustomButton>

          <Link
            href="./login"
            color={"text_primary"}
            fontWeight={"600"}
            fontSize={"1rem"}
            lineHeight={"100%"}
          >
            Back
          </Link>
        </VStack>
      </VStack>
    </GuestLayout>
  );
};

export default ForgotPassword;
