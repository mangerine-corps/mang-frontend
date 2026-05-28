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
      gap={2}
      alignItems="center"
      cursor={action && !isDisabled ? "pointer" : "default"}
      _hover={!isDisabled && action ? { opacity: 0.75 } : {}}
      flexShrink={0}
    >
      {typeof icon === "string" ? (
        <Image alt="action icon" src={icon} boxSize="20px" objectFit="contain" />
      ) : (
        icon
      )}
      <HStack gap={1.5} alignItems="center">
        <Text
          color="grey.600"
          fontSize={{ base: "0.78rem", md: "0.82rem" }}
          fontFamily="Outfit"
          fontWeight="600"
        >
          {count}
        </Text>
        <Text
          color="grey.500"
          fontSize={{ base: "0.78rem", md: "0.82rem" }}
          fontFamily="Outfit"
          fontWeight="400"
          display={{ base: "none", md: "inline" }}
        >
          {count === 1 ? desc.replace(/s$/, "") : desc}
        </Text>
      </HStack>
    </HStack>
  );
};

export default NewsAction;
