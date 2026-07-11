import {
  Center,
  CloseButton,
  Dialog,
  HStack,
  Image,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useCancelAppointmentMutation } from "mangarine/state/services/apointment.service";
import CustomButton from "mangarine/components/customcomponents/button";

type props = {
  onOpenChange: () => void;
  isOpen: boolean;
  consultationId?: string | null;
  onSuccess?: () => void;
  // Legacy: caller manages the mutation itself
  onConfirm?: () => Promise<void> | void;
  isLoading?: boolean;
};

const AreyouCancellingModal = ({
  onOpenChange,
  isOpen,
  consultationId,
  onSuccess,
  onConfirm,
  isLoading: externalLoading,
}: props) => {
  const [cancelAppointment, { isLoading: internalLoading }] = useCancelAppointmentMutation();
  const isLoading = externalLoading ?? internalLoading;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
      return;
    }
    if (!consultationId) return;
    try {
      await cancelAppointment({ appointmentId: consultationId }).unwrap();
      onOpenChange();
      onSuccess?.();
    } catch {
      // errors handled by RTK Query
    }
  };

  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={onOpenChange}
      placement={"center"}
      size={"xs"}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p="3" rounded={"xl"} bg="bg_box">
            <Dialog.Body pb={4} bg="bg_box">
              <VStack>
                <Center alignItems={"center"} pt="4" pb="3">
                  <Image
                    src={"/icons/cancel.svg"}
                    alt="Cancel icon"
                    objectFit="contain"
                  />
                </Center>
                <Text
                  textAlign={"center"}
                  w="full"
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
                  fontSize={"0.875rem"}
                  fontFamily={"Outfit"}
                  color={"text_primary"}
                  fontWeight={"400"}
                >
                  You'll lose the option to reschedule, and 10% of your payment
                  will be deducted. Proceed?
                </Text>
              </VStack>
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="100%" pb={6}>
              <HStack
                w="full"
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                flexDir={"row"}
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
                  customStyle={{ w: "40%" }}
                  onClick={handleConfirm}
                  loading={isLoading}
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
