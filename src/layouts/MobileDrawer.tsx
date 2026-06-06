import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Drawer,
  HStack,
  Icon,
  Image,
  Portal,
  Text,
  VStack,
  Separator,
} from "@chakra-ui/react";
import { NavItem } from "mangarine/components/customcomponents/navitemcomp";
import { NavLinks, UserLinks } from "mangarine/components/customcomponents/navitems";
import { useEffect, useState } from "react";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useDispatch } from "react-redux";
import { signOut } from "mangarine/state/reducers/auth.reducer";
import { HiOutlineLogout } from "react-icons/hi";
import { useRouter } from "next/router";
import { useGetUnreadTotalMessagesQuery } from "mangarine/state/services/chat-management.service";
import { FiHeart, FiSettings, FiUser, FiHelpCircle } from "react-icons/fi";
import { type SVGProps } from "react";

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px" },
  "&::-webkit-scrollbar-track": { background: "transparent" },
  "&::-webkit-scrollbar-thumb": { background: "transparent" },
};

const SavedIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5.83333 3.16667C6.18696 3.16667 6.52609 3.30714 6.77614 3.55719C7.02619 3.80724 7.16667 4.14638 7.16667 4.5V12.5L3.83333 10.5L0.5 12.5V4.5C0.5 4.14638 0.640476 3.80724 0.890524 3.55719C1.14057 3.30714 1.47971 3.16667 1.83333 3.16667H5.83333Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PaymentsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3.16667 4.5C3.16667 4.14638 3.30714 3.80724 3.55719 3.55719C3.80724 3.30714 4.14638 3.16667 4.5 3.16667H11.1667C11.5203 3.16667 11.8594 3.30714 12.1095 3.55719C12.3595 3.80724 12.5 4.14638 12.5 4.5V8.5C12.5 8.85362 12.3595 9.19276 12.1095 9.44281C11.8594 9.69286 11.5203 9.83333 11.1667 9.83333H4.5C4.14638 9.83333 3.80724 9.69286 3.55719 9.44281C3.30714 9.19276 3.16667 8.85362 3.16667 8.5V4.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TransactionIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3.16667 3.16667H7.16667M3.16667 5.83333H7.16667M0.5 12.5V1.83333C0.5 1.47971 0.640476 1.14057 0.890524 0.890524C1.14057 0.640476 1.47971 0.5 1.83333 0.5H8.5C8.85362 0.5 9.19276 0.640476 9.44281 0.890524C9.69286 1.14057 9.83333 1.47971 9.83333 1.83333V12.5L7.83333 11.1667L6.5 12.5L5.16667 11.1667L3.83333 12.5L2.5 11.1667L0.5 12.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ScheduledIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5.5 12.5H1.83333C1.47971 12.5 1.14057 12.3595 0.890524 12.1095C0.640476 11.8594 0.5 11.5203 0.5 11.1667V3.16667C0.5 2.81304 0.640476 2.47391 0.890524 2.22386C1.14057 1.97381 1.47971 1.83333 1.83333 1.83333H9.83333C10.187 1.83333 10.5261 1.97381 10.7761 2.22386C11.0262 2.47391 11.1667 2.81304 11.1667 3.16667V7.16667M8.5 0.5V3.16667M3.16667 0.5V3.16667M0.5 5.83333H11.1667M7.83333 11.1667L9.16667 12.5L11.8333 9.83333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ConsultationHistoryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 13 11" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1.83333 0.5H4.5L6.5 2.5H11.1667C11.5203 2.5 11.8594 2.64048 12.1095 2.89052C12.3595 3.14057 12.5 3.47971 12.5 3.83333V9.16667C12.5 9.52029 12.3595 9.85943 12.1095 10.1095C11.8594 10.3595 11.5203 10.5 11.1667 10.5H1.83333C1.47971 10.5 1.14057 10.3595 0.890524 10.1095C0.640476 9.85943 0.5 9.52029 0.5 9.16667V1.83333C0.5 1.47971 0.640476 1.14057 0.890524 0.890524C1.14057 0.640476 1.47971 0.5 1.83333 0.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type QuickLink = {
  label: string;
  icon: React.ElementType;
  action: () => void;
};

