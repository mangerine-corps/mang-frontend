import {
  Button,
  Center,
  CloseButton,
  Dialog,
  HStack,
  Image,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import ScheduleCard from "../schedulecard";
import CustomButton from "mangarine/components/customcomponents/button";
import CancelConsultation from "./cancelconsultationmodal";

type props = {
  onOpenChange: any;
  isOpen: any;
  // Optional callback to run when user confirms action
  onConfirm?: () => Promise<void> | void;
  // Optional loading state to disable buttons while confirming
  isLoading?: boolean;
};

const AreyouCancellingModal = ({ onOpenChange, isOpen, onConfirm, isLoading }: props) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleConfirm = async () => {
      // If a custom onConfirm is provided, use it; otherwise preserve legacy behavior
      if (onConfirm) {
        await onConfirm();
        onOpenChange();
      } else {
        onOpenChange();
        setOpen(true);
      }
    };
  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={onOpenChange}
      placement={"center"}
      size={"xs"}

      // motionPreset="slide-in-bottom"
    >
      {/* <Dialog.Trigger asChild>
        <Button variant="outline">Open</Button>
      </Dialog.Trigger> */}
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p="3" rounded={"xl"} bg="bg_box">
            {/* <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
            </Dialog.Header> */}
            <Dialog.Body pb={4}  bg="bg_box">
              <VStack
              // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
              >
                {/* Centering the image */}
                <Center alignItems={"center"} pt="4" pb="3">
                  <Image
                    src={"/icons/cancel.svg"}
                    alt="Regulations Image"
                    // boxSize={6}
                    objectFit="contain"

                    // height="auto"
                  />
                </Center>
                <Text
                  textAlign={"center"}
                  w="full"
                  // px={"6"}
                  fontSize={"1.25rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"600"}
                >
                  Are you sure you want to cancel?
                </Text>

                <Text
                  textAlign={"center"}
                  w="full"
                  // px={"6"}
                  fontSize={"0.875rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"400"}
                >
                  You’ll lose the option to reschedule, and 10% of your payment
                  will be deducted. Proceed?
                </Text>
              </VStack>
              {/* <ScheduleCard
                title="Consultation Canceled Successfully"
                imageSrc={"/icons/cancel.svg"}
                content={""}
                width="95%"
                details="10% has been deducted, and the remaining amount is credited to your wallet."
              /> */}
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="100%" pb={6}>
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
                    w: "40%",
                    bg: "main_background",
                    borderWidth: "2px",
                  }}
                  onClick={() => {
                    if (!isLoading) onOpenChange();
                  }}
                  // loading={isLoading}
                  // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"text_primary"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    No Keep
                  </Text>
                </CustomButton>
                <CustomButton
                  customStyle={{
                    w: "40%",
                  }}
                  onClick={handleConfirm}
                  loading={Boolean(isLoading)}
                  // loading={isLoading}
                  // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
                >
                  <Text
                    color={"button_text"}
                    fontWeight={"600"}
                    fontSize={"1rem"}
                    lineHeight={"100%"}
                  >
                    Yes, you can
                  </Text>
                </CustomButton>

              </HStack>
              <CancelConsultation isOpen={open} onOpenChange={()=>{setOpen(false)}}/>
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
export default AreyouCancellingModal;

