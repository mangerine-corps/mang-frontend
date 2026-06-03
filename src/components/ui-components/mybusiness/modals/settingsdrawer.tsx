"use client";
import { Box, Drawer, Flex, HStack, Image, Stack, Text } from "@chakra-ui/react";

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

const MenuList = ({
  open,
  onOpenChange,
  action,
  activeTab,
}: {
  open: boolean;
  onOpenChange: () => void;
  action: (item: any) => void;
  activeTab: string;
}) => {
  return (
    <Drawer.Root size="sm" open={open} onOpenChange={onOpenChange} placement="start">
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content
          bg="bg_box"
          css={{
            "&::-webkit-scrollbar": { width: "0px", height: "0px" },
            "&::-webkit-scrollbar-track": { width: "0px", background: "transparent" },
            "&::-webkit-scrollbar-thumb": { background: "transparent" },
          }}
        >
          <Drawer.Header borderBottomWidth="1px" borderBottomColor="border_but">
            <Drawer.Title>
              <Text fontFamily="Outfit" fontWeight="700" fontSize="1.2rem" color="text_primary">
                Settings
              </Text>
            </Drawer.Title>
          </Drawer.Header>

          <Drawer.Body px={2} py={4}>
            {menuData.map((item) => (
              <Flex
                key={item.id}
                align="center"
                justify="space-between"
                px={4}
                py={3}
                mb={1}
                borderRadius="lg"
                borderLeftWidth={activeTab === item.id ? "4px" : "0px"}
                borderLeftColor={activeTab === item.id ? "text_primary" : "transparent"}
                backgroundColor={activeTab === item.id ? "bg_box" : "transparent"}
                _hover={{ backgroundColor: "bg_box" }}
                onClick={() => action(item)}
                cursor="pointer"
                borderBottomWidth="1px"
                borderBottomColor="border_but"
              >
                <HStack gap={3}>
                  <Stack
                    h={10}
                    w={10}
                    borderRadius="full"
                    alignItems="center"
                    justifyContent="center"
                    bg={item.iconCircleBg}
                    flexShrink={0}
                  >
                    <Image src={item.icon} alt={item.text} boxSize={5} />
                  </Stack>
                  <Text
                    color="text_primary"
                    fontFamily="Outfit"
                    fontWeight={activeTab === item.id ? "600" : "400"}
                    fontSize="1rem"
                  >
                    {item.text}
                  </Text>
                </HStack>
                <Image src={item.iconBg} alt="arrow" boxSize={4} />
              </Flex>
            ))}
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default MenuList;
