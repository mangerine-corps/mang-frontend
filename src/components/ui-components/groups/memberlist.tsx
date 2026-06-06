import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  CloseButton,
  Text,
  VStack,
  Drawer,
  HStack,
  Badge,
  Avatar,
  Skeleton,
  SkeletonCircle,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useFollowUserMutation, useUnfollowUserMutation } from "mangarine/state/services/posts.service";

const MemberItem = ({ member, currentUserId, onNavigate }: { member: any; currentUserId?: string; onNavigate: () => void }) => {
  const router = useRouter();
  const [followUser, { isLoading: following }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: unfollowing }] = useUnfollowUserMutation();
  const [localFollowing, setLocalFollowing] = useState<boolean>(
    Boolean(member?.followStatus?.isFollowing)
  );

  useEffect(() => {
    setLocalFollowing(Boolean(member?.followStatus?.isFollowing));
  }, [member?.followStatus?.isFollowing]);

  const isLoading = following || unfollowing;
  const isSelf = member.id === currentUserId;

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSelf) return;
    const prev = localFollowing;
    setLocalFollowing(!prev);
    try {
      const mutation = prev
        ? unfollowUser({ targetUserId: member.id })
        : followUser({ targetUserId: member.id });
      const res = await mutation.unwrap();
      const next = (res as any)?.data?.isFollowing ?? res?.isFollowing ?? !prev;
      setLocalFollowing(Boolean(next));
    } catch {
      setLocalFollowing(prev);
    }
  };

  return (
    <HStack align="start" w="full" justify="space-between">
      <HStack
        gap={6}
        align="start"
        cursor="pointer"
        _hover={{ opacity: 0.8 }}
        onClick={() => {
          if (member.id) {
            onNavigate();
            router.push(`/profile/${member.id}`);
          }
        }}
      >
        <Avatar.Root boxSize="40px" rounded="full">
          <Avatar.Fallback name={member.fullName} />
          <Avatar.Image src={member.profilePics} />
        </Avatar.Root>
        <Box>
          <HStack>
            <Text font="outfit" fontSize="1rem" fontWeight="600" lineHeight="24px" color="text_primary">
              {member.fullName}
            </Text>
          </HStack>
          <Text font="outfit" fontSize="1rem" fontWeight="500" lineHeight="24px" color="gray.500" mb={1}>
            {member.businessName}
          </Text>
          <Text font="outfit" fontSize="1rem" fontWeight="400" lineHeight="24px" color="text_primary">
            {member.bio}
          </Text>
        </Box>
      </HStack>

      {!isSelf && (
        <Button
          borderRadius="8px"
          px="4"
          py="3"
          size="sm"
          variant="outline"
          bg="transparent"
          color={localFollowing ? "red.500" : "primary.950"}
          borderColor={localFollowing ? "red.400" : "primary.950"}
          borderWidth="2px"
          fontWeight="medium"
          flexShrink={0}
          onClick={handleToggle}
          disabled={isLoading}
        >
          {isLoading ? <Spinner size="xs" /> : localFollowing ? "Unfollow" : "Follow +"}
        </Button>
      )}
    </HStack>
  );
};

const MemberList = ({ open, onOpenChange, data }) => {
  const { user } = useAuth();

  return (
    <Drawer.Root size="lg" open={open} onOpenChange={onOpenChange}>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title />
          </Drawer.Header>
          <Drawer.Body px="6" py="6" pr="8">
            <Box w="full">
              <HStack justify="space-between" alignItems="center" mb={8}>
                <Text font="outfit" fontSize="2rem" fontWeight="700" lineHeight="60px" color="text_primary">
                  Members
                </Text>
                <CloseButton />
              </HStack>

              <VStack gap={8}>
                {(data?.users ?? []).map((member: any) => (
                  <MemberItem
                    key={member.id}
                    member={member}
                    currentUserId={user?.id}
                    onNavigate={() => onOpenChange(false)}
                  />
                ))}
              </VStack>
            </Box>
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default MemberList;
