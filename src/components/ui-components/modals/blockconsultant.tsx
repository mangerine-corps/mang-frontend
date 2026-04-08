import {
  Button,
  CloseButton,
  Dialog,
  Flex,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useBlockUserMutation } from "mangarine/state/services/profile.service";
import { toaster } from "mangarine/components/ui/toaster";

type props = {
  onOpenChange: () => void;
  isOpen: boolean;
  data: any;
  checkmarkSrc?: any;
  onBlocked?: () => void;
};

const BlockConsultant = ({ onOpenChange, isOpen, data, onBlocked }: props) => {
  const [blockUser, { isLoading }] = useBlockUserMutation();

  const handleBlockUser = async () => {
    try {
      if (!data?.id) throw new Error("User ID is missing");
      await blockUser({ userId: data.id, reason: "Blocked from profile menu" }).unwrap();
      toaster.create({ description: `${data?.fullName ?? "User"} has been blocked.` });
      onOpenChange();
      onBlocked?.();
    } catch (err: any) {
      toaster.create({ description: err?.data?.message || err?.message || "Unable to block user." });
      onOpenChange();
    }
  };

  return (
    <Dialog.Root
      lazyMount
      open={isOpen}
      onOpenChange={(details) => { if (!details.open) onOpenChange(); }}
      placement="center"
      size="sm"
    >
      <Portal>
        <Dialog.Backdrop bg="rgba(15, 23, 42, 0.45)" />
        <Dialog.Positioner px={4}>
          <Dialog.Content maxW="360px" rounded="20px" bg="bg_box" px={8} py={6} boxShadow="0px 20px 60px rgba(15, 23, 42, 0.15)">
            <VStack gap={3} align="stretch">
              <Text
                fontSize="1.1rem"
                fontWeight="700"
                fontFamily="Outfit"
                color="text_primary"
              >
                Are you sure you want to block {data?.fullName}?
              </Text>

              <Text
                fontSize="0.875rem"
                color="grey.500"
                fontFamily="Outfit"
                pb={2}
              >
                You won&apos;t be able to see their profile or messages, and they won&apos;t be able to contact you.
              </Text>

              <Flex gap={3}>
                <Button
                  flex="1"
                  h="44px"
                  borderRadius="10px"
                  variant="outline"
                  borderColor="#B5B9C7"
                  color="text_primary"
                  fontSize="0.875rem"
                  fontWeight="600"
                  fontFamily="Outfit"
                  onClick={onOpenChange}
                >
                  No, Cancel
                </Button>
                <Button
                  flex="1"
                  h="44px"
                  borderRadius="10px"
                  bg="#111D4A"
                  color="white"
                  fontSize="0.875rem"
                  fontWeight="600"
                  fontFamily="Outfit"
                  _hover={{ bg: "#111D4A" }}
                  loading={isLoading}
                  onClick={handleBlockUser}
                >
                  Yes, block
                </Button>
              </Flex>
            </VStack>
            <Dialog.CloseTrigger asChild position="absolute" top={3} right={3}>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default BlockConsultant;
