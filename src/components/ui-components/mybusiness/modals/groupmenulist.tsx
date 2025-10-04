"use client";
import {
  Box,
  Button,
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


import { FaTimes } from "react-icons/fa";
import SuggestedCommunities from "../../suggestedcommunities";
import Rules from "../../rules";
import TrendingCommunities from "../../trendingcommunities";

const MenuList = ({
  open,
  onOpenChange,
  action,
  showPost
}: {
  open: boolean;
  onOpenChange: () => void;
  action: (item: any) => void;
  showPost: boolean;
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
              <HStack
                onClick={onOpenChange}
                py={4}
                pr="2"
                alignItems={"flex-end"}
                justifyContent={"flex-end"}
                w="full"
              >
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
              {/* <Button
                w="full"
                bg="button_bg"
                onClick={() => router.push("/groups/create")}
              >
                <Text color="button_text" fontWeight="600">
                  Create Group
                </Text>
              </Button> */}

              {!showPost ? <SuggestedCommunities /> : <Rules rules="" />}
              <TrendingCommunities />
            </VStack>
          </Drawer.Body>
          <Drawer.Footer></Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default MenuList;
