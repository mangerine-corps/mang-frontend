import {
  Box,
  Button,
  Dialog,
  Flex,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdNotifications } from "react-icons/md";
import { toaster } from "mangarine/components/ui/toaster";

type NotificationPreference =
  | "all-updates"
  | "new-posts"
  | "new-group-consultation"
  | "";

type ConsultantNotificationModalProps = {
  isOpen: boolean;
  onOpenChange: () => void;
  value: NotificationPreference;
  onSave: (value: NotificationPreference) => void;
};

const notificationOptions: Array<{
  label: string;
  value: Exclude<NotificationPreference, "">;
}> = [
  { label: "All updates", value: "all-updates" },
  { label: "New posts", value: "new-posts" },
  { label: "New group consultation", value: "new-group-consultation" },
];

const ConsultantNotificationModal = ({
  isOpen,
  onOpenChange,
  value,
  onSave,
}: ConsultantNotificationModalProps) => {
  const [draftValue, setDraftValue] = useState<NotificationPreference>(value);

  useEffect(() => {
    if (isOpen) setDraftValue(value);
  }, [isOpen, value]);

  const handleSave = () => {
    if (!draftValue) {
      toaster.create({ description: "Select a notification option to continue." });
      return;
    }
    onSave(draftValue);
    toaster.create({ description: "Notification preferences updated." });
    onOpenChange();
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
          <Dialog.Content
            maxW="360px"
            rounded="20px"
            bg="bg_box"
            boxShadow="0px 20px 60px rgba(15, 23, 42, 0.15)"
            p={6}
          >
            <VStack align="stretch" gap={5}>
              {/* Header */}
              <VStack gap={3}>
                <Flex
                  h="56px"
                  w="56px"
                  borderRadius="full"
                  bg="#F5F7FB"
                  align="center"
                  justify="center"
                >
                  <Box color="#111D4A">
                    <MdNotifications size={28} />
                  </Box>
                </Flex>

                <VStack gap={0.5}>
                  <Text
                    textAlign="center"
                    fontSize="1.1rem"
                    fontWeight="700"
                    fontFamily="Outfit"
                    color="text_primary"
                  >
                    Turn on notifications
                  </Text>
                  <Text
                    textAlign="center"
                    fontSize="0.8rem"
                    color="grey.500"
                    fontFamily="Outfit"
                  >
                    Choose what to be notified about
                  </Text>
                </VStack>
              </VStack>

              {/* Options */}
              <VStack align="stretch" gap={3}>
                {notificationOptions.map((option) => {
                  const isSelected = draftValue === option.value;
                  return (
                    <Flex
                      as="button"
                      key={option.value}
                      align="center"
                      gap={3}
                      cursor="pointer"
                      onClick={() => setDraftValue(option.value)}
                    >
                      <Flex
                        h="18px"
                        w="18px"
                        borderRadius="full"
                        border="1.5px solid #C8CEDF"
                        align="center"
                        justify="center"
                        flexShrink={0}
                      >
                        {isSelected && (
                          <Box h="8px" w="8px" borderRadius="full" bg="#111D4A" />
                        )}
                      </Flex>
                      <Text
                        fontSize="0.875rem"
                        fontWeight="400"
                        color="text_primary"
                        fontFamily="Outfit"
                      >
                        {option.label}
                      </Text>
                    </Flex>
                  );
                })}
              </VStack>

              {/* Buttons */}
              <Flex gap={3}>
                <Button
                  flex="1"
                  h="40px"
                  borderRadius="10px"
                  variant="outline"
                  borderColor="#B5B9C7"
                  color="text_primary"
                  fontSize="0.875rem"
                  fontWeight="600"
                  fontFamily="Outfit"
                  onClick={onOpenChange}
                >
                  Cancel
                </Button>
                <Button
                  flex="1"
                  h="40px"
                  borderRadius="10px"
                  bg="#111D4A"
                  color="white"
                  fontSize="0.875rem"
                  fontWeight="600"
                  fontFamily="Outfit"
                  _hover={{ bg: "#111D4A" }}
                  onClick={handleSave}
                >
                  Save
                </Button>
              </Flex>
            </VStack>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default ConsultantNotificationModal;
