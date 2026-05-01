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
import { LuChevronRight, LuChevronDown } from "react-icons/lu";
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
  "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
  "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", maxHeight: "0px", height: "0px", width: 0 },
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
      case "dashboard":   return <Dashboard />;
      case "meetings":    return <MyMeetings page={activePage} />;
      case "wallet":      return <MyWalletComponent />;
      case "myaccount":   return <MyAccounts page={feedbackActivePage} />;
      default:            return <Dashboard />;
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
      display="flex"
      borderRadius="lg"
      boxShadow="lg"
      minH="100vh"
      overflow="visible"
    >
      {/* ── Sidebar ── */}
      <Box
        flexShrink={0}
        w={{ lg: "260px", xl: "280px" }}
        borderRight="1px"
        borderColor="gray.200"
        display={{ base: "none", md: "none", lg: "flex", xl: "flex" }}
        flexDirection="column"
      >
        <Box
          as="nav"
          display="flex"
          flexDirection="column"
          w="full"
          h="full"
          borderRadius="16px"
          justifyContent="space-between"
          bg="main_background"
        >
          <VStack w="full" alignItems="flex-start" justifyContent="flex-start" pt={2}>
            {menuData.map((item, index: number) => {
              const isActive = activeTab === item.id;
              const hasSubs = item.id === "meetings" || item.id === "myaccount";

              return (
                <VStack w="full" key={index} gap={0}>
                  {/* Main menu item */}
                  <Flex
                    w="full"
                    align="center"
                    justify="space-between"
                    px={4}
                    py={3}
                    borderLeftWidth={isActive ? "4px" : "0px"}
                    borderLeftColor={isActive ? "primary.950" : "transparent"}
                    backgroundColor={isActive ? "gray.100" : "transparent"}
                    color={isActive ? "gray.900" : "gray.700"}
                    _hover={{ backgroundColor: "gray.50" }}
                    onClick={() => syncTabQuery(item.id)}
                    cursor="pointer"
                    transition="all 0.15s"
                  >
                    <HStack gap={3}>
                      <Stack
                        h="9"
                        w="9"
                        rounded="full"
                        alignItems="center"
                        justifyContent="center"
                        bg="#F71AFC14"
                        flexShrink={0}
                      >
                        <Image src={item.icon} alt={item.text} boxSize="4" />
                      </Stack>
                      <Text color="text_primary" fontSize="1rem" fontWeight="500">
                        {item.text}
                      </Text>
                    </HStack>

                    {hasSubs ? (
                      isActive ? <LuChevronDown size={16} color="#666" /> : <LuChevronRight size={16} color="#666" />
                    ) : (
                      <LuChevronRight size={16} color="#666" />
                    )}
                  </Flex>

                  {/* Sub-items for My Meeting */}
                  {isActive && item.id === "meetings" && (
                    <VStack alignItems="flex-start" w="full" gap={0} ml="44px">
                      {meetingItems.map((sub: meetingType, i: number) => {
                        const isLast = i === meetingItems.length - 1;
                        return (
                          <HStack
                            key={sub.title}
                            w="full"
                            py={2}
                            cursor="pointer"
                            onClick={() => setActivePage(sub.title)}
                            gap={0}
                            position="relative"
                          >
                            {/* vertical segment — full height except last item stops at midpoint */}
                            <Box
                              position="absolute"
                              left="0"
                              top="0"
                              bottom={isLast ? "50%" : "0"}
                              w="2px"
                              bg="gray.300"
                            />
                            {/* horizontal connector */}
                            <Box w="16px" h="2px" bg="gray.300" flexShrink={0} />
                            <Text
                              ml={2}
                              fontSize="0.875rem"
                              fontWeight={activePage === sub.title ? "600" : "400"}
                              color={activePage === sub.title ? "text_primary" : "gray.500"}
                              _hover={{ color: "text_primary" }}
                            >
                              {sub.text}
                            </Text>
                          </HStack>
                        );
                      })}
                    </VStack>
                  )}

                  {/* Sub-items for My Account */}
                  {isActive && item.id === "myaccount" && (
                    <VStack alignItems="flex-start" w="full" gap={0} ml="44px">
                      {accountItems.map((sub: meetingType, i: number) => {
                        const isLast = i === accountItems.length - 1;
                        return (
                          <HStack
                            key={sub.title}
                            w="full"
                            py={2}
                            cursor="pointer"
                            onClick={() => setFeedbackActivePage(sub.title)}
                            gap={0}
                            position="relative"
                          >
                            <Box
                              position="absolute"
                              left="0"
                              top="0"
                              bottom={isLast ? "50%" : "0"}
                              w="2px"
                              bg="gray.300"
                            />
                            <Box w="16px" h="2px" bg="gray.300" flexShrink={0} />
                            <Text
                              ml={2}
                              fontSize="0.875rem"
                              fontWeight={feedbackActivePage === sub.title ? "600" : "400"}
                              color={feedbackActivePage === sub.title ? "text_primary" : "gray.500"}
                              _hover={{ color: "text_primary" }}
                            >
                              {sub.text}
                            </Text>
                          </HStack>
                        );
                      })}
                    </VStack>
                  )}
                </VStack>
              );
            })}
          </VStack>

          <Button
            bg="button_bg"
            w="90%"
            mx="auto"
            mb={6}
            onClick={() => setOpenModal(true)}
          >
            <Text fontFamily="Outfit" color="button_text" fontWeight="400">
              + Create Group Session
            </Text>
          </Button>
        </Box>
      </Box>

      {/* ── Mobile menu trigger ── */}
      <Stack
        as="button"
        cursor="pointer"
        onClick={() => setShowMenuList(true)}
        display={{ base: "flex", md: "flex", lg: "none", xl: "none" }}
        pos="absolute"
        left="0"
        top="80px"
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

      {/* ── Main content ── */}
      <Box flex={1} overflowY="auto" css={noScrollbar} px={4} py={4}>
        {renderContent()}
      </Box>

      <MenuList
        action={handleMobileTabChange}
        open={showMenuList}
        onOpenChange={() => setShowMenuList(false)}
      />

      {openModal && (
        <ScheduleGroupConsultation
          isOpen={openModal}
          onOpenChange={() => setOpenModal(false)}
        />
      )}
    </Box>
  );
};

export default MyBusinessWorkspace;
