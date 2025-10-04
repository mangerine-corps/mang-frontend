import { FC, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useFollowUserMutation } from 'mangarine/state/services/posts.service';
import { useAuth } from 'mangarine/state/hooks/user.hook';
import { toaster } from '../ui/toaster';

interface StatsProps {
  followers: number;
  following: number;
  data: any;
}

export const StatsCard: FC<StatsProps> = ({ followers, following, data }) => {
  const [follow, setFollow] = useState(false);

  const [addFollower] = useFollowUserMutation();
  const { user } = useAuth();

  const handleFollow = () => {
    const { id: creatorId } = data?.creator || {};

    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    if (!creatorId) {
      console.error("No creatorId found in data");
      return;
    }

    addFollower({ targetUserId: creatorId })
      .unwrap()
      .then((result) => {
        const { isFollowing, message } = result;
        
        setFollow(isFollowing);
        toaster.create({
          description: message ?? (isFollowing ? message: "User unfollowed successfully"),
          type: isFollowing ? "success" : "error",
          closable: true,
        });
      })
      .catch((error) => {
        toaster.create({
          description: error.message,
          type:  "error",
          closable: true,
        });
        console.error("Error following/unfollowing creator:", error);
      });
  };

  return (
    <Box
      display="flex"
      padding="8px"
      alignItems="center"
      gap="8px"
      borderRadius="6px"
      bg="text_primary"
      boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
      w="fit-content"
    >
      <Text fontSize="0.875rem" fontWeight="500">
        <Text as="span" color="text_primary" fontWeight="600">
          {followers}
        </Text>
        <Text as="span" color="grey.500"> Followers</Text>
      </Text>
      <Text fontSize="0.875rem" fontWeight="500">
        <Text as="span" color="grey.500" fontWeight={100}> | </Text>
        <Text as="span" color="text_primary" fontWeight="600">
          {following}
        </Text>
        <Text as="span" color="grey.500"> Following</Text>
      </Text>
    </Box>
  );
};

const StatusCard: FC<StatsProps> = ({ data, followers, following }) => {
  // const {isOpen, onOpen, onClose} = useDisclosure()
  // const { isOpen:open, onOpen:openFollow, onClose:closeFollow } = useDisclosure();
  return (
    <Box
      display="flex"
      padding="8px"
      alignItems="center"
      gap="8px"
      borderRadius="6px"
      background="main_background"
      boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.10)"
      w="fit-content"
    >
      <Text
        // onClick={onOpen}
        cursor={"pointer"}
        fontSize="0.875rem"
        fontWeight="500"
        pr="2"
      >
        <Text as="span" color="grey.500" pr="1">
          {" "}
          {followers}
        </Text>
        <Text as="span" color="text_primary" fontWeight="600">
          Followers
        </Text>
      </Text>

      <Text
        // onClick={openFollow}
        cursor={"pointer"}
        fontSize="0.875rem"
        fontWeight="500"
        pr="2"
      >
        <Text as="span" color="grey.500" pr="1">
          {" "}
          {following}
        </Text>
        <Text as="span" color="text_primary" fontWeight="600">
          Following{" "}
        </Text>
      </Text>
    {/* <EditFollowerModal isOpen={isOpen} onClose={onClose} /> */}
      {/* <FollowingModal isOpen={open} onClose={closeFollow} /> */}
    </Box>
  );
};
export default StatusCard