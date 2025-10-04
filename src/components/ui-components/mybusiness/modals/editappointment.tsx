import {
  Button,
  Dialog,
  HStack,
  Portal,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

import CustomButton from "mangarine/components/customcomponents/button";
import { Checkbox } from "mangarine/components/ui/checkbox";
import { Controller, useForm } from "react-hook-form";
import CustomInput from "mangarine/components/customcomponents/Input";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
type props = {
  onOpenChange: any;
  isOpen: any;
};
const appointmentSchema = Yup.object().shape({
  clientNote: Yup.string(),
  internalNote: Yup.string(),
});
const EditAppointmentDetails = ({ onOpenChange, isOpen }: props) => {
  const [open, setopen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      clientNote: "",
      internalNote: "",
    },
  });
  const onSubmit = () => {
    console.log("here");
  };
  const openModal = () => {
    // onOpenChange()
    setopen(true);
  };
  const appointmentList = [
    {
      id: 1,
      Name: "Sharon Grace",
      ConsultationTopic: "Resume Building",
      internalnote: " 2:22pm",
      Duration: "1hr:00mins",
      Status: "Scheduled",
    },
  ];
  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={onOpenChange}
      placement={"center"}
      size={"lg"}
      motionPreset="slide-in-bottom"
    >
      {/* <Dialog.Trigger asChild>
        <Button variant="outline">Open</Button>
      </Dialog.Trigger> */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p="8" rounded={"xl"} bg="bg_box">
            <Dialog.Header>
              <Text
                textAlign={"left"}
                w="full"
                // px={"6"}
                fontSize={"2rem"}
                fontFamily={"Outfit"}
                color={"text_primary"}
                fontWeight={"600"}
              >
                Appointment Details
              </Text>
              <Dialog.Title></Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack alignItems={"flex-start"} py="2" pt="8" w="full">
                <Text
                  fontSize={"1.5rem"}
                  fontWeight={"600"}
                  lineHeight={"36px"}
                >
                  Appointment 1
                </Text>
                <VStack w="full" py="4">
                  {appointmentList.map((item) => (
                    <VStack
                      w="full"
                      key={item.id}
                      rounded="xl"
                      borderWidth="1.5px"
                      p="4"
                      shadow="sm"
                    >
                      <HStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        w="full"
                        py="2"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          Client Name:
                        </Text>
                        <Text
                          color="text_primary"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          {item.Name}
                        </Text>
                      </HStack>
                      <HStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        w="full"
                        py="2"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          Consultation Topic:
                        </Text>
                        <Text
                          color="text_primary"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          {item.ConsultationTopic}
                        </Text>
                      </HStack>
                      <HStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        w="full"
                        py="2"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          Consultation internalnote:
                        </Text>
                        <Text
                          color="text_primary"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          {item.internalnote}
                        </Text>
                      </HStack>
                      <HStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        w="full"
                        py="2"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          Duration:
                        </Text>
                        <Text
                          color="text_primary"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          {item.Duration}
                        </Text>
                      </HStack>
                      <HStack
                        justifyContent={"space-between"}
                        alignItems={"center"}
                        w="full"
                        py="2"
                      >
                        <Text
                          color="grey.500"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          Status:
                        </Text>
                        <Text
                          color="#FF9800"
                          fontSize="1.25rem"
                          lineHeight="30px"
                          fontWeight="400"
                        >
                          {item.Status}
                        </Text>
                      </HStack>
                    </VStack>
                  ))}
                </VStack>
                <VStack
                  w="full"
                  py="4"
                  rounded="xl"
                  borderWidth="1.5px"
                  p="4"
                  shadow="sm"
                >
                  <Stack w="full">
                    <Controller
                      name="clientNote"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <VStack alignItems={"start"} w="full">
                          <Text
                            fontSize={"1.25rem"}
                            fontWeight="400"
                            color="grey.500"
                            lineHeight={"30px"}
                          >
                            {`Client's Note`}
                          </Text>
                          <Textarea
                            border={"none"}
                            outline={"none"}
                            focusRing={"none"}
                            value={value}
                            onChange={onChange}
                          />
                        </VStack>
                      )}
                    />
                  </Stack>
                </VStack>
                <VStack
                  w="full"
                  py="4"
                  rounded="xl"
                  borderWidth="1.5px"
                  p="4"
                  shadow="sm"
                >
                  <Stack w="full">
                    <Controller
                      name="internalNote"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <VStack alignItems={"start"} w="full">
                          <Text
                            fontSize={"1.25rem"}
                            fontWeight="400"
                            color="grey.500"
                            lineHeight={"30px"}
                          >
                            {" "}
                            Internal Notes (Only visible to you){" "}
                          </Text>
                          <Textarea
                            border={"none"}
                            outline={"none"}
                            focusRing={"none"}
                            value={value}
                            placeholder={"Add note related to the appointment"}
                            onChange={onChange}
                          />
                        </VStack>
                      )}
                    />
                  </Stack>
                </VStack>
                <HStack>
                  <Checkbox />
                  <Text
                    color="text_primary"
                    fontSize="1rem"
                    lineHeight="30px"
                    fontWeight="400"
                  >
                    Mark this day as unavailable
                  </Text>
                </HStack>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="100%" pb={6}>
              <HStack
                w="full"
                display={"flex"}
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
                flexDir={"row"}
                // mx="auto"
              >

                <CustomButton
                  customStyle={{
                    w: "35%",
                    bg: "main_background",
                    borderWidth: "2px",
                  }}
                  onClick={() => {}}
                  // loading={isLoading}
                  // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"text_primary"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    Cancel
                  </Text>
                </CustomButton>
                <CustomButton
                  customStyle={{
                    w: "35%",
                  }}
                  onClick={openModal}
                  // loading={isLoading}
                  // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"button_text"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                  Save Changes
                  </Text>
                </CustomButton>
              </HStack>
            </Dialog.Footer>
            {/* <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger> */}
            {/* <RescheduleSuccessful
              isOpen={open}
              onOpenChange={() => {
                setopen(false);
              }}
            /> */}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default EditAppointmentDetails;
