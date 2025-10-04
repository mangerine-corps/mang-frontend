"use client";
import {
  Box,
  Drawer,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

import { useRouter } from "next/router";

import { meetingItems, meetingType } from "mangarine/utils/business";
import { menuData } from "mangarine/pages/my-business";

import ActivityEmptyState from "../../emptystate";
import BookingCalendar from "../../bookingcalender";
import WhoToFollow from "../../whotofollow";
import FollowingLists from "../../follow-list";
import CommunityLists from "../../communitylist";
import ActivityBox  from 'mangarine/components/ui-components/activitybox';
import { FaTimes } from "react-icons/fa";

const MenuList = ({
  open,
  onOpenChange,
  action,
}: {
  open: boolean;
  onOpenChange: () => void;
  action: (item: any) => void;
}) => {
  const [activity] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(false);
  const router = useRouter();
  const { tab = "wallet" } = router.query;

  return (
    <Drawer.Root
      size={"md"}
      open={open}
      onOpenChange={onOpenChange}
      placement={"end"}
    >
      <Drawer.Backdrop />
      <Drawer.Trigger></Drawer.Trigger>
      <Drawer.Positioner>
        <Drawer.Content
          bg="bg_box"
          p="3"
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
              <HStack onClick={onOpenChange} pt={4} pr="2"  alignItems={"flex-end"} justifyContent={"flex-end"} w="full">
                <FaTimes />
              </HStack>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body w="100%">
            <VStack
              w={{ base: "100%", md: "25%" }}
              h={{ base: "auto", md: "100vh" }}
              overflowY={{ base: "visible", md: "auto" }}
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
              overscrollX={"hidden"}
              // p={4}
              spaceY={6}
              pos={{ base: "relative", md: "sticky" }}
              top={{ base: "unset", md: 0 }}
              alignSelf="flex-start"
            >
              {!activity ? (
                <Box
                pt="8"
                  w={{ base: "95%", md: "99%", lg: "full", xl: "full" }}
                  mx={"auto"}
                  // bg="green.600"
                  onClick={() => {
                    setShowContent(true);
                  }}
                >
                  <ActivityBox />
                </Box>
              ) : (
                <Box
                  w={{ base: "95%", md: "99%", lg: "full", xl: "full" }}
                  mx={"auto"}
                  // bg="red.600"
                  onClick={() => {
                    setShowContent(false);
                  }}
                  cursor={"pointer"}
                >
                  {showContent ? <ActivityBox /> : <ActivityEmptyState />}
                </Box>
              )}
              <Stack w="full">
                  <BookingCalendar />
                  <WhoToFollow />
                  <Stack
                    flex={1.5}
                    display={{ base: "none", lg: "flex" }}
                    flexDir={{ lg: "column" }}
                    spaceY={"6"}
                    w="full"
                  >
                    <FollowingLists title="Prospective Following" />
                    <CommunityLists
                      type="trending"
                      url={"/trending"}
                      title={"Communities"}
                      width="100%"
                      filterJoined={false}
                    />
                  </Stack>
                </Stack>
            </VStack>
          </Drawer.Body>
          <Drawer.Footer></Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default MenuList;
