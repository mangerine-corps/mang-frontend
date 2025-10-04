"use client";
import { useState } from "react";
import { Box, Text, Image, Flex, Icon, Stack } from "@chakra-ui/react";
import AppLayout from "mangarine/layouts/AppLayout";
import AccountSetting from "mangarine/components/ui-components/accountsetting";
import PrivacySetting from "mangarine/components/ui-components/privacysetting";
import NotificationSetting from "mangarine/components/ui-components/notificationsetting";
import PaymentSetting from "mangarine/components/ui-components/paymentsetting";
import SecuritySetting from "mangarine/components/ui-components/securitysetting";
import GeneralSetting from "mangarine/components/ui-components/generalsetting";

import LegalSetting from "mangarine/components/ui-components/legalsetting";
import CustomInput from "mangarine/components/customcomponents/Input";
import { CgSearch } from "react-icons/cg";
import Help from "mangarine/components/ui-components/settings/help";
import { BiMenuAltLeft } from "react-icons/bi";
import MenuList from "mangarine/components/ui-components/mybusiness/modals/settingsdrawer";
// import CancelSubscriptionModal from "mangarine/components/ui-components/cancelsubscriptionmodal"

const menuData = [
  {
    id: "account",
    text: "Account Setting",
    icon: "/icons/account1.svg",
    href: "/accountsetting",
    iconBg: "/icons/right.svg",
  },
  {
    id: "privacy",
    text: "Privacy Setting",
    icon: "/icons/privacy.svg",
    href: "/",
    iconBg: "/icons/right.svg",
  },
  {
    id: "notification",
    text: "Notification Setting",
    icon: "/icons/notification.svg",
    href: "/notification",
    iconBg: "/icons/right.svg",
  },
  {
    id: "payment",
    text: "Payment Setting",
    icon: "/icons/payment1.svg",
    href: "/payment",
    iconBg: "/icons/right.svg",
  },
  {
    id: "security",
    text: "Security Setting",
    icon: "/icons/security.svg",
    href: "/security",
    iconBg: "/icons/right.svg",
  },
  {
    id: "general",
    text: "General Setting",
    icon: "/icons/general.svg",
    href: "/general",
    iconBg: "/icons/right.svg",
  },
  {
    id: "help",
    text: "Help & Support",
    icon: "/icons/support.svg",
    href: "/support",
    iconBg: "/icons/right.svg",
  },
  {
    id: "legal",
    text: "Legal Setting",
    icon: "/icons/legal.svg",
    href: "",
    iconBg: "/icons/right.svg",
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenuList, setShowMenuList] = useState<boolean>(false);
  // const  [hide, setHide] = useState<boolean>(false);
  const handleMobileTabChange = (activeTab) => {
    setActiveTab(activeTab.id);

    setShowMenuList(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSetting />;
      case "privacy":
        return <PrivacySetting />;
      case "notification":
        return <NotificationSetting />;
      case "payment":
        return <PaymentSetting />;
      case "security":
        return <SecuritySetting />;
      case "general":
        return <GeneralSetting />;
      case "help":
        return <Help />;
      case "legal":
        return <LegalSetting />;
      default:
        return <AccountSetting />;
    }
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
        spaceX={{ base: "0", md: "0", lg: "3" }}
        overflow="hidden"
        // gap="1"
        display="flex"
        pos={"relative"}
      >
        <Box
          flex={1.5}
          borderRight="1px"
          h="full"
          borderColor="gray.200"
          display={{ base: "none", md: "none", lg: "block", xl: "block" }}
        >
          <Box>
            <CustomInput
              label=""
              placeholder="Search Setting"
              id="search"
              required={false}
              name="search"
              value={searchTerm}
              size="lg"
              onChange={(value) => setSearchTerm(value)}
              hasLeftIcon={true}
              type={"text"}
              inputStyle={{
                bg: "main_background",
                shadow: "lg",
              }}
              leftIcon={
                <Icon m={2} size={"md"} color="grey.500">
                  <CgSearch />
                </Icon>
              }
            />
          </Box>
          <Box
            as="nav"
            display="flex"
            flexDirection="column"
            //  w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
            h="full"
            // pb="14px"
            borderRadius="16px"
            boxShadow="sm"
            bg="main_background"
            //mt="14px"
            //px="16px"
            //py="16px"
            // gap="8px"
          >
            {menuData.map((item) => (
              <Flex
                key={item.id}
                width={activeTab === item.id ? "95%" : "full"}
                mx="auto"
                align="center"
                justify="space-between"
                p="6"
                roundedTopLeft={activeTab === item.id ? "lg" : "none"}
                roundedBottomLeft={activeTab === item.id ? "lg" : "none"}
                borderLeftWidth={activeTab === item.id ? "4px" : "0px"}
                borderLeftColor={
                  activeTab === item.id ? "text_primary" : "transparent"
                }
                backgroundColor={
                  activeTab === item.id ? "bg_box" : "transparent"
                }
                mt={activeTab === item.id ? "2" : "0"}
                color={activeTab === item.id ? "text_primary" : "text_primary"}
                _hover={{ backgroundColor: "bg_box" }}
                onClick={() => setActiveTab(item.id)}
                cursor="pointer"
                pb={4}
                mb={4}
                borderBottom="1px solid"
                borderBottomColor="border_but"
              >
                <Flex align="center">
                  <Image
                    src={item.icon}
                    alt={item.text}
                    boxSize="4"
                    marginRight={4}
                  />
                  <Text>{item.text}</Text>
                </Flex>
                <Image src={item.iconBg} alt="arrow" />
              </Flex>
            ))}
          </Box>
        </Box>
        <Stack
          // as="button"
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
          // mt="2"
          flex="3"
          overflowY={"scroll"}
          h="full"
          // bg="red.700"
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
      </Box>
    </AppLayout>
  );
};

export default Settings;
