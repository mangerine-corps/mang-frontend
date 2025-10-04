import {
  CloseButton,
  Dialog,
  HStack,
  Input,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

import { size } from "es-toolkit/compat";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import CustomButton from "mangarine/components/customcomponents/button";
import OTPInput from "react-otp-input";
import CustomInput from "mangarine/components/customcomponents/Input";

type props = {
  onOpenChange: any;
  isOpen: any;
};
const schema = Yup.object().shape({
  password: Yup.string().required("Required").length(8, "Current password is required"),
});
const LogoutModal = ({ onOpenChange, isOpen }: props) => {
  const [show, setShow] = useState<boolean>();
 const {
   control,
   handleSubmit,
   getValues,
   formState: { errors },
 } = useForm({
   resolver: yupResolver(schema),
   defaultValues: {
     password: "",
    
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
                  Log out of Other Devices
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
                    name="password"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomInput
                        label="Current Password"
                        placeholder="********"
                        id="password"
                        required={true}
                        name="password"
                        value={value}
                        size="md"
                        onChange={onChange}
                        error={errors.password}
                        hasRightIcon={false}
                        // type={showPassword ? "text" : "password"}
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
export default LogoutModal;
