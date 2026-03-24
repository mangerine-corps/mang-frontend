
import {
  Text,
  Box,
  VStack,
  Image,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import Link from "next/link";
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
  const isActive = pathname === link.href;
  const { colorMode } = useColorMode();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <LinkBox w={isMobile ? "full" : "auto"}>
        <LinkOverlay href={link.href}>
          <VStack
            spaceY="0"
            w={isMobile ? "full" : "auto"}
            bg={isMobile && isActive ? "#111D4A" : "transparent"}
            px={isMobile ? 4 : 0}
            py={isMobile ? 2 : 0}
            rounded={isMobile ? "md" : "none"}
            borderBottom={!isMobile && isActive ? "2px solid" : "2px solid transparent"}
            borderColor={!isMobile && isActive ? "button_bg" : "transparent"}
            color={isMobile && isActive ? "white" : isActive ? "button_bg" : "#494949"}
            _hover={{ color: isMobile ? "white" : "text_primary", bg: isMobile ? "#111D4A" : "transparent", borderColor: "button_bg" }}
            transition="all 0.2s"
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent={isMobile ? "flex-start" : "center"}
            flexDir={{ base: "row", md: "column", lg: "column", xl: "column" }}
          >
            <Box filter={isMobile && isActive ? "brightness(0) invert(1)" : "none"}>
              {!isClient ? (
                // Show a default icon during SSR to prevent hydration mismatch
                <Box boxSize={5}>
                  <Image
                    alt={"nav icons"}
                    maxH={5}
                    maxW={5}
                    src={link.icon.light}
                  />
                </Box>
              ) : colorMode === "dark" ? (
                <>
                  {isActive ? (
                    <Box boxSize={5}>
                      <Image
                        alt={"nav icons"}
                        maxH={5}
                        maxW={5}
                        src={link.iconActive.dark}
                      />
                    </Box>
                  ) : (
                    <Box boxSize={5}>
                      <Image
                        alt={"nav icons"}
                        maxH={5}
                        maxW={5}
                        src={link.icon.dark}
                      />
                    </Box>
                  )}
                </>
              ) : (
                <>
                  {isActive ? (
                    <Box boxSize={5}>
                      <Image
                        alt={"nav icons"}
                        maxH={5}
                        maxW={5}
                        src={link.iconActive.light}
                      />
                    </Box>
                  ) : (
                    <Box boxSize={5}>
                      <Image
                        alt={"nav icons"}
                        maxH={5}
                        maxW={5}
                        src={link.icon.light}
                      />
                    </Box>
                  )}
                </>
              )}
            </Box>
            <Text
              className={outfit.className}
              fontSize={"0.688rem"}
              fontWeight={isActive ? "600" : "normal"}
            >
              {link.label}
            </Text>
          </VStack>
        </LinkOverlay>
      </LinkBox>
    </>
  );
};