export const MobileDrawer = () => {
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: unreadMsgs } = useGetUnreadTotalMessagesQuery();
  const unreadCount = unreadMsgs?.totalUnreadMessages ?? 0;

  useEffect(() => { setIsClient(true); }, []);

  const links = user?.isConsultant === true ? NavLinks : UserLinks;

  const businessWalletPath = user?.isConsultant
    ? "/my-business/dashboard?tab=wallet"
    : "/my-business?startOnboarding=1";

  const quickLinks: QuickLink[] = [
    { label: "Saved Items", icon: SavedIcon, action: () => router.push("/saved") },
    { label: "Payment History", icon: PaymentsIcon, action: () => router.push(`${businessWalletPath}&section=payments`) },
    { label: "Transaction History", icon: TransactionIcon, action: () => router.push(`${businessWalletPath}&section=transactions`) },
    { label: "Scheduled Consultations", icon: ScheduledIcon, action: () => router.push("/consultation?tab=upcoming") },
    { label: "Favorite Consultants", icon: FiHeart, action: () => router.push("/consultant") },
    { label: "Consultation History", icon: ConsultationHistoryIcon, action: () => router.push("/consultation?tab=history") },
  ];

  const logout = () => { dispatch(signOut()); };

  return (
    <Box display={{ base: "flex", md: "flex", lg: "none" }}>
      <Drawer.Root size="xs">
        <Drawer.Trigger asChild>
          <Button variant="ghost" size="sm" px={2}>
            <Image src="/icons/menu.svg" alt="menu" />
          </Button>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" position="absolute" top={3} right={3} />
              </Drawer.CloseTrigger>

              <Drawer.Body pt={5} pb={6} px={4} overflowY="auto" css={noScrollbar}>
                <VStack gap={0} align="stretch">

                  {/* Profile card */}
                  <HStack
                    w="full"
                    px={3}
                    py={3}
                    borderRadius="14px"
                    bg="#F4F5FA"
                    cursor="pointer"
                    onClick={() => router.push("/profile")}
                    gap={3}
                    mb={5}
                  >
                    <Avatar.Root boxSize="44px" rounded="full" flexShrink={0}>
                      <Avatar.Fallback name={user?.fullName} />
                      <Avatar.Image src={user?.profilePics} />
                    </Avatar.Root>
                    <VStack alignItems="flex-start" gap={0} minW={0} flex={1}>
                      <Text fontWeight="700" fontSize="0.9rem" color="text_primary" lineClamp={1}>
                        {user?.fullName}
                      </Text>
                      <Text fontSize="0.75rem" color="gray.500" lineClamp={1}>
                        {user?.email}
                      </Text>
                    </VStack>
                    <Text fontSize="0.75rem" color="#111D4A" fontWeight="600" flexShrink={0}>
                      View →
                    </Text>
                  </HStack>

                  {/* Nav links */}
                  <VStack gap={1} align="stretch" mb={4}>
                    {links.map((link) => (
                      <Box key={link.href} position="relative">
                        <NavItem link={link} isMobile />
                        {link.href === "/message" && unreadCount > 0 && (
                          <Box
                            position="absolute"
                            top="8px"
                            left="30px"
                            bg="#E53E3E"
                            color="white"
                            fontWeight="800"
                            rounded="full"
                            minW="18px"
                            h="18px"
                            px="4px"
                            fontSize="10px"
                            lineHeight="18px"
                            textAlign="center"
                            pointerEvents="none"
                            boxShadow="0 0 0 2px white"
                          >
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </Box>
                        )}
                      </Box>
                    ))}
                  </VStack>

                  <Separator mb={4} />

                  {/* Quick links section */}
                  <Text fontSize="0.75rem" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.08em" mb={2} px={1}>
                    Quick Links
                  </Text>
                  <VStack gap={0} align="stretch" mb={4}>
                    {quickLinks.map((item) => (
                      <HStack
                        key={item.label}
                        px={3}
                        py={2.5}
                        borderRadius="10px"
                        cursor="pointer"
                        gap={3}
                        onClick={item.action}
                        _hover={{ bg: "#F4F5FA" }}
                        transition="background 0.15s"
                      >
                        <Icon as={item.icon} boxSize={4} color="text_primary" />
                        <Text fontSize="0.875rem" color="text_primary" fontWeight="400">
                          {item.label}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>

                  <Separator mb={4} />

                  {/* Account section */}
                  <Text fontSize="0.75rem" fontWeight="700" color="gray.400" textTransform="uppercase" letterSpacing="0.08em" mb={2} px={1}>
                    Account
                  </Text>
                  <VStack gap={0} align="stretch" mb={4}>
                    {([
                      { label: "My Profile", icon: FiUser, action: () => router.push("/profile") },
                      { label: "Settings", icon: FiSettings, action: () => router.push("/settings?tab=account") },
                      { label: "Help Center", icon: FiHelpCircle, action: () => router.push("/settings?tab=help") },
                    ] as QuickLink[]).map((item) => (
                      <HStack
                        key={item.label}
                        px={3} py={2.5} borderRadius="10px" cursor="pointer" gap={3}
                        onClick={item.action} _hover={{ bg: "#F4F5FA" }} transition="background 0.15s"
                      >
                        <Icon as={item.icon} boxSize={4} color="text_primary" />
                        <Text fontSize="0.875rem" color="text_primary" fontWeight="400">{item.label}</Text>
                      </HStack>
                    ))}
                  </VStack>

                  <Separator mb={4} />

                  {/* Logout */}
                  <HStack
                    px={3}
                    py={2.5}
                    cursor="pointer"
                    borderRadius="10px"
                    gap={3}
                    onClick={logout}
                    _hover={{ bg: "#FFF5F5" }}
                    transition="background 0.15s"
                  >
                    <Icon color="red.500">
                      <HiOutlineLogout size={18} />
                    </Icon>
                    <Text fontSize="0.875rem" color="red.500" fontWeight="500">
                      Log out
                    </Text>
                  </HStack>

                </VStack>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};
