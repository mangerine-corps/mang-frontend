import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { useUnblockUserMutation } from 'mangarine/state/services/profile.service';
import { toaster } from '../ui/toaster';

type props = {
  title?: string;
  details?: string;
  onClick?: any;
  buttonText?: string;
  info: any;
  onUnblocked?: () => void;
};

export const BlockedComp = ({ info, onUnblocked }: props) => {
  const [unblockUser, { isLoading }] = useUnblockUserMutation();

  const handleUnblock = async () => {
    try {
      if (!info?.id) throw new Error("User ID is missing");
      await unblockUser({ userId: info.id, reason: "unBlocked from profile menu" }).unwrap();
      toaster.create({ description: `${info?.fullName ?? "User"} has been unblocked.` });
      onUnblocked?.();
    } catch (err: any) {
      toaster.create({ description: err?.data?.message || err?.message || "Unable to unblock user." });
    }
  };

  return (
    <VStack gap={6} align="center" py={12} w="full">
      <VStack gap={2} align="center" maxW="360px">
        <Text
          textAlign="center"
          fontSize={{ base: "1.3rem", lg: "1.5rem" }}
          fontFamily="Outfit"
          color="text_primary"
          fontWeight="700"
        >
          You have blocked this User
        </Text>
        <Text
          textAlign="center"
          fontSize="0.9rem"
          fontFamily="Outfit"
          color="grey.500"
          fontWeight="400"
        >
          This user has been blocked by you. Unblock to view their content
        </Text>
      </VStack>

      <Button
        bg="button_bg"
        color="button_text"
        px={10}
        h="44px"
        borderRadius="10px"
        fontSize="0.875rem"
        fontWeight="600"
        fontFamily="Outfit"
        _hover={{ opacity: 0.85 }}
        loading={isLoading}
        onClick={handleUnblock}
      >
        Unblock
      </Button>
    </VStack>
  );
};
