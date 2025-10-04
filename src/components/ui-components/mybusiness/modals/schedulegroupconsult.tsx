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
import CustomSelect from "mangarine/components/customcomponents/select";
import { SelectOptions } from "mangarine/types";
type props = {
  onOpenChange: any;
  isOpen: any;
};
const meetingSchema = Yup.object().shape({
  desc: Yup.string(),
  internalNote: Yup.string(),
  title: Yup.string(),
  participant: Yup.array().of(Yup.string()).min(1, "advance is required"),
  time: Yup.array().of(Yup.string()).min(1, "Time is required"),
});
const advanceType = [
  {
    id: "1",
    label: "12 Hours",
    value: "12 Hours",
  },
  {
    id: "2",
    label: "24 Hours",
    value: "12 Hours",
  },
  {
    id: "3",
    label: "No Notice",
    value: "12 Hours",
  },
];
const meetingTime = [
  {
    id: "1",
    label: "1 Hour",
    value: "1 Hour",
  },
  {
    id: "2",
    label: "4 Hour",
    value: "4 Hour",
  },
  {
    id: "3",
    label: "6 Hour",
    value: "6 Hour",
  },
];
const ScheduleGroupConsultation = ({ onOpenChange, isOpen }: props) => {
  const [open, setopen] = useState(false);
  const [timeOptions, setTimeOptions] = useState<SelectOptions[]>([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(meetingSchema),
    defaultValues: {
      desc: "",
      internalNote: "",
      title: "",
      participant: [],
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
                pt={"6"}
                fontSize={"2rem"}
                fontFamily={"Outfit"}
                color={"text_primary"}
                fontWeight={"600"}
              >
                Schedule Group Consultation
              </Text>
              <Dialog.Title></Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              <VStack alignItems={"flex-start"} py="4" pt="8" w="full">
                <Stack w="full">
                  <Controller
                    name="title"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomInput
                        label="Customer Title"
                        placeholder="Consultation on Resume Building"
                        id="title"
                        required={false}
                        name="title"
                        value={value}
                        size="lg"
                        onChange={onChange}
                        error={errors.title}
                        hasRightIcon={false}
                        type={"text"}
                        //   rightIcon={
                        //     <Icon mr={"4"}>
                        //       {colorMode === "dark" ? (
                        //         <Image src="/icons/mailwhite.svg" alt="mail-icon" />
                        //       ) : (
                        //         <Image src="/icons/mailIcon.svg" alt="mail-icon" />
                        //       )}
                        //     </Icon>
                        //   }
                      />
                    )}
                  />
                </Stack>
                <Stack w="full" pb="4">
                  <Text
                    fontSize={"1rem"}
                    fontWeight="400"
                    color="grey.500"
                    lineHeight={"30px"}
                  >
                    {" "}
                    Description
                  </Text>
                  <Controller
                    name="desc"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <VStack
                        alignItems={"start"}
                        w="full"
                        py="4"
                        rounded="xl"
                        borderWidth="1.5px"
                        p="4"
                        shadow="sm"
                      >
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
                <Stack w="full" pb="4">
                  <Text
                    fontSize={"1rem"}
                    fontWeight="400"
                    color="grey.500"
                    lineHeight={"30px"}
                  >
                    {" "}
                    Internal Notes (Only visible to you){" "}
                  </Text>
                  <Controller
                 name="internalNote"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <VStack
                        alignItems={"start"}
                        w="full"
                        py="4"
                        rounded="xl"
                        borderWidth="1.5px"
                        p="4"
                        shadow="sm"
                      >
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
                <Stack w="full" pb="4">
                  <Text
                    fontSize={"1rem"}
                    fontWeight="400"
                    color="grey.500"
                    lineHeight={"30px"}
                  >
                    {" "}
                    Advance Notice{" "}
                  </Text>
                  <Controller
                    name="participant"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <CustomSelect
                        id={"advanceNotice"}
                        placeholder="Select advance notice"
                        name={"advance notice"}
                        size="md"
                        options={advanceType}
                        label=""
                        value={value}
                        required={false}
                        error={errors.participant}
                        onChange={onChange}
                      />
                    )}
                  />
                  </Stack>
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
                      name="participant"
                      control={control}
                      render={({ field: { onChange, value } }) => (
                        <CustomSelect
                          id={"meetingTime"}
                          placeholder="Select meeting buffer time"
                          name={"meeting time"}
                          size="md"
                          options={meetingTime}
                          label=""
                          value={value}
                          //   bg="main_background"
                          required={false}
                          error={errors.time}
                          onChange={onChange}
                        />
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
                    Requires additional payment?
                    <Text
                      color="gray.500"
                      fontSize="1rem"
                      lineHeight="30px"
                      fontWeight="400"
                    >
                      (check if yes)
                    </Text>
                  </Text>
                </HStack>
                <HStack>
                  <Text
                    color="text_primary"
                    fontSize="1rem"
                    lineHeight="30px"
                    fontWeight="400"
                  >
                    Requires additional payment?
                    <Text
                      color="gray.500"
                      fontSize="1rem"
                      lineHeight="30px"
                      fontWeight="400"
                    >
                      (check if yes)
                    </Text>
                  </Text>
                  <HStack>
                    <Checkbox />
                    <Text
                      color="gray.500"
                      fontSize="1rem"
                      lineHeight="30px"
                      fontWeight="400"
                    >
                      Everyone
                    </Text>
                  </HStack>
                  <HStack>
                    <Checkbox />
                    <Text
                      color="gray.500"
                      fontSize="1rem"
                      lineHeight="30px"
                      fontWeight="400"
                    >
                      Followers
                    </Text>
                  </HStack>
                  <HStack>
                    <Checkbox />
                    <Text
                      color="gray.500"
                      fontSize="1rem"
                      lineHeight="30px"
                      fontWeight="400"
                    >
                      Community Members
                    </Text>
                  </HStack>
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
                    Save Post
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
export default ScheduleGroupConsultation;
