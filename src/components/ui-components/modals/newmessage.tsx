import { useState } from "react";
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
} from "@chakra-ui/react";

import NewMessageItem from "../newmessageitem";
import SearchInput from "mangarine/components/ui/search-input";

const friends = [
  {
    id: "1",
    name: "Jacob Jones",
    role: "Web Designer",
    avatar: "/images/invite1.png",
  },
  {
    id: "2",
    name: "Cameron Williamson",
    role: "Marketing Coordinator",
    avatar: "/images/invite2.png",
  },
  {
    id: "3",
    name: "Kathryn Murphy",
    role: "Nursing Assistant",
    avatar: "/images/invite3.png",
  },
  {
    id: "4",
    name: "Robert Fox",
    role: "Medical Assistant",
    avatar: "/images/invite4.png",
  },
  {
    id: "5",
    name: "Robert Fox",
    role: "Medical Assistant",
    avatar: "/images/invite4.png",
  },
];

const FriendBox = ({
  friend,
  selected,
  onSelect,
}: {
  friend: (typeof friends)[number];
  selected: boolean;
  onSelect: () => void;
}) => (
  <Flex
    w="full"
    cursor="pointer"
    position="relative"
    py={3}
    px={2}
    onClick={onSelect}
    _hover={{ bg: "gray.50" }}
    alignItems="center"
  >
    <Image alt='friend-avatar' src={friend.avatar} sizes="md" mr={3} />
    <Box flex="1">
      <Text
        color="text_primary"
        font="outfit"
        fontSize="1.25rem"
        lineHeight="30px"
        fontWeight="600"
      >
        {friend.name}
      </Text>
      <Text
        fontSize="sm"
        font="outfit"
        lineHeight="30px"
        fontWeight="400"
        color="gray.600"
      >
        {friend.role}
      </Text>
    </Box>

    <Box
      boxSize={5}
      borderRadius="full"
      borderWidth="2px"
      borderColor={selected ? "blue.600" : "gray.300"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg={selected ? "blue.600" : "transparent"}
    >
      {selected && <Box boxSize={2} bg="white" borderRadius="full" />}
    </Box>
  </Flex>
);

const NewMessageDrawer = ({ open, onOpenChange }) => {
  const [selectedFriend, setSelectedFriend] = useState<string>("");

  return (
    <Drawer.Root size={"sm"} open={open} onOpenChange={onOpenChange}>
      <Drawer.Backdrop />
      <Drawer.Trigger></Drawer.Trigger>
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
              >
                {/* <HStack w="full" py={4} px="3" justifyContent={"space-between"}>
                  <Text
                    fontWeight={700}
                    fontSize={"2rem"}
                    fontFamily={"Outfit"}
                    color={"text_primary"}
                    // textAlign={"start"}
                  >
                    Add Work
                  </Text>
                  <HStack spaceX={4}>
                    <Box
                      border={0.5}
                      rounded={4}
                      py={2}
                      px="2"
                      onClick={onOpenChange}
                      borderColor={"gray.150"}
                      shadow={"md"}
                    >
                      <Text
                        color="text_primary"
                        fontSize={"0.8rem"}
                        fontWeight={"400"}
                      >
                        <FaTimes />
                      </Text>
                    </Box>
                  </HStack>
                </HStack> */}
              </VStack>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body px="3" py="8">
            <Text
              font="outfit"
              fontSize="1.5rem"
              fontWeight="700"
              // lineHeight="60px"
              color="text_primary"
              pb={4}
            >
          New Message
            </Text>

            <VStack
              spaceY={6}
              w="full"
              h="full"
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
              overflowY={"scroll"}
            >
              <Box w="full">
                {/* Close Button */}
                {/* <CloseButton
                  position="absolute"
                  w="48px"
                  h="48px"
                  p="10px"
                  gap="10px"
                  display="flex"
                  justifyContent={"center"}
                  alignItems={"center"}
                  top={4}
                  right={4}
                  ml={40}
                /> */}

                {/* Header */}
                {/* <Box mb={6}>
                  <Text
                    font="outfit"
                    fontSize="2.5rem"
                    fontWeight="700"
                    lineHeight="60px"
                    color="text_primary"
                    mb={1}
                  >
                    Invite Friend
                  </Text>
                </Box> */}

                <Box w="full" py="6">
                  <SearchInput
                    // label="Email Address"
                    placeholder="search"
                    id="search"
                    // required={true}
                    name="search"
                    value={""}
                    size="md"
                    onChange={() => {}}
                    // error={errors.email}
                    hasLeftIcon={true}
                    type={"text"}
                    leftIcon={
                      <Icon pl={"4"} pr="8">
                        <Image src="/Icons/searchSvg.svg" alt="search" />
                      </Icon>
                    }
                  />
                </Box>

                {/* Friends List */}
                <VStack>
                  {friends.map((friend) => (
                    <FriendBox
                      key={friend.id}
                      friend={friend}
                      selected={selectedFriend === friend.id}
                      onSelect={() => setSelectedFriend(friend.id)}
                    />
                  ))}
                </VStack>

                {/* Invite Button */}
              </Box>

              <HStack
                w="full"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <HStack w="100%" display={"flex"} flexDir={"row"} spaceX={6}>
                  <Button
                    w="full"
                    py="6"
                    // h="py="4"48px"
                    borderRadius="8px"
                    bg="gray.500"
                    color="white"
                    _hover={{ bg: "gray.600" }}
                    // isDisabled={!selectedFriend}
                  >
                Message
                  </Button>
                </HStack>
              </HStack>
            </VStack>
          </Drawer.Body>
          <Drawer.Footer />
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default NewMessageDrawer;
