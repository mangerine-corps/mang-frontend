import { useMemo, useState } from "react";
import {
  Box,
  Button,
  CloseButton,
  Text,
  VStack,
  Flex,
  Image,
  Drawer,
  HStack,
  Icon,
  Badge,
  Avatar,
} from "@chakra-ui/react";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useGetFollowingQuery } from "mangarine/state/services/posts.service";




const MemberList = ({ open, onOpenChange, data }) => {
  const {user} = useAuth()
  const targetUserId = user?.id
    const { data:followingData, error , refetch} = useGetFollowingQuery(
      { targetUserId },
      {
        skip: !targetUserId,
      }
    );

    const canFollow = useMemo(
      () =>
        Boolean(user?.id) && Boolean(targetUserId) && user?.id !== targetUserId,
      [user?.id, targetUserId]
    );

 const isFollow = followingData?.data.isFollowing;
  const label = isFollow ? "Unfollow" : "Follow";
  console.log(label, isFollow, "member data");

  return (
    <Drawer.Root size={"lg"} open={open} onOpenChange={onOpenChange}>
      <Drawer.Backdrop />

      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>
              <VStack
                // spaceY={6}
                w="full"
                // bg="red.900"
                justifyContent={"flex-start"}
                alignItems={""}
                // px="4"
              ></VStack>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body px="6" py="6" pr="8">
            <Box
              //w="800px"
              //h="810px"

              // p={6}
              // maxW="600px"
              w="full"
            >
              <HStack justify="space-between" alignItems={"center"} mb={8}>
                <Text
                  font="outfit"
                  fontSize="2rem"
                  fontWeight="700"
                  lineHeight="60px"
                  color="text_primary"
                >
                  Members
                </Text>

                <CloseButton />
              </HStack>

              <VStack gap={8}>
                {data?.users.map((member, index) => (
                  <HStack
                    key={index}
                    align="start"
                    w="full"
                    justify="space-between"
                  >
                    <HStack gap={6} align="start">
                      <Avatar.Root
                        // transform="translateX(-150%)"

                        boxSize="40px"
                        rounded="full"
                      >
                        <Avatar.Fallback name={member.fullName} />
                        <Avatar.Image src={member.profilePics} />
                      </Avatar.Root>
                      {/* <Image src={member.profilePics} alt={member.name} /> */}
                      <Box>
                        <HStack>
                          <Text
                            font="outfit"
                            fontSize="1rem"
                            fontWeight="600"
                            lineHeight="24px"
                            color="text_primary"
                          >
                            {member.fullName}
                          </Text>
                          {member.id === data.creator.id && (
                            <Badge
                              // w="70px"
                              // h="40px"
                              borderRadius="2xl"
                              px="3"
                              py="2"
                              bg="orange.100"
                              color="orange.900"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              Admin
                            </Badge>
                          )}
                        </HStack>
                        <Text
                          font="outfit"
                          fontSize="1rem"
                          fontWeight="500"
                          lineHeight="24px"
                          color="gray.500"
                          mb={1}
                        >
                          {member.businessName}
                        </Text>
                        <Text
                          font="outfit"
                          fontSize="1rem"
                          fontWeight="400"
                          lineHeight="24px"
                          color="text_primary"
                        >
                          {member.bio}
                        </Text>
                      </Box>
                    </HStack>

                    <Button
                      // w="134px"
                      // h="48px"
                      borderRadius="8px"
                      px="4"
                      py="3"
                      gap="8"
                      color="bt_button"
                      size="sm"
                      variant={
                        ["Following", "Follow back"].includes(member.status)
                          ? "outline"
                          : "solid"
                      }
                      colorScheme="blue"
                      fontWeight="medium"
                    >
                     {
                      isFollow === true ? "Following" :"Follow Back"
                     }
                    </Button>
                  </HStack>
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
