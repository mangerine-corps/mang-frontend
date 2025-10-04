"use client";;
import { Box, Drawer, HStack, Icon, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { useRouter } from "next/router";
import SearchInput from "mangarine/components/ui/search-input";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import { ConversationItem } from "mangarine/pages/message";

const ChatList = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) => {
  const router = useRouter();
  const [search] = useState("");

  const { conversations } = useAppointment()

  return (
    <Drawer.Root
      size={"md"}
      open={open}
      onOpenChange={onOpenChange}
      placement={"start"}
    >
      <Drawer.Backdrop />
      <Drawer.Trigger></Drawer.Trigger>
      <Drawer.Positioner>
        <Drawer.Content
          bg="bg_box"
          p="3"
          zIndex={"max"}
          // display={{ base: "flex", md: "flex", lg: "flex", xl: "none" }}
          css={{
            "&::-webkit-scrollbar": {
              width: "0px",
              height: "0px",
            },
            "&::-webkit-scrollbar-track": {
              width: "0px",
              background: "transparent",
              height: "0px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "transparent",
              borderRadius: "0px",
              maxHeight: "0px",
              height: "0px",
              width: 0,
            },
          }}
        >
          <Drawer.Header>
            <Drawer.Title>
              <HStack pt={6} gap={3}>
                {/* <Box
                  cursor="pointer"
                  // onClick={() => {
                  //   setShowDrawer(true);
                  // }}
                  bg="bg_box"
                  py="4"
                  px="4"
                  rounded="md"
                >
                  <Image
                    src="/icons/plus.svg"
                    alt="New Message"
                    // boxSize="4"
                  />
                </Box> */}
                <Box bg="main_background" rounded="md" flex="1">
                  <SearchInput
                    // label="Email Address"
                    placeholder="search messages"
                    id="search"
                    // required={true}
                    name="search"
                    value={search}
                    size="lg"
                    onChange={() => { }}
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
              </HStack>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body w="100%" css={{
            "&::-webkit-scrollbar": {
              width: "0px",
              height: "0px",
            },
            "&::-webkit-scrollbar-track": {
              width: "0px",
              background: "transparent",
              height: "0px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "transparent",
              borderRadius: "0px",
              maxHeight: "0px",
              height: "0px",
              width: 0,
            },
          }}>
            <VStack gap={3} align="stretch"
            >
              {conversations.map((chat, index) => (
                <ConversationItem key={chat.id} conversation={chat} />
              ))}
            </VStack>
          </Drawer.Body>
          <Drawer.Footer></Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default ChatList;
