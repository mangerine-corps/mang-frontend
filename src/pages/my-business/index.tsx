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
import AppLayout from "mangarine/layouts/AppLayout";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import MyAccounts from "mangarine/components/ui-components/myaccount/TabPages/my_account";
import MyMeetings from "mangarine/components/ui-components/meetings/TabPages/my_meeting";
import Dashboard from "mangarine/components/ui-components/mybusiness/dashboard";
import MenuList from "mangarine/components/ui-components/mybusiness/menudrawer";
import ScheduleGroupConsultation from "mangarine/components/ui-components/mybusiness/modals/schedulegroupconsult";
import MyWalletComponent from "mangarine/components/ui-components/mybusiness/mywalletcomp";
import BecomeAConsultantModal from "mangarine/components/ui-components/modals/becomeaconsultant";
import { useAuth } from "mangarine/state/hooks/user.hook";
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

type BusinessMenuItem = (typeof menuData)[number];

const BecomeConsultantState = ({
  onOpenChange,
}: {
  onOpenChange: () => void;
}) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", lg: "320px minmax(0, 1fr)" }}
      gap={4}
      w="full"
      h="full"
      minH={0}
    >
      <VStack
        display={{ base: "none", lg: "flex" }}
        align="stretch"
        gap={4}
        h="full"
        overflowY="auto"
        css={noScrollbar}
      >
        <Biocard />
        <DashboardCard />
      </VStack>

      <Flex
        bg="bg_box"
        borderWidth="1px"
        borderColor="input_border"
        borderRadius="24px"
        px={{ base: "24px", md: "48px" }}
        py={{ base: "48px", md: "72px" }}
        minH={{ base: "420px", lg: "full" }}
        align="center"
        justify="center"
        boxShadow="sm"
      >
        <VStack maxW="520px" gap={6} textAlign="center">
          <Image
            src="/becomeaconsultant.png"
            alt="Become a consultant"
            boxSize={{ base: "120px", md: "176px" }}
            objectFit="contain"
          />

          <VStack gap={2}>
            <Text
              fontFamily="Outfit"
              fontSize={{ base: "1.75rem", md: "2rem" }}
              fontWeight="600"
              color="text_primary"
            >
              Become a Consultant
            </Text>
            <Text
              maxW="440px"
              fontSize={{ base: "0.95rem", md: "1rem" }}
              color="gray.500"
            >
              Start offering your expertise, connect with clients and earn from
              your knowledge.
            </Text>
          </VStack>

          <Button
            w="full"
            maxW="360px"
            h="52px"
            bg="button_bg"
            color="button_text"
            fontWeight="600"
            onClick={onOpenChange}
            _hover={{ bg: "button_bg" }}
          >
            Become a Consultant
          </Button>
        </VStack>
      </Flex>
    </Box>
  );
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activePage, setActivePage] = useState("availability_settings");
  const [feedbackActivePage, setfeedbackActivePage] = useState("feedback");
  const [showMenuList, setShowMenuList] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openConsultantModal, setOpenConsultantModal] = useState(false);

  const { user } = useAuth();
  const isConsultant = user?.isConsultant === true;
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
      default:
        return <Dashboard />;
    }
  };

  useEffect(() => {
    if (!isConsultant) {
      return;
    }

    if (tab && typeof tab === "string") {
      setActiveTab(tab);
    }
  }, [isConsultant, tab]);

  useEffect(() => {
    if (isConsultant) {
      setOpenConsultantModal(false);
      return;
    }

    setShowMenuList(false);
    setOpenModal(false);
  }, [isConsultant]);

  const handleMobileTabChange = (item: BusinessMenuItem) => {
    setActiveTab(item.id);
    setShowMenuList(false);
  };

  return (
    <AppLayout>
      <>
        {!isConsultant ? (
          <BecomeConsultantState
            onOpenChange={() => {
              setOpenConsultantModal(true);
            }}
          />
        ) : (
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
                        onClick={() => setActiveTab(item.id)}
                        cursor="pointer"
                      >
                        <Flex align="center">
                          <VStack
                            alignItems="flex-start"
                            justifyContent="flex-start"
                          >
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
                                onClick={() => setActivePage(accountItem.title)}
                                borderLeftWidth={2}
                                borderColor="grey.400"
                                flex={1}
                              >
                                <Box w="12" h="0.5" bg="grey.500" />

                                <Text
                                  color={
                                    activePage === accountItem.title
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
        )}

        {openConsultantModal && (
          <BecomeAConsultantModal
            isOpen={openConsultantModal}
            onOpenChange={() => {
              setOpenConsultantModal(false);
            }}
          />
        )}
      </>
    </AppLayout>
  );
};

export default Index;
