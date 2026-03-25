import {
  Box,
  Drawer as ChakraDrawer,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import * as React from "react";
import { LuX } from "react-icons/lu";

type TopRightDrawerProps = {
  open: boolean;
  onOpenChange: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  headerAction?: React.ReactNode;
  drawerWidth?: ChakraDrawer.ContentProps["width"];
  drawerMaxW?: ChakraDrawer.ContentProps["maxW"];
  drawerHeight?: ChakraDrawer.ContentProps["height"];
  drawerMaxH?: ChakraDrawer.ContentProps["maxH"];
  borderRadius?: ChakraDrawer.ContentProps["borderRadius"];
  contentProps?: ChakraDrawer.ContentProps;
  bodyProps?: ChakraDrawer.BodyProps;
  positionerProps?: ChakraDrawer.PositionerProps;
};

const TopRightDrawer = ({
  open,
  onOpenChange,
  title,
  children,
  size = "md",
  headerAction,
  drawerWidth = { base: "100vw", md: "680px", xl: "720px" },
  drawerMaxW = { base: "100vw", md: "680px", xl: "720px" },
  drawerHeight = "auto",
  drawerMaxH = "80dvh",
  borderRadius = "0",
  contentProps,
  bodyProps,
  positionerProps,
}: TopRightDrawerProps) => {
  return (
    <ChakraDrawer.Root size={size} open={open} onOpenChange={onOpenChange}>
      <ChakraDrawer.Backdrop />
      <ChakraDrawer.Trigger />
      <ChakraDrawer.Positioner
        zIndex="max"
        alignItems="flex-start"
        justifyContent="flex-end"
        p="0"
        {...positionerProps}
      >
        <ChakraDrawer.Content
          w={drawerWidth}
          maxW={drawerMaxW}
          minW="0"
          h={drawerHeight}
          maxH={drawerMaxH}
          borderRadius={borderRadius}
          overflow="hidden"
          bg="bg_box"
          boxShadow="0px 20px 48px rgba(15, 23, 42, 0.18)"
          display="flex"
          flexDirection="column"
          {...contentProps}
        >
          <ChakraDrawer.Header px={{ base: 4, lg: 6 }} py={{ base: 4, lg: 5 }}>
            <HStack w="full" justifyContent="space-between" alignItems="center">
              <ChakraDrawer.Title asChild>
                <Text
                  fontWeight="700"
                  fontSize={{ base: "1.5rem", lg: "2rem" }}
                  fontFamily="Outfit"
                  color="text_primary"
                >
                  {title}
                </Text>
              </ChakraDrawer.Title>

              <HStack gap={3}>
                {headerAction}
                <IconButton
                  aria-label="Close drawer"
                  variant="outline"
                  borderColor="gray.200"
                  color="text_primary"
                  size="sm"
                  onClick={onOpenChange}
                >
                  <LuX />
                </IconButton>
              </HStack>
            </HStack>
          </ChakraDrawer.Header>

          <ChakraDrawer.Body
            px={{ base: 4, lg: 6 }}
            pb={{ base: 12, lg: 16 }}
            flex="1"
            minH="0"
            overflowY="auto"
            {...bodyProps}
          >
            <Box w="full">{children}</Box>
          </ChakraDrawer.Body>
        </ChakraDrawer.Content>
      </ChakraDrawer.Positioner>
    </ChakraDrawer.Root>
  );
};

export default TopRightDrawer;
