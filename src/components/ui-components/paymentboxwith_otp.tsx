
import { Box, Text, Flex,  RadioGroup, Input, HStack, Image } from "@chakra-ui/react";

// import OtpInput from "../../otpinput";

import OTPInput from "react-otp-input";
import { size } from "es-toolkit/compat";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "../customcomponents/button";
import { useState } from "react";

const schema = Yup.object().shape({
  otp: Yup.string().required("Required").length(6, "OTP must be 6 digits"),
});
const PaymentOtpBox = () => {
    const { control } = useForm({
      resolver: yupResolver(schema),
      defaultValues: {
        otp: "",
      },
    });
  const [value, setValue] = useState<string | null>(null);
    const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const back = "/images/go-back.png";
  return (
    <>
      <Flex alignItems="center" gap="12px" mb="24px">
        <Image src={back} alt="Go back" />

        <Text fontSize={"lg"} fontWeight="bold" color={"text_primary"}>
          Payment
        </Text>
      </Flex>
      {/* payment information box */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gap="16px"
        padding="16px"
        borderRadius="8px"
        background="bg_box"
        boxShadow="bg_box"
        width="100%"
      >
        <Text fontSize="lg" fontWeight="bold" color={"text_primary"}>
          Payment Information
        </Text>

        <Flex flexDirection="column" gap="8px" width="100%">
          {[
            "Consultation Fee",
            "Manager Fee",
            "Recording Fee",
            "Total Fee",
          ].map((item, index) => (
            <Flex key={index} justify="space-between" width="100%">
              <Text fontSize="14px" color={"text_primary"}>
                {item}
              </Text>
              <Text
                fontWeight={item === "Total Fee" ? "bold" : "normal"}
                fontSize="0.875rem"
                color={"text_primary"}
              >
                {item === "Consultation Fee"
                  ? "$50.00"
                  : item === "Manager Fee"
                    ? "$10.00"
                    : item === "Recording Fee"
                      ? "$5.00"
                      : "$65.00"}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>

      {/* payment label and form */}
      {isSuccessful ? (
        <Box
          mt={6}
          display="flex"
          flexDirection="column"
          gap="16px"
          padding="16px"
          width="100%"
          bg="bg_box"
        >
          <Text fontWeight={"bold"} color={"text_primary"}>
            Consultation Booking Successful!
          </Text>
        </Box>
      ) : (
        <Box
          mt={6}
          display="flex"
          flexDirection="column"
          gap="16px"
          padding="16px"
          width="100%"
          bg="bg_box"
        >
          <Text fontWeight={"bold"} color={"text_primary"}>
            Pay with
          </Text>
          <Text color={"grey.300"} fontSize={"0.875rem"}>
            Your consultation booking with Sharon Grace was successful
          </Text>
          <CustomButton
            customStyle={{
              w: "full",
            }}
            onClick={() => {
              setIsSuccessful(true);
            }}
            //   loading={isLoading}
            //   onClick={handleSubmit(onSubmit, (error) => console.log(error))}
          >
            <Text
              color={"button_text"}
              fontWeight={"600"}
              fontSize={"1rem"}
              lineHeight={"100%"}
            >
              Done
            </Text>
          </CustomButton>
          <Text color={"text_primary"} fontSize={"0.875rem"}>
            An email has been sent to graceshawn@gmail.com. Please check your
            inbox for the consultation details. We look forward to assisting
            you!
          </Text>
          <RadioGroup.Root
            value={value}
            onValueChange={(e) => setValue(e.value)}
          >
            <HStack gap="6">
              {[
                { id: 1, label: "Card (Powered by Stripe)" },
                { id: 2, label: "paypal" },
              ].map((item) => (
                <RadioGroup.Item key={item.id} value={item.label}>
                  <RadioGroup.ItemHiddenInput />
                  <RadioGroup.ItemIndicator />
                  <RadioGroup.ItemText color={"text_primary"}>
                    {item.label}
                  </RadioGroup.ItemText>
                </RadioGroup.Item>
              ))}
            </HStack>
          </RadioGroup.Root>

          <Flex
            flexDirection="column"
            alignItems="flex-start"
            justifyContent="flex-start"
            height="auto"
            gap="20px"
            width="100%"
          >
            <Text color={"text_primary"} fontSize={"0.875rem"}>
              Enter your 4-digit card pin to confirm this payment
            </Text>
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
                    numInputs={4}
                    inputType="number"
                    // renderSeparator={<span> </span>}
                    placeholder={"000000"}
                    renderInput={(props, index) => (
                      <>
                        {/* {size(otp)} */}
                        <Input
                          bg="main_background"
                          // color="text_primary"
                          borderWidth={1}
                          borderRadius={"6px"}
                          fontSize={{ base: "12px", lg: "14px" }}
                          fontWeight={"500"}
                          // minH={{ base: "50px", lg: "60px" }}
                          // minW={{ base: "50px", lg: "60px" }}
                          color={"text_primary"}
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
                          // color={"black"}
                          borderColor={size(value) > index ? "black" : "black"}
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
          </Flex>

          <CustomButton
            customStyle={{
              w: "full",
            }}
            onClick={() => {
              setIsSuccessful(true);
            }}
            //   loading={isLoading}
            //   onClick={handleSubmit(onSubmit, (error) => console.log(error))}
          >
            <Text
              color={"button_text"}
              fontWeight={"600"}
              fontSize={"1rem"}
              lineHeight={"100%"}
            >
              Continue payment
            </Text>
          </CustomButton>
          <Text color={"text_primary"} fontSize={"0.875rem"}>
            Your payment information is safeguarded with advanced encryption
            technology
          </Text>
        </Box>
      )}
    </>
  );
};

export default PaymentOtpBox;
