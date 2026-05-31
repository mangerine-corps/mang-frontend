
import {
  Text,
  Box,
  VStack,
  Image,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { NavLink } from "./navitems";
import { outfit } from "mangarine/pages/_app";
import { useColorMode } from "../ui/color-mode";
import { useState, useEffect } from "react";

interface Props {
  link: NavLink;
  isMobile?: boolean;
}

export const NavItem: React.FC<Props> = ({ link, isMobile }) => {
  const router = useRouter();
  const pathname = router.asPath.split("?")[0] || router.pathname || "/";
  const normalizedHref = link.href.endsWith("/") && link.href !== "/" ? link.href.slice(0, -1) : link.href;
  const normalizedPath = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const isActive =
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
    <NextLink href={link.href} style={{ textDecoration: "none" }}>
      <VStack
        as="span"
        gap={isMobile ? 2 : 1}
        w={isMobile ? "full" : "auto"}
        bg={isMobile && showActive ? "#111D4A" : "transparent"}
        minW={isMobile ? "full" : { lg: "54px", xl: "72px" }}
        px={isMobile ? 4 : { lg: 1, xl: 2 }}
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        cursor="pointer"
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
          fontSize={isMobile ? "0.95rem" : { lg: "0.6rem", xl: "0.72rem" }}
          fontWeight={showActive ? "600" : "500"}
          lineHeight="1.1"
          textAlign="center"
          whiteSpace="nowrap"
        >
          {link.label}
        </Text>
      </VStack>
    </NextLink>
  );
};
