"use client";;
import { Box, Drawer, Flex, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";

import { useRouter } from "next/router";

import { meetingItems, meetingType } from "mangarine/utils/business";
import { menuData } from 'mangarine/pages/my-business';

const MenuList = ({
  open,
  onOpenChange,
  action,

}: {
  open: boolean;
  onOpenChange: () => void;
  action: (item: any) => void;
 
}) => {
  const [search] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [Open, setOpen] = useState<boolean>(false);
  const [showMenuList, setShowMenuList] = useState<boolean>(false);
  const [activePage, setActivePage] = useState("availability_settings");
  const [feedbackActivePage, setfeedbackActivePage] = useState("feedback");

  const router = useRouter();
  const { tab = "wallet" } = router.query;

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
              <HStack pt={6} gap={3}></HStack>-
            </Drawer.Title>
          </Drawer.Header>
          <Drawer.Body w="100%">
            {menuData.map((item, index: number) => (
              <VStack
                key={index}
                alignItems={"flex-start"}
                justifyContent={"flex-start"}
                // bg="red.700"
              >
                <Flex
                  key={item.id}
                  width={activeTab === item.id ? "95%" : "full"}
                  mx="auto"
                  align="center"
                  justify="space-between"
                  p="4"
                  roundedTopLeft={activeTab === item.id ? "lg" : "none"}
                  roundedBottomLeft={activeTab === item.id ? "lg" : "none"}
                  borderLeftWidth={activeTab === item.id ? "4px" : "0px"}
                  borderLeftColor={
                    activeTab === item.id ? "gray.500" : "transparent"
                  }
                  backgroundColor={
                    activeTab === item.id ? "gray.100" : "transparent"
                  }
                  mt={activeTab === item.id ? "2" : "0"}
                  color={activeTab === item.id ? "gray.900" : "gray.700"}
                  _hover={{ backgroundColor: "gray.50" }}
                  onClick={() => action(item)}
                  cursor="pointer"
                >
                  <Flex align="center">
                    <VStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                    >
                      <HStack>
                        <Stack
                          h="10"
                          w="10"
                          marginRight={4}
                          rounded="full"
                          alignItems={"center"}
                          justifyContent={"center"}
                          bg="#F71AFC14"
                        >
                          <Image src={item.icon} alt={item.text} boxSize="4" />
                        </Stack>

                        <Text color="text_primary" fontSize={{base:"1rem",md:"1.2rem",lg:"1.5rem"}}>
                          {item.text}
                        </Text>
                      </HStack>
                    </VStack>
                  </Flex>
                  <Image src={item.iconBg} alt="arrow" />
                </Flex>
                {activeTab === item.id &&
                  item.id === "myaccount" &&
                  item.text === "My Account" && (
                    <VStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                      ml="3rem"
                      bg="grey.500"
                      h="24"
                      w="0.5"
                      // bg="red.900"

                      // pb="20"
                      pos="relative"
                    >
                      {/* <Box h="0" w="0.5"></Box> */}
                      <HStack
                        pos="absolute"
                        top="8"
                        onClick={() => {
                          setOpen(true);
                        }}
                      >
                        {" "}
                        <Box w="12" h="0.5" bg="grey.500"></Box>
                        <Text
                          color="text_primary"
                          _hover={{ color: "grey.300" }}
                        >
                          Feedback/Review
                        </Text>
                      </HStack>
                      <HStack
                        pos="absolute"
                        bottom="-2.5"
                        p="0"
                        m="0"
                        onClick={() => {
                          setfeedbackActivePage("payment");
                        }}
                      >
                        {" "}
                        <Box w="20" h="0.5" bg="grey.500"></Box>
                        <Text
                          color="text_primary"
                          w="full"
                          textWrap={"nowrap"}
                          _hover={{ color: "grey.300" }}
                        >
                          Payment Settings
                        </Text>
                      </HStack>
                    </VStack>
                  )}
                {activeTab === item.id &&
                  item.id === "meetings" &&
                  item.text === "My Meeting" && (
                    <VStack
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                      ml="2rem"
                      gap={0}
                      borderColor={"grey.400"}
                      // borderBottomWidth={2}
                      // mb="6"
                      h={"full"}
                      // bg="grey.500"
                      // bg="red.900"

                      // pb="20"
                      pos="relative"
                    >
                      {meetingItems.map((item: meetingType) => (
                        <HStack
                          key={item.title}
                          pos="relative"
                          // top="8"
                          pt={3}
                          m={0}
                          cursor={"pointer"}
                          onClick={() => setActivePage(item.title)}
                          // bg={'red.500'}
                          borderLeftWidth={2}
                          borderColor={"grey.400"}
                          flex={1}
                          width={"full"}
                        >
                          <Box w="12" h="0.5" bg="grey.500"></Box>

                          <Text
                            color={
                              activePage === item.title
                                ? "gray.400"
                                : "text_primary"
                            }
                            _hover={{ color: "grey.300" }}
                          >
                            {item.text}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  )}
              </VStack>
            ))}
           
          </Drawer.Body>
          <Drawer.Footer></Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default MenuList;
