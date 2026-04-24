import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Drawer,
  HStack,
  Icon,
  Image,
  Link,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { NavItem } from "mangarine/components/customcomponents/navitemcomp";
import { NavLinks, UserLinks } from "mangarine/components/customcomponents/navitems";
import { useColorMode } from "mangarine/components/ui/color-mode";
import { useEffect, useState } from "react";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useDispatch } from "react-redux";
import { signOut } from "mangarine/state/reducers/auth.reducer";
import { HiOutlineLogout } from "react-icons/hi";
import { useRouter } from "next/router";

export const MobileDrawer = () => {
  const [isClient, setIsClient] = useState(false);
  const { colorMode } = useColorMode();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const links = user?.isConsultant === true ? NavLinks : UserLinks;

  const logout = () => {
    dispatch(signOut());
  };

  return (
    <Box display={{ base: "flex", md: "flex", lg: "none" }}>
      <Drawer.Root size={"xs"}>
        <Drawer.Trigger asChild>
          <Button variant="ghost" size="sm">
            <Image src="/icons/menu.svg" alt="menu-button" />
          </Button>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header pb={2}>
                <Link href="/home">
                  <Image
                    src={
                      !isClient
                        ? "/images/logo.svg"
                        : colorMode === "dark"
                          ? "/images/logoDark.svg"
                          : "/images/logo.svg"
                    }
                    alt="logo"
                    w="8"
                  />
                </Link>
              </Drawer.Header>
              <Drawer.Body pt="2">
                <VStack
                  gap={6}
                  alignItems={"flex-start"}
                  justifyContent={"flex-start"}
                  w="full"
                  px="2"
                >
                  {/* User profile summary */}
                  <HStack
                    w="full"
                    px="2"
                    py="3"
                    borderRadius="12px"
                    bg="bd_background"
                    cursor="pointer"
                    onClick={() => router.push("/profile")}
                    gap={3}
                  >
                    <Avatar.Root boxSize="10" rounded="full">
                      <Avatar.Fallback name={user?.fullName} />
                      <Avatar.Image src={user?.profilePics} />
                    </Avatar.Root>
                    <VStack alignItems="flex-start" gap={0} minW={0}>
                      <Text
                        fontWeight="600"
                        fontSize="0.9rem"
                        color="text_primary"
                        lineClamp={1}
                      >
                        {user?.fullName}
                      </Text>
                      <Text fontSize="0.75rem" color="text_muted" lineClamp={1}>
                        {user?.email}
                      </Text>
                    </VStack>
                  </HStack>

                  {links.map((link) => (
                    <NavItem key={link.href} link={link} isMobile />
                  ))}

                  {/* Logout */}
                  <HStack
                    w="full"
                    px="2"
                    py="2"
                    cursor="pointer"
                    borderRadius="8px"
                    gap={3}
                    onClick={logout}
                    _hover={{ bg: "bd_background" }}
                    mt="2"
                  >
                    <Icon color="red.500">
                      <HiOutlineLogout size={20} />
                    </Icon>
                    <Text fontSize="0.95rem" color="red.500" fontWeight="400">
                      Logout
                    </Text>
                  </HStack>
                </VStack>
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  );
};
