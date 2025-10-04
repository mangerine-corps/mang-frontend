import { HStack, Image, Text } from "@chakra-ui/react";
import React from "react";

interface NewsActionProps {
  icon?: string | React.ReactElement;
  count: number;
  desc: string;
  action?: () => void;
  isDisabled?: boolean;
}

const NewsAction: React.FC<NewsActionProps> = ({
  icon,
  count,
  desc,
  action,
  isDisabled = false,
}) => {
  return (
    <HStack
      onClick={!isDisabled ? action : undefined}
      spaceX={"0.5"}
      alignItems={"center"}
      cursor={action && !isDisabled ? "pointer" : "default"}
      _hover={!isDisabled && action ? { opacity: 0.8 } : {}}
    >
      <Text color={"grey.500"} fontSize={"1rem"} fontFamily={"Outfit"}>
        {count}
      </Text>
      {
        typeof icon === 'string' ? (
          <Image alt="action icon" src={icon} />

        ) : (
          icon
        )
      }
      <Text color={"grey.500"} fontSize={"1rem"} fontFamily={"Outfit"} display={{ base: "none", md: "none", lg: "none", xl: "block" }}>
        {desc}
      </Text>
    </HStack>
  );
};

export default NewsAction;
