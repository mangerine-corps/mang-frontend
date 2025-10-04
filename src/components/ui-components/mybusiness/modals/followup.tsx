import {
  Box,
  Button,
  createListCollection,
  Dialog,
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
import SuccessfulFollowup from "./successfollowup";
type props = {
  onOpenChange: any;
  isOpen: any;
};
const appointmentSchema = Yup.object().shape({
  clientNote: Yup.array(),
  internalNote: Yup.string(),
});
const FollowUp = ({ onOpenChange, isOpen }: props) => {
  const [open, setopen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      clientNote:[],
      // internalNote: "",
    },
  });
const frameworks = createListCollection({
  items: [
    { label: "24 Hours", value: "24 Hours" },
    { label: "1 Day", value: "1 Day" },
    { label: "2 Days", value: "2 Days" },
    { label: "3 Days", value: "3 Days" },
    { label: "4 Days", value: "4 Days" },
    { label: "5 Days", value: "5 Days" },
  ],
});
  const onSubmit = () => {
    console.log("here");
  };
  const openModal = () => {
    // onOpenChange()
    setopen(true);
  };

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
              {/* <Text
                textAlign={"left"}
                w="full"
                // px={"6"}
                fontSize={"2rem"}
                fontFamily={"Outfit"}
                color={"text_primary"}
                fontWeight={"600"}
              >
                Appointment Details
              </Text> */}
              <Dialog.Title></Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <Box
                w="full"
                h="full"
                // borderRadius="md"
                // bg="bg_box"
                // boxShadow="lg"
                // p={6}
                position="relative"
              >
                {/* Close Icon */}
                {/* <CloseButton
                  position="absolute"
                  top={4}
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
                  my={8}
                >
                  Set Follow-up Duration
                </Text>

                <Text
                  color="text_primary"
                  font="outfit"
                  fontSize="0.875rem"
                  fontWeight="400"
                  mb={1}
                >
                  How many days would you like to follow up with the Shawn Bred?
                </Text>

                <Select.Root
                  collection={frameworks}
                  size="sm"
                  width="full"
                  mb={8}
                >
                  <Select.HiddenSelect />
                  <Select.Label></Select.Label>
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText
                        p={2}
                        color="text_primary"
                        placeholder="Follow-up period"
                      />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {frameworks.items.map((framework) => (
                          <Select.Item
                            color="text_primary"
                            m={4}
                            item={framework}
                            key={framework.value}
                          >
                            {framework.label}
                            <Select.ItemIndicator />
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>

                {/* Internal Notes */}
                <Box mb={6}>
                  <Text
                    font="outfit"
                    fontSize="1rem"
                    fontWeight="400"
                    color="grey.500"
                    mb={2}
                  >
                    Follow-up Message (optional)
                  </Text>
                  <Textarea
                    placeholder="Write a follow up mesage to your client"
                    minH="120px"
                    p={4}
                  />
                </Box>

                {/* Action Buttons */}
              </Box>
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="100%" pb={6}>
              <HStack justifyContent="flex-end">
                <Button
                  w="196px"
                  h="48px"
                  px="80px"
                  py="24px"
                  gap="10px"
                  borderRadius="8px"
                  border="1px solid"
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  w="196px"
                  h="48px"
                  px="80px"
                  py="24px"
                  gap="10px"
                  onClick={()=>{setopen(true)}}
                  borderRadius="8px"
                  bg="blue.900"
                  color="white"
                  _hover={{ bg: "blue.800" }}
                >
                  Submit
                </Button>
              </HStack>
              <SuccessfulFollowup isOpen={open} onOpenChange={()=>{setopen(false)}}/>
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
export default FollowUp;
