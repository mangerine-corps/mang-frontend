import { Box, HStack, Input, Stack, Switch, Text, VStack } from "@chakra-ui/react";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { useState } from "react";
import OTPInput from "react-otp-input";
import { size } from "es-toolkit/compat";
import ReactDOM from "react-dom";
import { QRCodeSVG } from "qrcode.react";
import { Checkbox } from "../ui/checkbox";
import { PaginatedTable } from "../customcomponents/table";
import { outfit } from "mangarine/pages/_app";

const Schema = Yup.object().shape({
  language: Yup.array().of(Yup.string()).min(1, "Area of interest is required"),
  userType: Yup.array().of(Yup.string()).min(1, "who you are is required"),
  otp: Yup.string().required("Required").length(6, "OTP must be 6 digits"),
});
const SecuritySetting = () => {
  const [activateEmail, setActivateEmail] = useState<boolean>(false);
    const [tfa, setTfa] = useState<boolean>(false);
      const [ATfa, setAtfa] = useState<boolean>(false);
      const [PTfa, setPtfa] = useState<boolean>(false);
  const langOptions = [
    { id: 1, label: "English", value: "English" },
    { id: 2, label: "Chinese", value: "Chinese" },
  ];
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      language: [],
      userType: [],
      otp:""
    },
  });

  return (
    <Box
      w="full"
      p={{ base: 4, sm: 6, md: 8, lg: 10, xl: 12 }}
      borderRadius="lg"
      boxShadow="lg"
      bg="bg_box"
      mt={{ base: 4, md: 8, lg: 0, xl: "flex" }}
      className={outfit.className}
    >
      <Text
        fontSize={{base:"1rem", md:"1.5rem", lg:"1.5rem"}}
        fontWeight="600"
        lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
        font="outfit"
        color="text_primary"
        // mb={6}
      >
        Two-Factor Authentication (2FA)
      </Text>
      <Text
        fontSize="0.875rem"
        fontWeight="500"
        // lineHeight="36px"
        font="outfit"
        color="grey.500"
        // my={6}
      >
        Enhance your account security by setting up 2FA. Protect your
        information with an additional layer of defense.
      </Text>
      <HStack
        justifyContent={"space-between"}
        alignItems={"center"}
        w="full"
        py="10"
      >
        <VStack alignItems={"flex-start"} justifyContent={"flex-start"}>
          <Text
            fontSize="1rem"
            fontWeight="600"
            // lineHeight="36px"
            font="outfit"
            color="text_primary"
            // mb={6}
          >
            Email Address
          </Text>
          <Text
            fontSize="0.875rem"
            fontWeight="400"
            // lineHeight="36px"
            font="outfit"
            color="grey.500"
            // my={6}
          >
            Add an extra layer of protection with a secure code sent directly to
            your email.
          </Text>
        </VStack>
        {!tfa ? (
          <Text
            cursor={"pointer"}
            onClick={() => {
              setTfa(true);
            }}
            fontSize="1rem"
            fontWeight="600"
            // lineHeight="36px"
            font="outfit"
            color="text_primary"
            // my={6}
          >
            Activate
          </Text>
        ) : (
          <Text
            cursor={"pointer"}
            onClick={() => {
              setTfa(false);
            }}
            fontSize="1rem"
            fontWeight="600"
            // lineHeight="36px"
            font="outfit"
            color="text_primary"
            // my={6}
          >
            Deactivate
          </Text>
        )}
      </HStack>
      {tfa && (
        <Stack
          borderWidth="1px"
          borderColor={"grey.50"}
          py="3"
          px="3"
          mb="6"
          rounded={"8px"}
        >
          <HStack
            justifyContent={"space-between"}
            alignItems={"center"}
            w="full"
            pb="2"
            mb="6"
            borderBottomWidth={"1px"}
            borderBottomColor={"grey.50"}
          >
            <VStack
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              w="full"
            >
              <Text
                fontSize="1rem"
                fontWeight="600"
                // lineHeight="36px"
                font="outfit"
                color="text_primary"
                // mb={6}
              >
                2FA Setup
              </Text>
              <Text
                fontSize="0.875rem"
                fontWeight="400"
                // lineHeight="36px"
                font="outfit"
                color="grey.500"
                // my={6}
              >
                Setup
              </Text>
            </VStack>
            <Stack w="15%" alignItems={"flex-end"} justifyContent={"flex-end"}>
              {tfa ? (
                <Text
                  fontSize="1rem"
                  fontWeight="600"
                  // lineHeight="36px"
                  font="outfit"
                  color="grey.500"
                  // my={6}
                >
                  Enable 2FA
                </Text>
              ) : (
                <Text
                  fontSize="1rem"
                  fontWeight="600"
                  // lineHeight="36px"
                  font="outfit"
                  color="text_primary"
                  // my={6}
                >
                  Deactivate
                </Text>
              )}
            </Stack>
          </HStack>
          <VStack
            justifyContent={"space-between"}
            alignItems={"center"}
            w="full"
            pb="6"
          >
            <Switch.Root
              w="full"
              alignItems={"flex-start"}
              justifyContent={"space-between"}
            >
              <Switch.Label
                font="outfit"
                fontSize="1rem"
                fontWeight="400"
                color="text_primary"
                lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
              >
                Log in
              </Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
            <Switch.Root
              w="full"
              alignItems={"flex-start"}
              justifyContent={"space-between"}
            >
              <Switch.Label
                font="outfit"
                fontSize="1rem"
                fontWeight="400"
                color="text_primary"
                lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
              >
                Payment Confirmation
              </Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
            <Switch.Root
              w="full"
              alignItems={"flex-start"}
              justifyContent={"space-between"}
            >
              <Switch.Label
                font="outfit"
                fontSize="1rem"
                fontWeight="400"
                color="text_primary"
                lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
              >
                Account Settings change
              </Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
            <Switch.Root
              w="full"
              alignItems={"flex-start"}
              justifyContent={"space-between"}
            >
              <Switch.Label
                font="outfit"
                fontSize="1rem"
                fontWeight="400"
                color="text_primary"
                lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
              >
                Consultation Booking
              </Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
          </VStack>
        </Stack>
      )}
      <HStack
        justifyContent={"space-between"}
        alignItems={"center"}
        w="full"
        pb="10"
      >
        <VStack alignItems={"flex-start"} justifyContent={"flex-start"}>
          <Text
            fontSize="1rem"
            fontWeight="600"
            // lineHeight="36px"
            font="outfit"
            color="text_primary"
            // mb={6}
          >
            Phone Number
          </Text>
          <Text
            fontSize="0.875rem"
            fontWeight="400"
            // lineHeight="36px"
            font="outfit"
            color="grey.500"
            // my={6}
          >
            Add an extra layer of protection with a secure code sent directly to
            your email.
          </Text>
        </VStack>
        {!PTfa ? (
          <Text
            cursor={"pointer"}
            onClick={() => {
              setPtfa(true);
            }}
            fontSize="1rem"
            fontWeight="600"
            // lineHeight="36px"
            font="outfit"
            color="text_primary"
            // my={6}
          >
            Activate
          </Text>
        ) : (
          <Text
            cursor={"pointer"}
            onClick={() => {
              setPtfa(false);
            }}
            fontSize="1rem"
            fontWeight="600"
            // lineHeight="36px"
            font="outfit"
            color="text_primary"
            // my={6}
          >
            Deactivate
          </Text>
        )}
      </HStack>
      {PTfa && (
        <Stack
          borderWidth="1px"
          borderColor={"grey.50"}
          py="3"
          px="3"
          mb="6"
          rounded={"8px"}
        >
          <HStack
            justifyContent={"space-between"}
            alignItems={"center"}
            w="full"
            pb="2"
            mb="6"
            borderBottomWidth={"1px"}
            borderBottomColor={"grey.50"}
          >
            <VStack
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              w="full"
            >
              <Text
                fontSize="1rem"
                fontWeight="600"
                // lineHeight="36px"
                font="outfit"
                color="text_primary"
                // mb={6}
              >
                2FA Setup
              </Text>
              <Text
                fontSize="0.875rem"
                fontWeight="400"
                // lineHeight="36px"
                font="outfit"
                color="grey.500"
                // my={6}
              >
                Setup
              </Text>
            </VStack>
            <Stack w="15%" alignItems={"flex-end"} justifyContent={"flex-end"}>
              {PTfa ? (
                <Text
                  fontSize="1rem"
                  fontWeight="600"
                  // lineHeight="36px"
                  font="outfit"
                  color="grey.500"
                  // my={6}
                >
                  Enable 2FA
                </Text>
              ) : (
                <Text
                  fontSize="1rem"
                  fontWeight="600"
                  // lineHeight="36px"
                  font="outfit"
                  color="text_primary"
                  // my={6}
                >
                  Deactivate
                </Text>
              )}
            </Stack>
          </HStack>
          <VStack
            justifyContent={"space-between"}
            alignItems={"center"}
            w="full"
            pb="6"
          >
            <Switch.Root
              w="full"
              alignItems={"flex-start"}
              justifyContent={"space-between"}
            >
              <Switch.Label
                font="outfit"
                fontSize="1rem"
                fontWeight="400"
                color="text_primary"
                lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
              >
                Log in
              </Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
            <Switch.Root
              w="full"
              alignItems={"flex-start"}
              justifyContent={"space-between"}
            >
              <Switch.Label
                font="outfit"
                fontSize="1rem"
                fontWeight="400"
                color="text_primary"
                lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
              >
                Payment Confirmation
              </Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
            <Switch.Root
              w="full"
              alignItems={"flex-start"}
              justifyContent={"space-between"}
            >
              <Switch.Label
                font="outfit"
                fontSize="1rem"
                fontWeight="400"
                color="text_primary"
                lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
              >
                Account Settings change
              </Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
            <Switch.Root
              w="full"
              alignItems={"flex-start"}
              justifyContent={"space-between"}
            >
              <Switch.Label
                font="outfit"
                fontSize="1rem"
                fontWeight="400"
                color="text_primary"
               lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
              >
                Consultation Booking
              </Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
          </VStack>
        </Stack>
      )}
      <HStack
        justifyContent={"space-between"}
        alignItems={"center"}
        w="full"
        pb="10"
      >
        <VStack alignItems={"flex-start"} justifyContent={"flex-start"}>
          <Text
            fontSize="1rem"
            fontWeight="600"
            // lineHeight="36px"
            font="outfit"
            color="text_primary"
            // mb={6}
          >
            Authentication App
          </Text>
          <Text
            fontSize="0.875rem"
            fontWeight="400"
            // lineHeight="36px"
            font="outfit"
            color="grey.500"
            // my={6}
          >
            Add an extra layer of protection with a secure code sent directly to
            your email.
          </Text>
        </VStack>
        {!ATfa ? (
          <Text
            cursor={"pointer"}
            onClick={() => {
              setAtfa(true);
            }}
            fontSize="1rem"
            fontWeight="600"
            // lineHeight="36px"
            font="outfit"
            color="text_primary"
            // my={6}
          >
            Activate
          </Text>
        ) : (
          <Text
            cursor={"pointer"}
            onClick={() => {
              setAtfa(false);
            }}
            fontSize="1rem"
            fontWeight="600"
            // lineHeight="36px"
            font="outfit"
            color="text_primary"
            // my={6}
          >
            Deactivate
          </Text>
        )}
      </HStack>

      {ATfa && (
        <VStack
          alignItems={"flex-start"}
          w="100%"
          mx="auto"
          p={4}
          boxShadow="sm"
          borderRadius="md"
          justifyContent={"flex-start"}
          // py="4"
          mb="6"
        >
          <Text
            fontSize="0.875rem"
            fontWeight="500"
            lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
            font="outfit"
            color="text_primary"
            // my={6}
          >
            Generate verification codes with Google Authenticator or Authy to
            strengthen your security.
          </Text>
          <HStack>
            <QRCodeSVG value="https://reactjs.org/" />
            <VStack
              alignItems={"flex-start"}
              justifyContent={"flex-start"}
              pl="3"
              w="45"
            >
              <Text
                fontSize="0.875rem"
                fontWeight="400"
                // lineHeight="36px"
                font="outfit"
                color="grey.500"
                // my={6}
              >
                Scan this QR code or copy it to setup manually.
              </Text>
              <HStack>
                <Checkbox />
                <Text
                  fontSize="1rem"
                  fontWeight="600"
                  // lineHeight="36px"
                  font="outfit"
                  color="text_primary"
                  // mb={6}
                >
                  Copy code
                </Text>
              </HStack>
            </VStack>
          </HStack>

          <Text
            fontSize="1em"
            fontWeight="500"
            // lineHeight="36px"
            font="outfit"
            color="text_primary"
            pt="6"
            // my={6}
          >
            2FA Code
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
                  numInputs={6}
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
        </VStack>
      )}

      <Box w="full" py="10">
        <Text
          fontSize={{base:"1rem", md:"1.5rem", lg:"1.5rem"}}
          fontWeight="600"
          lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
          font="outfit"
          color="text_primary"
          // mb={6}
        >
          Login Activities
        </Text>
        <PaginatedTable />
      </Box>
    </Box>
  );
};

export default SecuritySetting;
