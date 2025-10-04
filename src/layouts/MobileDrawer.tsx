import {
  Box,
  Button,
  CloseButton,
  Drawer,
  Image,
  Link,
  Portal,
  VStack,
} from "@chakra-ui/react";
import { NavItem } from "mangarine/components/customcomponents/navitemcomp";
import { NavLinks } from "mangarine/components/customcomponents/navitems";
import { useColorMode } from "mangarine/components/ui/color-mode";
import { useEffect, useState } from "react";

export const MobileDrawer = () => {
   const [isClient, setIsClient] = useState(false);
 const { colorMode } = useColorMode();
   useEffect(() => {
     setIsClient(true);
   }, []);
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
              <Drawer.Header>
                {/* <Drawer.Title>Drawer Title</Drawer.Title> */}
              </Drawer.Header>
              <Drawer.Body pt="6">
                <VStack
                  spaceY="8"
                  alignItems={"flex-start"}
                  justifyContent={"flex-start"}
                  pl="8"
                >
                  <Link href="#" mr="6">
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

                  {NavLinks.map((link) => (
                    <NavItem key={link.href} link={link} />
                  ))}
                </VStack>
              </Drawer.Body>
              {/* <Drawer.Footer>
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </Drawer.Footer> */}
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
