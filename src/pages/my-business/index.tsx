"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import AppLayout from "mangarine/layouts/AppLayout";
import AccountSetting from "mangarine/components/ui-components/accountsetting";
import SecuritySetting from "mangarine/components/ui-components/securitysetting";
import ConsultationReveiwDrawer from "mangarine/components/ui-components/consultationreviewdrawer";
import MyWalletComponent from "mangarine/components/ui-components/mybusiness/mywalletcomp";
import MyMeetings from "mangarine/components/ui-components/meetings/TabPages/my_meeting";
import { accountItems, meetingItems, meetingType } from "mangarine/utils/business";
import Dashboard from "mangarine/components/ui-components/mybusiness/dashboard";
import MyAccounts from "mangarine/components/ui-components/myaccount/TabPages/my_account";
import { useRouter } from "next/router";
import MenuList from "mangarine/components/ui-components/mybusiness/menudrawer";
import { BiMenuAltLeft } from "react-icons/bi";
import ScheduleGroupConsultation from "mangarine/components/ui-components/mybusiness/modals/schedulegroupconsult";

export const menuData = [
  {
    id: "dashboard",
    text: "My Dashboard ",
    icon: "/icons/account1.svg",
    href: "/My Dashboard",
    iconBg: "/icons/right.svg",
  },
  {
    id: "meetings",
    text: "My Meeting",
    icon: "/icons/privacy.svg",
    href: "/",
    iconBg: "/icons/right.svg",
  },
  {
    id: "wallet",
    text: "My Wallet ",
    icon: "/icons/purplewallet.svg",
    href: "/wallet",
    iconBg: "/icons/right.svg",
  },
  {
    id: "myaccount",
    text: "My Account",
    icon: "/icons/payment1.svg",
    href: "/payment",
    iconBg: "/icons/right.svg",
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [open, setOpen] = useState<boolean>(false);
  const [activePage, setActivePage] = useState("availability_settings");
  const [feedbackActivePage, setfeedbackActivePage] = useState("feedback");
  const [showMenuList, setShowMenuList] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();
  const { tab = "dashboard" } = router.query;

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "meetings":
        return <MyMeetings page={activePage} />;
      case "wallet":
        return <MyWalletComponent />;
      case "myaccount":
        return <MyAccounts page={feedbackActivePage} />;
      //   return <Myccount />;
      // case "feedback":
      //   return <SecuritySetting />;

      default:
        return <Dashboard />;
    }
  };
  useEffect(() => {
    if (tab && typeof tab === "string") {
      setActiveTab(tab);
    }
  }, [tab]);
  useEffect(() => { }, [activePage, tab, feedbackActivePage]);
  const handleMobileTabChange = (activeTab) => {
    setActiveTab(activeTab.id);

    setShowMenuList(false);
  };
  return (
    <AppLayout>
      {/* <CancelSubscriptionModal /> */}
      <Box
        w="full"
        //marginTop="92px"
        borderRight="1px"
        borderBottom="1px"
        borderLeft="1px"
        // spaceX={"3"}
        pos="relative"
        overflow="hidden"
        // gap="1"
        display="flex"
        // bg="bg_box"
        borderRadius="lg"
        boxShadow="lg"
      >
        <Box
          w="full"
          flex={1.5}
          borderRight="1px"
          mr="3"
          borderColor="gray.200"
          display={{ base: "none", md: "none", lg: "flex", xl: "flex" }}
        >
          <Box
            as="nav"
            display="flex"
            flexDirection="column"
            w="full"
            //  w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
            h="full"
            // pb="2px"
            borderRadius="16px"
            boxShadow="sm"
            justifyContent="space-between"
            bg="main_background"
          //mt="14px"
          //px="16px"
          //py="16px"
          // gap="8px"
          >
            <VStack w="full" alignItems={"flex-start"}
              justifyContent={"flex-start"}>
              {menuData.map((item, index: number) => (
                <VStack
                  w="full"
                  key={index}

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
                    onClick={() => setActiveTab(item.id)}
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
                            <Image
                              src={item.icon}
                              alt={item.text}
                              boxSize="4"
                            />
                          </Stack>

                          <Text color="text_primary" fontSize="1.5rem">
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
                        {accountItems.map((item: meetingType) => (
                          <HStack
                            key={item.title}
                            // pos="relative"
                            // top="8"
                            w='full'
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
            </VStack>

            <Button
              bg="button_bg"
              w="90%"
              mx="auto"
              py="6" mb="10"
              justifySelf="flex-end"
              // m="4"
              // flex="1"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              <Text
                fontSize={"1.5rem"}
                fontFamily={"Outfit"}
                color={"button_text"}
                fontWeight={"400"}
              >
                +
              </Text>
              <Text
                fontSize={"1rem"}
                fontFamily={"Outfit"}
                color={"button_text"}
                fontWeight={"400"}
              >
                Create Group Session
              </Text>
            </Button>
          </Box>
        </Box>

        <Stack
          as="button"
          cursor={"pointer"}
          onClick={() => {
            setShowMenuList(true);
          }}
          display={{
            base: "flex",
            md: "flex",
            lg: "none",
            xl: "none",
          }}
          pos="absolute"
          left="0"
          top={"80"}
          bg="main_background"
          p="2"
          zIndex={1000}
          roundedRight="100%"
          color="text_primary"
          h="10"
          alignItems={"center"}
          justifyContent="center"
          w="8"
          borderWidth="2px"
          borderColor="button_border"
        >
          <BiMenuAltLeft />
        </Stack>
        <Box
          flex="3"
          overflow={"scroll"}
          maxH="100vh"
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
          {renderContent()}
        </Box>
        <MenuList
          action={handleMobileTabChange}
          open={showMenuList}
          onOpenChange={() => {
            setShowMenuList(false);
          }}
        />
        {open && (
          <ConsultationReveiwDrawer
            open={open}
            onOpenChange={() => {
              setOpen(false);
            }}
          />
        )}
        {openModal && (
          <ScheduleGroupConsultation
            isOpen={openModal}
            onOpenChange={() => {
              setOpenModal(false);
            }}
          />
        )}
      </Box>
    </AppLayout>
  );
};

export default Index;
