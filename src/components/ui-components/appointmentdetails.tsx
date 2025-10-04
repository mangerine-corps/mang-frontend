import {
  Box,
  Button,
  createListCollection,
  Dialog,
  Flex,
  HStack,
  Portal,
  Select,
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
import { CloseButton } from "mangarine/components/ui/close-button";
import FollowUp from "./mybusiness/modals/followup";
import { outfit } from "mangarine/pages/_app";

type props = {
  onOpenChange: any;
  isOpen: any;
};
// const appointmentSchema = Yup.object().shape({
//   clientNote: Yup.string(),
//   internalNote: Yup.string(),
// });
const InfoLine = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) => (
  <Flex w="full" justify="space-between" align="center">
    <Text font="outfit" fontSize="1.25rem" fontWeight="400" color="gray.500">
      {label}
    </Text>
    <Text
      font="outfit"
      fontSize="1.25rem"
      fontWeight="400"
      color={color || "text_primary"}
      textAlign="right"
    >
      {value}
    </Text>
  </Flex>
);
const AppointmentView = ({ onOpenChange, isOpen }: props) => {
  const [open, setopen] = useState(false);
  //   const {
  //     control,
  //     handleSubmit,
  //     formState: { errors },
  //   } = useForm({
  //     resolver: yupResolver(appointmentSchema),
  //     defaultValues: {
  //       clientNote: "",
  //       internalNote: "",
  //     },
  //   });

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
              <Dialog.Title></Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box
                w="full"
                h="full"
                // p={6}
                position="relative"
              >
                {/* Close Icon */}
                {/* <CloseButton
                  position="absolute"
                  top={0}
                  right={4}
                  w="48px"
                  h="48px"
                  p="10px"
                /> */}

                {/* Title */}
                <Text
                  color="text_primary"
                  font="outfit"
                  fontSize="2.5rem"
                  lineHeight="30px"
                  fontWeight="700"
                  mb={12}
                >
                  Appointment Details
                </Text>

                {/* Info Section */}
                <VStack align="start" gap={3} mb={8} w="full" className={outfit.className}>
                  <InfoLine
                    label="Date & time:"
                    value="15, July, 2024, 2:22pm"
                  />
                  <InfoLine label="Client Name:" value="Ralph Edwards" />
                  <InfoLine
                    label="Consultation Topic:"
                    value="Resume Building"
                  />
                  <InfoLine
                    label="Status:"
                    value="Completed"
                    color="green.500"
                  />
                </VStack>

                {/* Client Message */}
                <Box
                  mb={8}
                  shadow={"xs"}
                  p="4"
                  bg="bg_box"
                  borderRadius="1px"
                  border="1px"
                >
                  <Text
                    font="outfit"
                    fontSize="1.25rem"
                    fontWeight="400"
                    color="gray.500"
                    pb={4}
                  >
                    Client’s Message
                  </Text>
                  <Box
                    font="outfit"
                    fontSize="1rem"
                    fontWeight="400"
                    color="gray.700"
                    lineHeight={"24px"}
                  >
                   {` Hi Sharon Grace, I’ve just booked a resume-building session
                    with you. I’m looking forward to your insights! I’ll bring
                    my current resume and a few job postings I'm interested in.`}
                  </Box>
                </Box>

                {/* Internal Notes */}
                <Box mb={8}>
                  <Text
                    font="outfit"
                    fontSize="1.25rem"
                    fontWeight="400"
                    color="gray.500"
                    mb={1}
                  >
                    Internal Notes (Only visible to you)
                  </Text>
                  <Textarea
                    placeholder="Add note related to the appointment"
                    minH="120px"
                    p={4}
                  />
                </Box>

                {/* Action Buttons */}
              </Box>
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="100%" pb={8}>
              <HStack justifyContent="flex-end">
                <Button
                  w="80%"
                  px="6"
                  py="3"
                  borderRadius="8px"
                  border="1px solid"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  w="80%"
                  px="6"
                  py="3"
                  onClick={() => {
                    setopen(true);
                  }}
                  borderRadius="8px"
                  bg="blue.900"
                  color="white"
                  _hover={{ bg: "blue.800" }}
                >
                  Follow-up
                </Button>
              </HStack>
            </Dialog.Footer>
            {/* <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger> */}
            <FollowUp
              isOpen={open}
              onOpenChange={() => {
                setopen(false);
              }}
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
export default AppointmentView;
