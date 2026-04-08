import { CloseButton, Dialog, HStack, Portal, Text, VStack } from "@chakra-ui/react";
import CustomButton from "mangarine/components/customcomponents/button";

type Props = {
  isOpen: boolean;
  onOpenChange: () => void;
};

const UploadToPremiumModal = ({ isOpen, onOpenChange }: Props) => (
  <Dialog.Root lazyMount open={isOpen} onOpenChange={onOpenChange} placement="center" size="sm">
    <Portal>
      <Dialog.Backdrop css={{ position: "fixed", inset: 0, backdropFilter: "blur(4px)", zIndex: 2147483646 }} />
      <Dialog.Positioner style={{ zIndex: 2147483647 }}>
        <Dialog.Content p="8" rounded="xl" bg="bg_box">
          <Dialog.Body py={4} bg="bg_box">
            <VStack>
              <Text
                w="full"
                lineHeight="36px"
                fontSize="1.5rem"
                fontFamily="Outfit"
                color="text_primary"
                fontWeight="500"
              >
                Upgrade to Premium
              </Text>
              <Text
                w="full"
                py="1.5"
                fontSize={{ base: "0.875rem", md: "1rem" }}
                fontFamily="Outfit"
                color="text_primary"
                fontWeight="400"
              >
You&apos;ve reached the 4 image limit! Upgrade to premium to upload more images and unlock additional features.              </Text>
           
            </VStack>
          </Dialog.Body>
          <Dialog.Footer mx="auto" w="100%" py={4}>
            <HStack w="full" display="flex" alignItems="center" justifyContent="center" flexDir="row">
              <CustomButton
                customStyle={{ w: "50%", bg: "transparent", borderWidth: "2px" }}
                onClick={onOpenChange}
              >
                <Text color="text_primary" fontWeight="600" fontSize={{ base: "0.875rem", md: "1rem" }} lineHeight="100%">
Maybe Later                </Text>
              </CustomButton>
              <CustomButton customStyle={{ w: "50%" }} onClick={onOpenChange}>
                <Text color="button_text" fontWeight="600" fontSize={{ base: "0.875rem", md: "1rem" }} lineHeight="100%">
                  Upgrade
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

export default UploadToPremiumModal;
