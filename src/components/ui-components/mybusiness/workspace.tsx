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
import { BiMenuAltLeft } from "react-icons/bi";
import { useRouter } from "next/router";
import MyAccounts from "mangarine/components/ui-components/myaccount/TabPages/my_account";
import MyMeetings from "mangarine/components/ui-components/meetings/TabPages/my_meeting";
import Dashboard from "mangarine/components/ui-components/mybusiness/dashboard";
import MenuList from "mangarine/components/ui-components/mybusiness/menudrawer";
import ScheduleGroupConsultation from "mangarine/components/ui-components/mybusiness/modals/schedulegroupconsult";
import MyWalletComponent from "mangarine/components/ui-components/mybusiness/mywalletcomp";
import {
  menuData,
  type BusinessMenuItem,
} from "mangarine/components/ui-components/mybusiness/menu-data";
import { accountItems, meetingItems, meetingType } from "mangarine/utils/business";

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px", height: "0px" },
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
};

const MyBusinessWorkspace = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activePage, setActivePage] = useState("availability_settings");
  const [feedbackActivePage, setFeedbackActivePage] = useState("feedback");
  const [showMenuList, setShowMenuList] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const router = useRouter();
  const { tab = "dashboard" } = router.query;

  const syncTabQuery = (nextTab: string) => {
    setActiveTab(nextTab);
    router.replace(
      {
        pathname: "/my-business/dashboard",
        query: nextTab === "dashboard" ? {} : { tab: nextTab },
      },
      undefined,
      { shallow: true }
    );
  };

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
      default:
        return <Dashboard />;
    }
  };

  useEffect(() => {
    if (tab && typeof tab === "string") {
      setActiveTab(tab);
      return;
    }

    setActiveTab("dashboard");
  }, [tab]);

  const handleMobileTabChange = (item: BusinessMenuItem) => {
    syncTabQuery(item.id);
    setShowMenuList(false);
  };

  return (
    <Box
      w="full"
      borderRight="1px"
      borderBottom="1px"
      borderLeft="1px"
      pos="relative"
      overflow="hidden"
      display="flex"
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
          h="full"
          borderRadius="16px"
          boxShadow="sm"
          justifyContent="space-between"
          bg="main_background"
        >
          <VStack w="full" alignItems="flex-start" justifyContent="flex-start">
            {menuData.map((item, index: number) => (
              <VStack w="full" key={index}>
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
                  onClick={() => syncTabQuery(item.id)}
                  cursor="pointer"
                >
                  <Flex align="center">
                    <VStack alignItems="flex-start" justifyContent="flex-start">
                      <HStack>
                        <Stack
                          h="10"
                          w="10"
                          marginRight={4}
                          rounded="full"
                          alignItems="center"
                          justifyContent="center"
                          bg="#F71AFC14"
                        >
                          <Image src={item.icon} alt={item.text} boxSize="4" />
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
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      ml="2rem"
                      gap={0}
                      borderColor="grey.400"
                      h="full"
                      pos="relative"
                    >
                      {accountItems.map((accountItem: meetingType) => (
                        <HStack
                          key={accountItem.title}
                          w="full"
                          pt={3}
                          m={0}
                          cursor="pointer"
                          onClick={() =>
                            setFeedbackActivePage(accountItem.title)
                          }
                          borderLeftWidth={2}
                          borderColor="grey.400"
                          flex={1}
                        >
                          <Box w="12" h="0.5" bg="grey.500" />

                          <Text
                            color={
                              feedbackActivePage === accountItem.title
                                ? "gray.400"
                                : "text_primary"
                            }
                            _hover={{ color: "grey.300" }}
                          >
                            {accountItem.text}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  )}

                {activeTab === item.id &&
                  item.id === "meetings" &&
                  item.text === "My Meeting" && (
                    <VStack
                      alignItems="flex-start"
                      justifyContent="flex-start"
                      ml="2rem"
                      gap={0}
                      borderColor="grey.400"
                      h="full"
                      pos="relative"
                    >
                      {meetingItems.map((meetingItem: meetingType) => (
                        <HStack
                          key={meetingItem.title}
                          pt={3}
                          m={0}
                          cursor="pointer"
                          onClick={() => setActivePage(meetingItem.title)}
                          borderLeftWidth={2}
                          borderColor="grey.400"
                          flex={1}
                          width="full"
                        >
                          <Box w="12" h="0.5" bg="grey.500" />

                          <Text
                            color={
                              activePage === meetingItem.title
                                ? "gray.400"
                                : "text_primary"
                            }
                            _hover={{ color: "grey.300" }}
                          >
                            {meetingItem.text}
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
            py="6"
            mb="10"
            justifySelf="flex-end"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <Text
              fontSize="1.5rem"
              fontFamily="Outfit"
              color="button_text"
              fontWeight="400"
            >
              +
            </Text>
            <Text
              fontSize="1rem"
              fontFamily="Outfit"
              color="button_text"
              fontWeight="400"
            >
              Create Group Session
            </Text>
          </Button>
        </Box>
      </Box>

      <Stack
        as="button"
        cursor="pointer"
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
        top="80"
        bg="main_background"
        p="2"
        zIndex={1000}
        roundedRight="100%"
        color="text_primary"
        h="10"
        alignItems="center"
        justifyContent="center"
        w="8"
        borderWidth="2px"
        borderColor="button_border"
      >
        <BiMenuAltLeft />
      </Stack>

      <Box flex="3" overflow="scroll" maxH="100vh" css={noScrollbar}>
        {renderContent()}
      </Box>

      <MenuList
        action={handleMobileTabChange}
        open={showMenuList}
        onOpenChange={() => {
          setShowMenuList(false);
        }}
      />

      {openModal && (
        <ScheduleGroupConsultation
          isOpen={openModal}
          onOpenChange={() => {
            setOpenModal(false);
          }}
        />
      )}
    </Box>
  );
};

export default MyBusinessWorkspace;
