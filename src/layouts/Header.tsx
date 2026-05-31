import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Input,
  Menu,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
import { type ElementType, type SVGProps, useEffect, useState } from "react";
import { NavItem } from "mangarine/components/customcomponents/navitemcomp";
import { NavLinks, UserLinks } from "mangarine/components/customcomponents/navitems";
import { MobileDrawer } from "./MobileDrawer";
import { useColorMode } from "mangarine/components/ui/color-mode";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { LiaSortDownSolid } from "react-icons/lia";
import { HiOutlineLogout } from "react-icons/hi";
import { LuChevronRight } from "react-icons/lu";
import { useRouter } from "next/router";
import { signOut } from "mangarine/state/reducers/auth.reducer";
import SideBar from "./Sidebar";
import { CgSearch } from "react-icons/cg";
import { useSearch } from "mangarine/hooks/useSearch";
import FilterSearch from "mangarine/components/ui-components/filtersearch";
import { useSaveRecentSearchMutation } from "mangarine/state/services/search.service";
import { useGetUnreadTotalMessagesQuery } from "mangarine/state/services/chat-management.service";
import NotificationDropdown from "mangarine/components/ui-components/NotificationDropdown";
import { outfit } from "mangarine/pages/_app";
import { useDispatch } from "react-redux";
import { DEFAULT_AVATAR } from "mangarine/lib/constants";
import { InputGroup } from "mangarine/components/ui/input-group";

type ProfileMenuItem = {
  action: () => void;
  icon: ElementType;
  label: string;
  value: string;
};

const ProfileMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M0.75 16.8615C0.75 14.4484 2.44732 12.393 4.75404 12.0127L4.96182 11.9784C6.80892 11.6739 8.69108 11.6739 10.5382 11.9784L10.746 12.0127C13.0527 12.393 14.75 14.4484 14.75 16.8615C14.75 17.9045 13.9315 18.75 12.9219 18.75H2.57813C1.56848 18.75 0.75 17.9045 0.75 16.8615Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11.8334 4.6875C11.8334 6.86212 10.0052 8.625 7.75002 8.625C5.49486 8.625 3.66669 6.86212 3.66669 4.6875C3.66669 2.51288 5.49486 0.75 7.75002 0.75C10.0052 0.75 11.8334 2.51288 11.8334 4.6875Z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const SettingsMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8.325 2.317C8.751 0.561 11.249 0.561 11.675 2.317C11.7389 2.5808 11.8642 2.82578 12.0407 3.032C12.2172 3.23822 12.4399 3.39985 12.6907 3.50375C12.9414 3.60764 13.2132 3.65085 13.4838 3.62987C13.7544 3.60889 14.0162 3.5243 14.248 3.383C15.791 2.443 17.558 4.209 16.618 5.753C16.4769 5.98466 16.3924 6.24634 16.3715 6.51677C16.3506 6.78721 16.3938 7.05877 16.4975 7.30938C16.6013 7.55999 16.7627 7.78258 16.9687 7.95905C17.1747 8.13553 17.4194 8.26091 17.683 8.325C19.439 8.751 19.439 11.249 17.683 11.675C17.4192 11.7389 17.1742 11.8642 16.968 12.0407C16.7618 12.2172 16.6001 12.4399 16.4963 12.6907C16.3924 12.9414 16.3491 13.2132 16.3701 13.4838C16.3911 13.7544 16.4757 14.0162 16.617 14.248C17.557 15.791 15.791 17.558 14.247 16.618C14.0153 16.4769 13.7537 16.3924 13.4832 16.3715C13.2128 16.3506 12.9412 16.3938 12.6906 16.4975C12.44 16.6013 12.2174 16.7627 12.0409 16.9687C11.8645 17.1747 11.7391 17.4194 11.675 17.683C11.249 19.439 8.751 19.439 8.325 17.683C8.26108 17.4192 8.13578 17.1742 7.95929 16.968C7.7828 16.7618 7.56011 16.6001 7.30935 16.4963C7.05859 16.3924 6.78683 16.3491 6.51621 16.3701C6.24559 16.3911 5.98375 16.4757 5.752 16.617C4.209 17.557 2.442 15.791 3.382 14.247C3.5231 14.0153 3.60755 13.7537 3.62848 13.4832C3.64942 13.2128 3.60624 12.9412 3.50247 12.6906C3.3987 12.44 3.23726 12.2174 3.03127 12.0409C2.82529 11.8645 2.58056 11.7391 2.317 11.675C0.561 11.249 0.561 8.751 2.317 8.325C2.5808 8.26108 2.82578 8.13578 3.032 7.95929C3.23822 7.7828 3.39985 7.56011 3.50375 7.30935C3.60764 7.05859 3.65085 6.78683 3.62987 6.51621C3.60889 6.24559 3.5243 5.98375 3.383 5.752C2.443 4.209 4.209 2.442 5.753 3.382C6.753 3.99 8.049 3.452 8.325 2.317Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 10C7 10.7956 7.31607 11.5587 7.87868 12.1213C8.44129 12.6839 9.20435 13 10 13C10.7956 13 11.5587 12.6839 12.1213 12.1213C12.6839 11.5587 13 10.7956 13 10C13 9.20435 12.6839 8.44129 12.1213 7.87868C11.5587 7.31607 10.7956 7 10 7C9.20435 7 8.44129 7.31607 7.87868 7.87868C7.31607 8.44129 7 9.20435 7 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BillingMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M1.45258 6.45024H19.0474" stroke="currentColor" strokeWidth="1.5" />
    <path d="M1.13539 12.9013C0.621536 10.8319 0.621536 8.66815 1.13539 6.59875C1.80805 3.88983 3.95602 1.79534 6.68056 1.19162L7.13443 1.09105C9.1866 0.636317 11.3134 0.636317 13.3656 1.09105L13.8194 1.19162C16.544 1.79534 18.692 3.88984 19.3646 6.59875C19.8785 8.66815 19.8785 10.8319 19.3646 12.9012C18.692 15.6102 16.544 17.7047 13.8194 18.3084L13.3656 18.409C11.3134 18.8637 9.1866 18.8637 7.13443 18.409L6.68056 18.3084C3.95601 17.7047 1.80805 15.6102 1.13539 12.9013Z" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const HelpMenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M10 15V15.01M10 11.4999C9.98159 11.1753 10.0692 10.8535 10.2495 10.5829C10.4299 10.3124 10.6933 10.1078 11 9.99992C11.3759 9.85618 11.7132 9.62716 11.9856 9.33088C12.2579 9.03459 12.4577 8.67914 12.5693 8.29251C12.6809 7.90588 12.7013 7.49861 12.6287 7.10279C12.5562 6.70696 12.3928 6.33337 12.1513 6.01144C11.9099 5.6895 11.597 5.42801 11.2373 5.24754C10.8776 5.06707 10.4809 4.97256 10.0785 4.97145C9.67611 4.97033 9.27892 5.06264 8.91824 5.24111C8.55756 5.41958 8.24323 5.67933 8 5.99992M1 10C1 11.1819 1.23279 12.3522 1.68508 13.4442C2.13738 14.5361 2.80031 15.5282 3.63604 16.364C4.47177 17.1997 5.46392 17.8626 6.55585 18.3149C7.64778 18.7672 8.8181 19 10 19C11.1819 19 12.3522 18.7672 13.4442 18.3149C14.5361 17.8626 15.5282 17.1997 16.364 16.364C17.1997 15.5282 17.8626 14.5361 18.3149 13.4442C18.7672 12.3522 19 11.1819 19 10C19 8.8181 18.7672 7.64778 18.3149 6.55585C17.8626 5.46392 17.1997 4.47177 16.364 3.63604C15.5282 2.80031 14.5361 2.13738 13.4442 1.68508C12.3522 1.23279 11.1819 1 10 1C8.8181 1 7.64778 1.23279 6.55585 1.68508C5.46392 2.13738 4.47177 2.80031 3.63604 3.63604C2.80031 4.47177 2.13738 5.46392 1.68508 6.55585C1.23279 7.64778 1 8.8181 1 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Header = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);
  const [Links, setLinks] = useState(NavLinks);
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { colorMode } = useColorMode();
  const { query, setQuery, results, loading, hasQuery, error } = useSearch(10);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [saveRecentSearch] = useSaveRecentSearchMutation();
  const { data: unreadMsgs } = useGetUnreadTotalMessagesQuery();

  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    setLinks(user?.isConsultant === true ? NavLinks : UserLinks);
  }, [user]);

  useEffect(() => {
    setIsSearchOpen(Boolean(hasQuery));
  }, [hasQuery]);

  const logout = () => { dispatch(signOut()); };

  const profileMenuItems: ProfileMenuItem[] = [
    { value: "profile", label: "My Profile", icon: ProfileMenuIcon, action: () => router.replace("/profile") },
    { value: "settings", label: "Settings", icon: SettingsMenuIcon, action: () => router.replace("/settings?tab=account") },
    { value: "billing", label: "Billing and Payment", icon: BillingMenuIcon, action: () => router.replace("/settings?tab=payment") },
    { value: "help", label: "Help Center", icon: HelpMenuIcon, action: () => router.replace("/settings?tab=help") },
  ];

  const navDisplayName = (() => {
    const parts = (user?.fullName || "").split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1][0]}`;
  })();

  const [notifHovered, setNotifHovered] = useState(false);
  const isNotificationRoute = router.pathname === "/notification" || router.pathname === "/notifications";
  const isDark = colorMode === "dark";
  const panelBg = isDark ? "bg_box" : "#FFFFFF";
  const panelBorder = isDark ? "border_background" : "#E7E9F0";
  const searchBorder = isDark ? "input_border" : "#C8CCD8";
  const navIdleColor = isDark ? "whiteAlpha.800" : "#4B4B52";
  const navActiveColor = "#1D2A60";

  const handleResultClick = (item: { id: string; type: "user" | "group"; name?: string }) => {
    router.push(`/profile/${item.id}`);
    setQuery("");
    setIsSearchOpen(false);
    setIsSearchFocused(false);
    if (item.name) {
      saveRecentSearch({ query: item.name, type: "user", targetId: item.id }).catch(() => {});
    }
  };

  const handleFilterSearchSelect = (item: { id: string; name: string; type: "user" | "consultant" }) => {
    router.push(`/profile/${item.id}`);
    setIsSearchFocused(false);
  };

  return (
    <Flex
      as="header"
      bg="#FFFFFF"
      borderBottomWidth="1px"
      borderColor={panelBorder}
      w="full"
      zIndex="banner"
      position="sticky"
      top={0}
      alignItems="center"
      justify="center"
      h={{ base: "80px", lg: "88px" }}
      overflow="visible"
    >
      <Flex
        w="full"
        maxW="1400px"
        px={{ base: 4, md: 5, lg: 6 }}
        pt={{ base: 2, lg: 3 }}
        h="full"
        alignItems="center"
        gap={0}
      >
        {/* Logo + Search */}
        <HStack
          flexShrink={0}
          w={{ base: "auto", lg: "220px", xl: "480px" }}
          gap={{ base: 3, lg: 3 }}
          mr={{ lg: 3, xl: 8 }}
        >
          <Box
            as="button"
            onClick={() => router.push("/home")}
            h={{ base: "44px", lg: "38px" }}
            w={{ base: "44px", lg: "38px" }}
            flexShrink={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
          >
            <Image
              boxSize="full"
              objectFit="contain"
              src={!isClient ? "/images/logo.svg" : isDark ? "/images/logoDark.svg" : "/images/logo.svg"}
              alt="logo"
            />
          </Box>

          <Box position="relative" flex="1" minW={0}>
            <InputGroup
              w="full"
              startElement={
                <Icon color={isDark ? "whiteAlpha.500" : "#9CA3AF"} boxSize={5}>
                  <CgSearch />
                </Icon>
              }
              startElementProps={{ ps: { base: 4, lg: 3 } }}
            >
              <Input
                id="search"
                name="search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && query.trim()) {
                    setIsSearchOpen(false);
                    setIsSearchFocused(false);
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  }
                }}
                h={{ base: "52px", lg: "50px" }}
                rounded="12px"
                borderWidth="1px"
                borderColor={searchBorder}
                bg={panelBg}
                fontSize="0.9rem"
                color="text_primary"
                boxShadow="none"
                _placeholder={{ color: isDark ? "whiteAlpha.400" : "#9CA3AF", fontSize: "0.9rem" }}
                _hover={{ borderColor: isDark ? "whiteAlpha.400" : "#AEB4C3" }}
                _focusVisible={{ borderColor: navActiveColor, boxShadow: `0 0 0 1px ${navActiveColor}` }}
                placeholder="Search"
              />
            </InputGroup>

            {isSearchFocused && !hasQuery && (
              <Box position="absolute" top="calc(100% + 8px)" left={0} right={0} zIndex="max" onMouseDown={(e) => e.preventDefault()}>
                <FilterSearch onSelect={handleFilterSearchSelect} />
              </Box>
            )}

            {isSearchOpen && hasQuery && (
              <Box
                position="absolute"
                top="calc(100% + 8px)"
                left={0}
                right={0}
                bg={panelBg}
                borderWidth="1px"
                borderColor={panelBorder}
                rounded="16px"
                boxShadow={isDark ? "xl" : "0 18px 36px rgba(15,23,42,0.14)"}
                zIndex="max"
                p={3}
                maxH="60vh"
                overflowY="auto"
                onMouseDown={(e) => e.preventDefault()}
              >
                {loading ? (
                  <VStack alignItems="stretch" w="full" gap={3}>
                    {[1, 2, 3, 4].map((i) => (
                      <HStack key={i} p={3} rounded="12px" gap={4}>
                        <SkeletonCircle size="6" flexShrink={0} />
                        <VStack alignItems="flex-start" gap={1.5} flex={1}>
                          <Skeleton h="3" w="45%" />
                          <Skeleton h="2.5" w="30%" />
                        </VStack>
                        <SkeletonCircle size="10" flexShrink={0} />
                      </HStack>
                    ))}
                  </VStack>
                ) : error ? (
                  <VStack w="full" py={3}>
                    <Text color="red.400">{error}</Text>
                  </VStack>
                ) : results.length === 0 ? (
                  <VStack w="full" py={3}>
                    <Text>No results found</Text>
                  </VStack>
                ) : (
                  <VStack alignItems="stretch" w="full" gap={3}>
                    {results.map((item) => (
                      <HStack
                        key={`${item.type}-${item.id}`}
                        p={3}
                        rounded="12px"
                        _hover={{ bg: "main_bg", cursor: "pointer" }}
                        onClick={() => handleResultClick({ id: item.id, type: item.type, name: item.name })}
                        gap={4}
                      >
                        <Icon size="md" color="grey.500"><CgSearch /></Icon>
                        <VStack alignItems="flex-start" gap={0} flex={1}>
                          <Text fontWeight="semibold" lineClamp={1} color="text_primary">{item.name}</Text>
                          {item.businessName && <Text fontSize="xs" color="text_muted" lineClamp={1}>{item.businessName}</Text>}
                        </VStack>
                        <Box>
                          {item.type === "user" ? (
                            <Avatar.Root boxSize="40px">
                              <Avatar.Fallback name={item.name} />
                              <Avatar.Image src={item.profilePics || undefined} />
                            </Avatar.Root>
                          ) : (
                            <Image src={item.banner || "/images/logo.svg"} alt={item.name} boxSize="40px" objectFit="cover" rounded="md" />
                          )}
                        </Box>
                      </HStack>
                    ))}
                  </VStack>
                )}
              </Box>
            )}
          </Box>
        </HStack>

        {/* Nav items + Avatar */}
        <HStack
          flex={1}
          justifyContent="flex-end"
          alignItems="center"
          gap={{ lg: 1, xl: 4 }}
          display={{ base: "none", lg: "flex" }}
          overflow="visible"
        >
          {Links.map((link) =>
            link.label === "Notifications" ? (
              <NotificationDropdown
                key={link.href}
                trigger={(onClick, unreadCount) => {
                  const showNotifActive = isNotificationRoute || notifHovered;
                  return (
                    <Box
                      cursor="pointer"
                      onClick={onClick}
                      display="flex"
                      alignItems="center"
                      onMouseEnter={() => setNotifHovered(true)}
                      onMouseLeave={() => setNotifHovered(false)}
                    >
                      <VStack
                        gap={1}
                        minW={{ lg: "auto", xl: "72px" }}
                        px={{ lg: 1.5, xl: 2 }}
                        pt={1}
                        pb={2}
                        alignItems="center"
                        justifyContent="center"
                        borderBottom="2px solid"
                        borderColor={isNotificationRoute ? navActiveColor : notifHovered ? "#D9DDE8" : "transparent"}
                        color={showNotifActive ? navActiveColor : navIdleColor}
                        transition="color 0.15s, border-color 0.15s"
                      >
                        <Box boxSize="22px" position="relative">
                          <Image
                            alt="notification"
                            h="full"
                            w="full"
                            src={isDark
                              ? showNotifActive ? link.iconActive.dark : link.icon.dark
                              : showNotifActive ? link.iconActive.light : link.icon.light}
                          />
                          {unreadCount > 0 && (
                            <Box
                              position="absolute"
                              top="-7px"
                              right="-9px"
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
                        <Text
                          className={outfit.className}
                          fontSize={{ lg: "0.6rem", xl: "0.72rem" }}
                          fontWeight={showNotifActive ? "600" : "500"}
                          lineHeight="1.1"
                          whiteSpace="nowrap"
                          textAlign="center"
                        >
                          {link.label}
                        </Text>
                      </VStack>
                    </Box>
                  );
                }}
              />
            ) : (
              <Box key={link.href} position="relative" display="flex" alignItems="center">
                <NavItem link={link} />
                {link.href === "/message" && (unreadMsgs?.totalUnreadMessages ?? 0) > 0 && (
                  <Box
                    position="absolute"
                    top="-4px"
                    right="6px"
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
                    {(unreadMsgs?.totalUnreadMessages ?? 0) > 99 ? "99+" : unreadMsgs?.totalUnreadMessages}
                  </Box>
                )}
              </Box>
            )
          )}

          {/* Avatar */}
          <Menu.Root positioning={{ placement: "bottom-end", gutter: 12 }}>
            <Menu.Trigger asChild cursor="pointer">
              <VStack
                alignItems="center"
                justifyContent="center"
                gap={0.5}
                px={2}
                pt={1}
                pb={2}
                borderBottom="2px solid transparent"
                transition="background 0.15s"
                _hover={{ bg: isDark ? "whiteAlpha.100" : "#F6F7FB" }}
                cursor="pointer"
              >
                <Avatar.Root boxSize="34px" rounded="full">
                  <Avatar.Fallback name={user?.fullName} />
                  <Avatar.Image src={user?.profilePics || DEFAULT_AVATAR} />
                </Avatar.Root>
                <HStack gap={0.5} maxW="88px">
                  <Text
                    className={outfit.className}
                    fontSize="0.72rem"
                    fontWeight="500"
                    color="text_primary"
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {navDisplayName}
                  </Text>
                  <Icon color="text_primary" boxSize={3} mt="-1">
                    <LiaSortDownSolid />
                  </Icon>
                </HStack>
              </VStack>
            </Menu.Trigger>

            <Menu.Positioner zIndex="max">
              <Menu.Content
                bg="bg_box"
                borderWidth="1px"
                borderColor="border_background"
                borderRadius="16px"
                boxShadow="none"
                minW="280px"
                p="3"
              >
                <HStack alignItems="center" gap={3} px="2" pb="3" mb="2" borderBottomWidth="1px" borderColor="border_background">
                  <Avatar.Root boxSize="12">
                    <Avatar.Fallback name={user?.fullName} />
                    <Avatar.Image src={user?.profilePics || DEFAULT_AVATAR} />
                  </Avatar.Root>
                  <VStack alignItems="flex-start" gap={0}>
                    <Text fontFamily="Outfit" fontSize="0.95rem" fontWeight="500" color="text_primary">{user?.fullName}</Text>
                    <Text fontFamily="Outfit" fontSize="0.8rem" fontWeight="400" color="grey.500">{user?.email}</Text>
                  </VStack>
                </HStack>

                {profileMenuItems.map((item) => (
                  <Menu.Item key={item.value} onClick={item.action} p={3} cursor="pointer" value={item.value} borderRadius="12px">
                    <HStack alignItems="center" justifyContent="space-between" w="full" gap={3}>
                      <HStack alignItems="center" gap={3}>
                        <Icon as={item.icon} boxSize={5} color="text_primary" />
                        <Text fontFamily="Outfit" fontSize="0.95rem" fontWeight="400" color="text_primary">{item.label}</Text>
                      </HStack>
                      {item.value === "profile" && <Icon as={LuChevronRight} boxSize={4} color="grey.500" />}
                    </HStack>
                  </Menu.Item>
                ))}

                <Menu.Item cursor="pointer" onClick={logout} p={3} value="logout" borderRadius="12px">
                  <HStack alignItems="center" gap={3}>
                    <Icon color="red.500"><HiOutlineLogout size={20} /></Icon>
                    <Text fontFamily="Outfit" fontSize="0.95rem" fontWeight="400" color="text_primary">Logout</Text>
                  </HStack>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </HStack>

        {/* Mobile only */}
        <Box display={{ base: "flex", lg: "none" }} ml="auto">
          <MobileDrawer />
        </Box>
        <SideBar open={show} onOpenChange={() => setShow(false)} />
      </Flex>
    </Flex>
  );
};

export default Header;
