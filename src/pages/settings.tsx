"use client";
import { useEffect, useState } from "react";
import { Box, Text, Image, Flex, Icon, HStack } from "@chakra-ui/react";
import AccountSetting from "mangarine/components/ui-components/accountsetting";
import PrivacySetting from "mangarine/components/ui-components/privacysetting";
import NotificationSetting from "mangarine/components/ui-components/notificationsetting";
import SecuritySetting from "mangarine/components/ui-components/securitysetting";
import GeneralSetting from "mangarine/components/ui-components/generalsetting";
import LegalSetting from "mangarine/components/ui-components/legalsetting";
import CustomInput from "mangarine/components/customcomponents/Input";
import { CgSearch } from "react-icons/cg";
import { BiArrowBack } from "react-icons/bi";
import Help from "mangarine/components/ui-components/settings/help";
import { useRouter } from "next/router";

const menuData = [
  {
    id: "account",
    text: "Account Setting",
    icon: "/icons/account1.svg",
    iconBg: "/icons/right.svg",
    iconCircleBg: "rgba(54, 56, 83, 0.12)",
  },
  {
    id: "privacy",
    text: "Privacy Setting",
    icon: "/icons/privacy.svg",
    iconBg: "/icons/right.svg",
    iconCircleBg: "rgba(252, 115, 26, 0.12)",
  },
  {
    id: "notification",
    text: "Notification Setting",
    icon: "/icons/notification.svg",
    iconBg: "/icons/right.svg",
    iconCircleBg: "rgba(13, 188, 157, 0.12)",
  },
  // {
  //   id: "payment",
  //   text: "Payment Setting",
  //   icon: "/icons/payment1.svg",
  //   iconBg: "/icons/right.svg",
  //   iconCircleBg: "rgba(247, 26, 252, 0.12)",
  // },
  {
    id: "security",
    text: "Security Setting",
    icon: "/icons/security.svg",
    iconBg: "/icons/right.svg",
    iconCircleBg: "rgba(24, 25, 35, 0.10)",
  },
  {
    id: "general",
    text: "General Setting",
    icon: "/icons/general.svg",
    iconBg: "/icons/right.svg",
    iconCircleBg: "rgba(252, 216, 26, 0.15)",
  },
  {
    id: "help",
    text: "Help & Support",
    icon: "/icons/support.svg",
    iconBg: "/icons/right.svg",
    iconCircleBg: "rgba(25, 118, 210, 0.12)",
  },
  {
    id: "legal",
    text: "Legal Setting",
    icon: "/icons/legal.svg",
    iconBg: "/icons/right.svg",
    iconCircleBg: "rgba(48, 188, 13, 0.12)",
  },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "content">("list");
  const router = useRouter();

  useEffect(() => {
    const tab = router.query.tab;
    if (typeof tab === "string") {
      setActiveTab(tab);
      setMobileView("content");
    }
  }, [router.query.tab]);

  const handleMobileSelect = (id: string) => {
    setActiveTab(id);
    setMobileView("content");
  };

  const activeLabel = menuData.find((m) => m.id === activeTab)?.text ?? "Settings";

  const filteredMenu = searchTerm
    ? menuData.filter((m) => m.text.toLowerCase().includes(searchTerm.toLowerCase()))
    : menuData;

  const renderContent = () => {
    switch (activeTab) {
      case "account":      return <AccountSetting />;
      case "privacy":      return <PrivacySetting />;
      case "notification": return <NotificationSetting />;
      // case "payment":   return <PaymentSetting />;
      case "security":     return <SecuritySetting />;
      case "general":      return <GeneralSetting />;
      case "help":         return <Help />;
      case "legal":        return <LegalSetting />;
      default:             return <AccountSetting />;
    }
  };

  return (
    <Box
      w="full"
      h="full"
      borderRight="1px"
      borderBottom="1px"
      borderLeft="1px"
      borderColor="border_background"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      <Box display="flex" flex={1} minH={0}>

        {/* ── Desktop sidebar ──────────────────────────────────────── */}
        <Box
          flex={1.5}
          borderRight="1px"
          h="full"
          borderColor="border_background"
          display={{ base: "none", lg: "flex" }}
          flexDirection="column"
          minW={0}
        >
          <Box>
            <CustomInput
              label=""
              placeholder="Search settings"
              id="search"
              required={false}
              name="search"
              autoComplete="off"
              value={searchTerm}
              size="lg"
              onChange={(value) => setSearchTerm(value)}
              hasLeftIcon={true}
              type="search"
              inputStyle={{ bg: "main_background", shadow: "lg" }}
              leftIcon={
                <Icon m={2} size="md" color="grey.500">
                  <CgSearch />
                </Icon>
              }
            />
          </Box>
          <Box
            as="nav"
            display="flex"
            flexDirection="column"
            flex={1}
            overflowY="auto"
            borderRadius="16px"
            boxShadow="sm"
            bg="main_background"
            css={{ "&::-webkit-scrollbar": { width: "0px" } }}
          >
            {filteredMenu.map((item) => (
              <Flex
                key={item.id}
                width={activeTab === item.id ? "95%" : "full"}
                mx="auto"
                align="center"
                justify="space-between"
                px={{ lg: "4", xl: "6" }}
                py={{ lg: "3", xl: "4" }}
                roundedTopLeft={activeTab === item.id ? "lg" : "none"}
                roundedBottomLeft={activeTab === item.id ? "lg" : "none"}
                borderLeftWidth={activeTab === item.id ? "4px" : "0px"}
                borderLeftColor={activeTab === item.id ? "text_primary" : "transparent"}
                backgroundColor={activeTab === item.id ? "bg_box" : "transparent"}
                mt={activeTab === item.id ? "2" : "0"}
                _hover={{ backgroundColor: "bg_box" }}
                onClick={() => setActiveTab(item.id)}
                cursor="pointer"
                pb={{ lg: "3", xl: "4" }}
                mb={{ lg: "2", xl: "4" }}
                borderBottom="1px solid"
                borderBottomColor="border_but"
              >
                <Flex align="center">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxSize={{ lg: "8", xl: "10" }}
                    borderRadius="full"
                    bg={item.iconCircleBg}
                    _dark={{ bg: "whiteAlpha.200" }}
                    flexShrink={0}
                    marginRight={{ lg: "3", xl: "4" }}
                  >
                    <Image src={item.icon} alt={item.text} boxSize={{ lg: "4", xl: "5" }} _dark={{ filter: "invert(1)" }} />
                  </Box>
                  <Text fontSize={{ lg: "1rem", xl: "1.2rem" }} fontFamily="Outfit" fontWeight="500" truncate color="text_primary">
                    {item.text}
                  </Text>
                </Flex>
                <Image src={item.iconBg} alt="arrow" _dark={{ filter: "invert(1)" }} />
              </Flex>
            ))}
          </Box>
        </Box>

        {/* ── Desktop content ───────────────────────────────────────── */}
        <Box
          flex="3"
          overflowY="scroll"
          h="full"
          px={{ lg: 5, xl: 6 }}
          display={{ base: "none", lg: "block" }}
          css={{
            "&::-webkit-scrollbar": { width: "0px", height: "0px" },
            "&::-webkit-scrollbar-track": { width: "0px", background: "transparent" },
            "&::-webkit-scrollbar-thumb": { background: "transparent" },
          }}
        >
          {renderContent()}
        </Box>

        {/* ── Mobile: settings list ─────────────────────────────────── */}
        <Box
          display={{ base: mobileView === "list" ? "flex" : "none", lg: "none" }}
          flexDirection="column"
          w="full"
          h="full"
          overflowY="auto"
          bg="main_background"
        >
          {/* Mobile search */}
          <Box px={4} pt={4} pb={2}>
            <CustomInput
              label=""
              placeholder="Search settings"
              id="mobile-search"
              required={false}
              name="mobile-search"
              autoComplete="off"
              value={searchTerm}
              size="md"
              onChange={(value) => setSearchTerm(value)}
              hasLeftIcon={true}
              type="search"
              inputStyle={{ bg: "main_background" }}
              leftIcon={
                <Icon m={2} size="md" color="grey.500">
                  <CgSearch />
                </Icon>
              }
            />
          </Box>

          {/* Mobile menu items */}
          <Box flex={1} px={2}>
            {filteredMenu.map((item) => (
              <Flex
                key={item.id}
                align="center"
                justify="space-between"
                px={4}
                py={4}
                borderBottomWidth="1px"
                borderBottomColor="border_but"
                onClick={() => handleMobileSelect(item.id)}
                cursor="pointer"
                _active={{ bg: "bg_box" }}
              >
                <HStack gap={4}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    boxSize={10}
                    borderRadius="full"
                    bg={item.iconCircleBg}
                    _dark={{ bg: "whiteAlpha.200" }}
                    flexShrink={0}
                  >
                    <Image src={item.icon} alt={item.text} boxSize={5} _dark={{ filter: "invert(1)" }} />
                  </Box>
                  <Text fontFamily="Outfit" fontWeight="500" fontSize="1rem" color="text_primary">
                    {item.text}
                  </Text>
                </HStack>
                <Image src={item.iconBg} alt="arrow" boxSize={4} _dark={{ filter: "invert(1)" }} />
              </Flex>
            ))}
          </Box>
        </Box>

        {/* ── Mobile: content view ──────────────────────────────────── */}
        <Box
          display={{ base: mobileView === "content" ? "flex" : "none", lg: "none" }}
          flexDirection="column"
          w="full"
          h="full"
          overflowY="auto"
        >
          {/* Mobile content header with back button */}
          <HStack
            px={4}
            py={3}
            borderBottomWidth="1px"
            borderBottomColor="border_background"
            bg="main_background"
            gap={3}
            flexShrink={0}
          >
            <Box
              cursor="pointer"
              onClick={() => setMobileView("list")}
              color="text_primary"
              display="flex"
              alignItems="center"
            >
              <BiArrowBack size={20} />
            </Box>
            <Text fontFamily="Outfit" fontWeight="600" fontSize="1rem" color="text_primary">
              {activeLabel}
            </Text>
          </HStack>

          <Box flex={1} overflowY="auto" px={3} py={4}>
            {renderContent()}
          </Box>
        </Box>

      </Box>
    </Box>
  );
};

export default Settings;
