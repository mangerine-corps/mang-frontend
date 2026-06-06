"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  HStack,
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

const SidebarMenuIcon = ({ id }: { id: string }) => {
  switch (id) {
    case "dashboard":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.19119 3.15595C7.30475 2.94802 6.38222 2.94802 5.49578 3.15595C4.33479 3.42828 3.42828 4.33479 3.15595 5.49578C2.94802 6.38222 2.94802 7.30475 3.15595 8.19119C3.42828 9.35218 4.33479 10.2587 5.49578 10.531C6.38222 10.739 7.30475 10.739 8.19119 10.531C9.35218 10.2587 10.2587 9.35218 10.531 8.19119C10.739 7.30475 10.739 6.38222 10.531 5.49578C10.2587 4.33479 9.35218 3.42828 8.19119 3.15595Z" fill="#30BC0D" stroke="#30BC0D" strokeWidth="1.5"/>
          <path d="M8.19119 13.469C7.30475 13.261 6.38222 13.261 5.49578 13.469C4.33479 13.7413 3.42828 14.6478 3.15595 15.8088C2.94802 16.6952 2.94802 17.6178 3.15595 18.5042C3.42828 19.6652 4.33479 20.5717 5.49578 20.8441C6.38222 21.052 7.30475 21.052 8.19119 20.8441C9.35218 20.5717 10.2587 19.6652 10.531 18.5042C10.739 17.6178 10.739 16.6952 10.531 15.8088C10.2587 14.6478 9.35218 13.7413 8.19119 13.469Z" fill="#30BC0D" stroke="#30BC0D" strokeWidth="1.5"/>
          <path d="M18.5042 3.15595C17.6178 2.94802 16.6952 2.94802 15.8088 3.15595C14.6478 3.42828 13.7413 4.33479 13.469 5.49578C13.261 6.38222 13.261 7.30475 13.469 8.19119C13.7413 9.35218 14.6478 10.2587 15.8088 10.531C16.6952 10.739 17.6178 10.739 18.5042 10.531C19.6652 10.2587 20.5717 9.35218 20.8441 8.19119C21.052 7.30475 21.052 6.38222 20.8441 5.49578C20.5717 4.33479 19.6652 3.42828 18.5042 3.15595Z" fill="#30BC0D" stroke="#30BC0D" strokeWidth="1.5"/>
          <path d="M18.5042 13.469C17.6178 13.261 16.6952 13.261 15.8088 13.469C14.6478 13.7413 13.7413 14.6478 13.469 15.8088C13.261 16.6952 13.261 17.6178 13.469 18.5042C13.7413 19.6652 14.6478 20.5717 15.8088 20.8441C16.6952 21.052 17.6178 21.052 18.5042 20.8441C19.6652 20.5717 20.5717 19.6652 20.8441 18.5042C21.052 17.6178 21.052 16.6952 20.8441 15.8088C20.5717 14.6478 19.6652 13.7413 18.5042 13.469Z" fill="#30BC0D" stroke="#30BC0D" strokeWidth="1.5"/>
        </svg>
      );
    case "meetings":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.86241 10.7032C3.38351 12.513 3.37707 14.4414 3.85597 16.2511C4.44153 18.464 6.22102 20.1547 8.45287 20.6188L8.60824 20.6511C10.8457 21.1163 13.1543 21.1163 15.3918 20.6511L15.5471 20.6188C17.779 20.1547 19.5585 18.464 20.144 16.2511C20.6229 14.4414 20.6165 12.513 20.1376 10.7032C19.5611 8.52447 17.8007 6.82847 15.6032 6.37155C13.2263 5.87731 10.7737 5.87731 8.39677 6.37155M8.39677 6.37155C9.58417 6.12466 12.04 6.04503 13.2463 6.04481C12.5221 4.31117 10.5489 3 8.8677 3H8.00974C7.53975 3 7.06583 3.06524 6.61272 3.19064C4.79687 3.69319 3.51146 5.3599 3.51146 7.25212V12.9952C3.54685 12.2221 3.66414 11.4525 3.86241 10.7032C4.43895 8.52447 6.1993 6.82847 8.39677 6.37155ZM14.6103 8.76913L14.6529 8.77627C16.4358 9.07479 17.7426 10.6245 17.7426 12.4404M3.51146 13.9964V14.0138L3.5124 14.0164C3.51208 14.0097 3.51177 14.0031 3.51146 13.9964Z" stroke="#363853" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );
    case "wallet":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M15.0308 3.3303C13.0345 2.8899 10.9655 2.8899 8.96917 3.3303L8.55155 3.42243C5.76343 4.03749 3.56534 6.17136 2.87698 8.93119C2.37434 10.9465 2.37434 13.0536 2.87698 15.0688C3.56534 17.8286 5.76343 19.9625 8.55155 20.5776L8.96917 20.6697C10.9655 21.1101 13.0345 21.1101 15.0308 20.6697L15.4484 20.5776C18.2366 19.9625 20.4347 17.8286 21.123 15.0688C21.6257 13.0535 21.6257 10.9465 21.123 8.9312C20.4347 6.17136 18.2366 4.03749 15.4484 3.42243L15.0308 3.3303ZM17.9433 9.80778C18.3203 9.74389 18.702 9.72114 19.0807 9.73871C19.4968 9.75801 19.8243 10.0825 19.8802 10.4936C20.0163 11.4933 20.0163 12.5067 19.8802 13.5064C19.8243 13.9175 19.4968 14.242 19.0807 14.2613C18.702 14.2789 18.3203 14.2561 17.9433 14.1922L17.8694 14.1797C16.8874 14.0133 16.1287 13.3507 15.8722 12.5159C15.7684 12.1783 15.7684 11.8217 15.8722 11.4841C16.1287 10.6493 16.8874 9.98674 17.8694 9.82032L17.9433 9.80778ZM7.34559 8.97732C7.34559 8.64344 7.61739 8.37278 7.95269 8.37278L12 8.37278C12.3353 8.37278 12.6071 8.64344 12.6071 8.97732C12.6071 9.3112 12.3353 9.58186 12 9.58186H7.95269C7.61739 9.58186 7.34559 9.3112 7.34559 8.97732Z" fill="#F71AFC"/>
        </svg>
      );
    case "myaccount":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3C9.56586 3 7.59259 4.95716 7.59259 7.37143C7.59259 9.7857 9.56586 11.7429 12 11.7429C14.4341 11.7429 16.4074 9.7857 16.4074 7.37143C16.4074 4.95716 14.4341 3 12 3Z" fill="#2733DA"/>
          <path d="M14.601 13.6877C12.8779 13.4149 11.1221 13.4149 9.39904 13.6877L9.21435 13.7169C6.78647 14.1012 5 16.1783 5 18.6168C5 19.933 6.07576 21 7.40278 21H16.5972C17.9242 21 19 19.933 19 18.6168C19 16.1783 17.2135 14.1012 14.7857 13.7169L14.601 13.6877Z" fill="#2733DA"/>
        </svg>
      );
    default:
      return null;
  }
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
      h="full"
      overflow="hidden"
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
            {menuData.map((item) => {
              const isActive = activeTab === item.id;
              const hasSubs = item.id === "meetings" || item.id === "myaccount";

              return (
                <VStack w="full" key={item.id} gap={0}>
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
                        bg={item.iconBgColor}
                        flexShrink={0}
                      >
                        <SidebarMenuIcon id={item.id} />
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
      <Box flex={1} minH={0} overflowY="auto" px={4} py={4}>
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
