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
      spaceX={"0"}
      gap={0.5}
      alignItems={"center"}
      cursor={action && !isDisabled ? "pointer" : "default"}
      _hover={!isDisabled && action ? { opacity: 0.8 } : {}}
    >
      {typeof icon === 'string' ? <Image alt="action icon" src={icon} /> : icon}
      <Text color={"grey.500"} fontSize={"0.75rem"} fontFamily={"Outfit"}>
        {count} {count === 1 ? desc.replace(/s$/, '') : desc}
      </Text>
    </HStack>
  );
};

export default NewsAction;
