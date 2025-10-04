import { HStack, List, Text, VStack } from "@chakra-ui/react";
import { isEmpty } from "es-toolkit/compat";
import React from "react";

type Props = {
  title?: string;
  desc?: string;
  extra?: string;
  intro?: string;
};

const ContentComp = ({ title, desc, extra, intro }: Props) => {
  return (
    <VStack alignItems="flex-start" spaceY={1.5} w="full">
      {/* Title */}
      <Text
        fontFamily="outfit"
        fontSize={{ base: "1rem", md: "1.2rem", lg: "1.25rem" }}
        fontWeight="500"
        color="text_primary"
        lineHeight="1.6"
        whiteSpace="pre-wrap"
      >
        {title}
      </Text>
      <Text
        fontFamily="outfit"
        fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
        fontWeight="400"
        color="text_primary"
        whiteSpace="pre-wrap"
      >
        {intro}
      </Text>

      {/* Content */}
      <List.Root as="ul">
        {isEmpty(desc) ? (
          <Text
            fontFamily="outfit"
            fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
            fontWeight="400"
            color="text_primary"
            whiteSpace="pre-wrap"
          >
            {extra}
          </Text>
        ) : (
          <List.Item color="text_primary">
            <HStack alignItems="flex-start" w="full">
              <Text
                fontFamily="outfit"
                fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
                fontWeight="500"
                color="text_primary"
              >
                {desc}
              </Text>
              <Text
                fontFamily="outfit"
                fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
                fontWeight="400"
                color="text_primary"
                whiteSpace="pre-wrap"
              >
                {extra}
              </Text>
            </HStack>
          </List.Item>
        )}
      </List.Root>
    </VStack>
  );
};

export default ContentComp;
