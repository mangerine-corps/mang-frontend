import { Button, Center, Dialog, HStack, Image, Portal, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

import CustomButton from "mangarine/components/customcomponents/button";
import { Checkbox } from "mangarine/components/ui/checkbox";

type props = {
  onOpenChange: any;
  isOpen: any;
};

const EmptyAppointment = ({ onOpenChange, isOpen }: props) => {
  const [open, setopen] = useState(false);

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

      // motionPreset="slide-in-bottom"
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
              <VStack
                rounded="xl"
                borderWidth="1.5px"
                p="4"
                shadow="sm"
                alignItems={"flex-start"}
                py="2"
                pt="8"
                w="full"
              >
                <Center alignItems={"center"} pt="4" pb="3">
                  <Image
                    src={"/icons/question.svg"}
                    alt="Regulations Image"
                    // boxSize={6}
                    objectFit="contain"

                    // height="auto"
                  />
                </Center>
                <Text
                  fontSize={"1.5rem"}
                  fontWeight={"600"}
                  lineHeight={"36px"}
                  textAlign={"center"}
                >
                  No Appointment
                </Text>
                <Text
                  fontSize={"1.5rem"}
                  fontWeight={"600"}
                  lineHeight={"36px"}
                  color="grey.500"
                  textAlign={"center"}
                >
                  You have no appointment scheduled for this day
                </Text>

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
                alignItems={"center"}
                justifyContent={"space-between"}
                flexDir={"row"}
                // mx="auto"
              >
                <Button variant="ghost" color="text_primary">
                  Reschedule
                </Button>
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
                    Confirm Reschedule
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
export default EmptyAppointment;
