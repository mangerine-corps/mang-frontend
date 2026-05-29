
import {
  Text,
  Box,
  VStack,
  Image,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { NavLink } from "./navitems";
import { outfit } from "mangarine/pages/_app";
import { useColorMode } from "../ui/color-mode";
import { useState, useEffect } from "react";

interface Props {
  link: NavLink;
  isMobile?: boolean;
}

export const NavItem: React.FC<Props> = ({ link, isMobile }) => {
  const pathname = usePathname();
  const normalizedHref = link.href.endsWith("/") && link.href !== "/" ? link.href.slice(0, -1) : link.href;
  const normalizedPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const isNotificationAlias = normalizedHref === "/notification" && normalizedPath === "/notifications";
  const isActive =
    isNotificationAlias ||
    normalizedPath === normalizedHref ||
    (normalizedHref !== "/home" && normalizedPath.startsWith(`${normalizedHref}/`));
  const { colorMode } = useColorMode();
  const [isClient, setIsClient] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const showActive = isActive || isHovered;

  const iconSrc = !isClient
    ? link.icon.light
    : colorMode === "dark"
      ? showActive ? link.iconActive.dark : link.icon.dark
      : showActive ? link.iconActive.light : link.icon.light;

  return (
    <>
      <LinkBox
        w={isMobile ? "full" : "auto"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <LinkOverlay href={link.href}>
          <VStack
            gap={isMobile ? 2 : 1}
            w={isMobile ? "full" : "auto"}
            bg={isMobile && showActive ? "#111D4A" : "transparent"}
            minW={isMobile ? "full" : "78px"}
            px={isMobile ? 4 : 2}
            py={isMobile ? 2 : 1}
            pb={isMobile ? 2 : 2}
            rounded={isMobile ? "md" : "none"}
            borderBottom={!isMobile && isActive ? "2px solid" : "2px solid transparent"}
            borderColor={!isMobile ? (isActive ? "#1D2A60" : isHovered ? "#D9DDE8" : "transparent") : "transparent"}
            color={isMobile && showActive ? "white" : showActive ? "#1D2A60" : colorMode === "dark" ? "whiteAlpha.800" : "#4B4B52"}
            transition="all 0.2s"
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent={isMobile ? "flex-start" : "center"}
            flexDir={{ base: "row", md: "column", lg: "column", xl: "column" }}
          >
            <Box
              boxSize={isMobile ? "20px" : "22px"}
              display="flex"
              alignItems="center"
              justifyContent="center"
              filter={isMobile && showActive ? "brightness(0) invert(1)" : "none"}
            >
              <Box boxSize="full">
                <Image alt="nav icon" h="full" w="full" src={iconSrc} />
              </Box>
            </Box>
            <Text
              className={outfit.className}
              fontSize={isMobile ? "0.95rem" : "0.74rem"}
              fontWeight={showActive ? "600" : "500"}
              lineHeight="1.1"
              textAlign="center"
              whiteSpace="nowrap"
            >
              {link.label}
            </Text>
          </VStack>
        </LinkOverlay>
      </LinkBox>
    </>
  );
};
