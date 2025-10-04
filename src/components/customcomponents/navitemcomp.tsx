
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
}

export const NavItem: React.FC<Props> = ({ link }) => {
  const pathname = usePathname();
  const isActive = pathname === link.href;
  const { colorMode } = useColorMode();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <LinkBox>
        <LinkOverlay href={link.href}>
          <VStack
            // space={4}
            spaceY="0"
            // bg={isActive ? "blue.600" : "transparent"}
            // px={2}
            // py={2}
            borderBottom={isActive ? "2px solid" : "2px solid transparent"}
            // pl={isActive ? "0" : "2"}
            borderColor={isActive ? "button_bg" : "transparent"}
            color={isActive ? "button_bg" : "grey.300"}
            _hover={{ color: "text_primary", borderColor: "button_bg" }}
            transition="all 0.2s"
            alignItems="center"
            justifyContent="center"
            flexDir={{ base: "row", md: "column", lg: "column", xl: "column" }}
          >
            <Box>
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
