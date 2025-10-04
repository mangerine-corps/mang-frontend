import { CloseButton, Dialog, HStack, Input, Portal, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { size } from "es-toolkit/compat";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "mangarine/components/customcomponents/button";
import OTPInput from "react-otp-input";

type props = {
  onOpenChange: any;
  isOpen: any;
};
const schema = Yup.object().shape({
  otp: Yup.string().required("Required").length(6, "OTP must be 6 digits"),
});
const TwoFaverifiy = ({ onOpenChange, isOpen }: props) => {
  const [show, setShow] = useState<boolean>();
  const { control } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      otp: "",
    },
  });
  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={onOpenChange}
      placement={"center"}
      size={"md"}

      // motionPreset="slide-in-bottom"
    >
      {/* <Dialog.Trigger asChild>
        <Button variant="outline">Open</Button>
      </Dialog.Trigger> */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            {/* <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
            </Dialog.Header> */}
            <Dialog.Body p="8" rounded={"xl"} bg="bg_box">
              <VStack
              // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
              >
                {/* Centering the image */}
                {/* <Center alignItems={"center"} pt="4" pb="3">
                  <Image
                    src={"/icons/notcancel.svg"}
                    alt="Regulations Image"
                    // boxSize={6}
                    objectFit="contain"

                    // height="auto"
                  />
                </Center> */}
                <Text
                  textAlign={"start"}
                  w="full"
                  // px={"6"}
                  fontSize={"1.5rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"600"}
                >
                  Verification Code
                </Text>

                <Text
                  textAlign={"start"}
                  w="full"
                  py={"6"}
                  fontSize={"0.875rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"400"}
                >
                  Enter the verification code you received from your email,
                  phone number or verification app:
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
                              borderColor={
                                size(value) > index ? "black" : "black"
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
              </VStack>
              {/* <ScheduleCard
                title="Consultation Canceled Successfully"
                imageSrc={"/icons/cancel.svg"}
                content={""}
                width="95%"
                details="10% has been deducted, and the remaining amount is credited to your wallet."
              /> */}
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="90%" pt="32" pb={6}>
              <HStack
                w="full"
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                flexDir={"row"}
                // mx="auto"
              >
                <CustomButton
                  customStyle={{
                    w: "full",
                  }}
                  onClick={() => {}}
                  // loading={isLoading}
                  // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
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
              </HStack>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default TwoFaverifiy;
