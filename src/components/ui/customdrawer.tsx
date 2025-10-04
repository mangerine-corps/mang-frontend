import React, { FC } from "react";
import {
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerRoot,
  DrawerTitle,
} from "./drawer";
import { ConditionalValue, DrawerBackdrop } from "@chakra-ui/react";

type Props = {
  headerComponent: React.ReactElement;
  footerComponent?: React.ReactElement;
  bodyComponent: React.ReactElement;
  position: ConditionalValue<"start" | "end" | "top" | "bottom" | undefined>;
  open: boolean;
  trigger: (value: any) => void;
  size: ConditionalValue<"sm" | "md" | "lg" | "xl" | "xs" | "full" | undefined>;
};
const CustomDrawer: FC<Props> = ({
  open,
  size,
  trigger,
  position,
  bodyComponent,
  headerComponent,
  footerComponent,
}) => {
  return (
    <DrawerRoot
      size={size}
      open={open}
      placement={position}
      onOpenChange={(e) => trigger(e.open)}
    >
      <DrawerBackdrop />
      <DrawerContent portalled={false} px={3}>
        <DrawerHeader borderBottomWidth={1} borderBottomColor={"gray.100"}>
          <DrawerTitle>{headerComponent}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody display={"flex"} mx={0} px={0} flex={1}>
          {bodyComponent}
        </DrawerBody>
        <DrawerFooter>{footerComponent}</DrawerFooter>
      </DrawerContent>
    </DrawerRoot>
  );
};

export default CustomDrawer;
