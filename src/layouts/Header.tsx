import {
  Avatar,
  Box,
  Flex,
  HStack,
  Icon,
  Image,
  Menu,
  Stack,
  Text,
  VStack,
  Spinner,
  Badge,
} from "@chakra-ui/react";
import { NavItem } from "mangarine/components/customcomponents/navitemcomp";
import { NavLinks, UserLinks } from "mangarine/components/customcomponents/navitems";
import { MobileDrawer } from "./MobileDrawer";
import { useColorMode } from "mangarine/components/ui/color-mode";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { LiaSortDownSolid } from "react-icons/lia";
import { LuPencilLine } from "react-icons/lu";
import { SlSettings } from "react-icons/sl";
import { HiOutlineLogout } from "react-icons/hi";
import { useRouter } from "next/router";
import { signOut } from "mangarine/state/reducers/auth.reducer";
import { useEffect, useState } from "react";
// Removed Drawer; we now render an inline dropdown below the search input
import SideBar from "./Sidebar";
import { CgSearch } from "react-icons/cg";
import CustomInput from "mangarine/components/customcomponents/Input";
import { isEmpty, size } from "es-toolkit/compat";
import { useSearch } from "mangarine/hooks/useSearch";
import { useGetUnreadNotificationsQuery, useGetUnreadTotalMessagesQuery } from "mangarine/state/services/chat-management.service";
import { IoNotificationsOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";

const Header = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [show, setShow] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [Links, setLinks] = useState(NavLinks)
  const router = useRouter();
  const [isClient, setIsClient] = useState(false)
  const { colorMode } = useColorMode();
  const { query, setQuery, results, loading, hasQuery, error } = useSearch(10);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: notif } = useGetUnreadNotificationsQuery();
  const { data: unreadMsgs } = useGetUnreadTotalMessagesQuery();
  useEffect(() => {
    setIsClient(true);
  }, []);
  // const isConsultant = user.isConsultant;
  const logout = () => {
    dispatch(signOut());
  };

  useEffect(() => {
    const isConsultant = user?.isConsultant === true;
    setLinks(isConsultant ? NavLinks : UserLinks)
  }, [user])

  useEffect(() => {
    setIsSearchOpen(Boolean(hasQuery));
  }, [hasQuery]);

  const handleResultClick = (item: { id: string; type: 'user' | 'group' }) => {
    if (item.type === 'user') {
      router.push(`/profile?profileId=${item.id}`);
    } else {
      router.push(`/groups/${item.id}`);
    }
    setIsSearchOpen(false);
  };


  return (
    <Flex
      as="header"
      mb={{ base: "0", md: "16px" }}
      bg="main_background"
      py={6} // smaller padding since we'll control height
      px={{ base: "12px", md: "16px", lg: "18px", xl: "32px" }}
      overflow="visible"
      zIndex="max"
      maxW="8xl"
      justifyContent="space-between"
      alignItems="center"
      minH="64px" // <-- fixes nav from shr
    >
      <HStack
        w={{ base: "full", md: "full", lg: "35%" }}
        justifyContent="flex-start"
      >
        <Stack
          as={"button"}
          onClick={() => {
            setShow(true);
          }}
          mr="6"
          h="40px"
          w="auto"
          // bg="red.800"
          cursor={"pointer"}
        >
          <Image
            boxSize={{ base: "32px", md: "40px" }} // fixed logo size
            objectFit="contain"
            src={
              !isClient
                ? "/images/logo.svg"
                : colorMode === "dark"
                  ? "/images/logoDark.svg"
                  : "/images/logo.svg"
            }
            alt="logo"
            h="full"
          />
        </Stack>
        <Box position="relative" flex={1} w="full">
          <CustomInput
            label=""
            placeholder="Search"
            id="search"
            required={false}
            name="search"
            value={query}
            size="md"
            onChange={(val) => setQuery(val)}
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

          {isSearchOpen && (
            <Box
              position="absolute"
              top="calc(100% + 8px)"
              left={0}
              right={0}
              bg="main_background"
              borderWidth="1px"
              borderColor="input_border"
              rounded="md"
              shadow="lg"
              zIndex="max"
              p={3}
              maxH="60vh"
              overflowY="auto"
            >
              {loading ? (
                <HStack w="full" justifyContent="center" py={4}>
                  <Spinner />
                  <Text>Searching…</Text>
                </HStack>
              ) : error ? (
                <VStack w="full" py={3}>
                  <Text color="red.400">{error}</Text>
                </VStack>
              ) : results.length === 0 && hasQuery ? (
                <VStack w="full" py={3}>
                  <Text>No results found</Text>
                </VStack>
              ) : (
                <VStack alignItems="stretch" w="full" gap={3}>
                  {results.map((item) => (
                    <HStack
                      key={`${item.type}-${item.id}`}
                      p={3}
                      rounded="md"
                      borderWidth="1px"
                      borderColor="input_border"
                      _hover={{ bg: "main_bg", cursor: "pointer" }}
                      onClick={() => handleResultClick(item)}
                      gap={4}
                    >
                      <Box>
                        {item.type === 'user' ? (
                          <Avatar.Root boxSize="40px">
                            <Avatar.Fallback name={item.name} />
                            <Avatar.Image src={item.profilePics || undefined} />
                          </Avatar.Root>
                        ) : (
                          <Image
                            src={item.banner || "/images/logo.svg"}
                            alt={item.name}
                            boxSize="40px"
                            objectFit="cover"
                            rounded="md"
                          />
                        )}
                      </Box>
                      <VStack alignItems="flex-start" gap={0} flex={1}>
                        <Text fontWeight="semibold" lineClamp={1}>{item.name}</Text>
                        <Badge size="sm" colorPalette={item.type === 'user' ? 'blue' : 'purple'}>{item.type}</Badge>
                      </VStack>
                    </HStack>
                  ))}
                </VStack>
              )}
            </Box>
          )}
        </Box>
      </HStack>
      <HStack w="60%" justifyContent={"flex-end"}>
        <MobileDrawer />

        <HStack spaceX={3} display={{ base: "none", md: "none", lg: "flex" }}>
          {Links.map((link) => (
            <Box key={link.href} position="relative">
              <NavItem link={link} />
              {link.href === "/message" && (unreadMsgs?.totalUnreadMessages ?? 0) > 0 && (
                <Box
                  position="absolute"
                  top={-1}
                  right={-1}
                  bg="text_primary"
                  color="main_background"
                  fontWeight="bold"
                  rounded="full"
                  minW="12px"
                  h="12px"
                  px={0.5}
                  fontSize="6px"
                  lineHeight="12px"
                  textAlign="center"
                  pointerEvents="none"
                >
                  {unreadMsgs?.totalUnreadMessages}
                </Box>
              )}
            </Box>
          ))}
        </HStack>
        {/* Notification Icon with Unread Badge */}
        <Box position="relative" top={-5} right={8} mr={3} display={{ base: "none", lg: "block" }}>
          {(notif?.totalUnreadNotifications ?? 0) > 0 && (
            <Box
              position="absolute"
              top={-1}
              right={-1}
              bg="text_primary"
              color="main_background"
              fontWeight="bold"
              rounded="full"
              minW="12px"
              h="12px"
              px={0.5}
              fontSize="6px"
              lineHeight="12px"
              textAlign="center"
              pointerEvents="none"
            >
              {notif?.totalUnreadNotifications}
            </Box>
          )}
        </Box>
        <VStack gap={1} mb={0.5} display={{ base: "none", lg: "flex" }}>
          <Avatar.Root
            width={{ base: "25px", lg: "25px" }}
            height={{ base: "25px", lg: "25px" }}
            rounded={"full"}
            objectFit="cover"
            boxSize="32px" // fixes avatar size
          >
            <Avatar.Fallback name={`${user?.fullName}`} />
            <Avatar.Image src={user?.profilePics} />
          </Avatar.Root>

          <Menu.Root positioning={{ placement: "bottom" }}>
            <Menu.Trigger asChild cursor={"pointer"}>
              <HStack alignItems={"center"}>
                <Text
                  fontSize={"0.688rem"}
                  color={"gray.300"}
                  textTransform={"capitalize"}
                >
                  {(!isEmpty(user?.fullName) && size(user?.fullName.split(" ")) > 1) ? user?.fullName.split(" ")[0] + user?.fullName.split(" ")[1][0] : user?.fullName}

                </Text>
                <Icon color="gray.300">
                  <LiaSortDownSolid />
                </Icon>
              </HStack>
            </Menu.Trigger>

            <Menu.Positioner zIndex={"max"}>
              <Menu.Content bg="main_bg">
                <Menu.Item
                  onClick={() => router.replace("/profile")}
                  p={3}
                  cursor={"pointer"}
                  value="profile"
                >
                  <HStack alignItems={"center"}>
                    <Icon size={"md"}>
                      <LuPencilLine />
                    </Icon>
                    <Text>My Profile</Text>
                  </HStack>
                </Menu.Item>
                <Menu.Item
                  cursor={"pointer"}
                  onClick={() => router.replace("/settings")}
                  p={3}
                  value="settings"
                >
                  <HStack alignItems={"center"}>
                    <Icon size={"md"}>
                      <SlSettings />
                    </Icon>
                    <Text>Settings</Text>
                  </HStack>
                </Menu.Item>
                <Menu.Item
                  cursor={"pointer"}
                  onClick={logout}
                  p={3}
                  value="logout"
                >
                  <HStack alignItems={"center"}>
                    <Icon color="red.600">
                      <HiOutlineLogout size={20} />
                    </Icon>
                    <Text>Logout</Text>
                  </HStack>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>
        </VStack>
        {/* <ColorModeButton /> */}
      </HStack>
      <SideBar
        open={show}
        onOpenChange={() => {
          setShow(false);
        }}
      />

      {/* Inline search dropdown rendered above; Drawer removed */}
    </Flex>
  );
};

export default Header;
