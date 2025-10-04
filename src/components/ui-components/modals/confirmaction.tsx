import {
  CloseButton,
  Dialog,
  HStack,
  Image,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import CustomButton from "mangarine/components/customcomponents/button";

export type ConfirmActionModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
  description?: string;
  iconSrc?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => Promise<void> | void;
  isLoading?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
};

const ConfirmActionModal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  iconSrc = "/icons/cancel.svg",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  isLoading,
  size = "xs",
}: ConfirmActionModalProps) => {
  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
  };

  return (
    <Dialog.Root lazyMount open={isOpen} onOpenChange={onOpenChange} placement={"center"} size={size}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content p="3" rounded={"xl"} bg="bg_box">
            <Dialog.Body pb={4} bg="bg_box">
              <VStack>
                {iconSrc ? (
                  <VStack pt="4" pb="3">
                    <Image src={iconSrc} alt="modal icon" objectFit="contain" />
                  </VStack>
                ) : null}
                <Text textAlign={"center"} w="full" fontSize={"1.25rem"} fontFamily={"Outfit"} color={"text_primary"} fontWeight={"600"}>
                  {title}
                </Text>
                {description ? (
                  <Text textAlign={"center"} w="full" fontSize={"0.875rem"} fontFamily={"Outfit"} color={"text_primary"} fontWeight={"400"}>
                    {description}
                  </Text>
                ) : null}
              </VStack>
            </Dialog.Body>
            <Dialog.Footer mx="auto" w="100%" pb={6}>
              <HStack w="full" display={"flex"} alignItems={"center"} justifyContent={"center"} flexDir={"row"}>
                <CustomButton
                  customStyle={{ w: "40%", bg: "main_background", borderWidth: "2px" }}
                  onClick={() => {
                    if (!isLoading) onOpenChange();
                  }}
                >
                  <Text color={"text_primary"} fontWeight={"600"} fontSize={"1rem"} lineHeight={"100%"}>
                    {cancelLabel}
                  </Text>
                </CustomButton>
                <CustomButton customStyle={{ w: "40%" }} onClick={handleConfirm} loading={Boolean(isLoading)}>
                  <Text color={"button_text"} fontWeight={"600"} fontSize={"1rem"} lineHeight={"100%"}>
                    {confirmLabel}
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

export default ConfirmActionModal;
