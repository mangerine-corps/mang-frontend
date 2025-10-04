"use client";
import {
  Box,
  Drawer,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { use, useState } from "react";

import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import { HiOutlineLogout } from "react-icons/hi";
import { SlSettings } from "react-icons/sl";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { signOut } from "mangarine/state/reducers/auth.reducer";

const SideBar = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const logOut = () => {
    dispatch(signOut());
  };
  return (
    <Drawer.Root
      size={"sm"}
      open={open}
      onOpenChange={onOpenChange}
      placement={"start"}
    >
      <Drawer.Backdrop />
      <Drawer.Trigger></Drawer.Trigger>
      <Drawer.Positioner>
        <Drawer.Content
          bg="bg_box"
          p="8"
          display={{ base: "flex", md: "flex", lg: "flex", xl: "none" }}
        >
          <Drawer.Header>
            <Drawer.Title>
              <HStack
                alignItems={"center"}
                pb="8"
                justifyContent="space-between"
                w="full"
              >
                <Stack
                  as={"button"}
                  onClick={onOpenChange}
                  //   mr="6"
                  cursor={"pointer"}
                >
                  <Image
                    w={{ base: "12", md: "16" }}
                    src="/images/logo.svg"
                    alt="logo"
                  />
                </Stack>
                <Icon
                  as="button"
                  cursor={"pointer"}
                  color="text_primary"
                  onClick={() => {
                    router.push("/settings");
                  }}
                >
                  <SlSettings size={20} />
                </Icon>
              </HStack>
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body w="100%">
            <VStack
              bg={{ base: "bg_box", md: "transparent" }}
              spaceY={{base:"2",md:"4"}}
              w="full"
            >
              <Biocard />

              <DashboardCard />
            </VStack>
            <HStack
              alignItems={"center"}
              pt="24"
              justifyContent="flex-start"
              w="full"
              cursor={"pointer"}
              onClick={logOut}
            >
              <Icon color="red.600">
                <HiOutlineLogout size={20} />
              </Icon>
              <Text color="text_primary">Logout</Text>
            </HStack>
          </Drawer.Body>
          <Drawer.Footer></Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default SideBar;
