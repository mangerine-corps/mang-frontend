import { HStack, List, Text, VStack } from "@chakra-ui/react";
import { isEmpty } from "es-toolkit/compat";
import React from "react";

type Props = {
  title?: string;
  desc1?: string;
  extra1?: string;
  desc2?: string;
  extra2?: string;
  desc3?: string;
  extra3?: string;
  desc4?: string;
  extra4?: string;
  intro1?: string;intro2?: string;
};

const ContentCompWithSubs = ({
  title,
  desc1,
  extra1,
  desc2,
  extra2,
  desc3,
  extra3,
  desc4,
  extra4,
  intro1,
  intro2
}: Props) => {
  return (
    <VStack alignItems="flex-start"w="full">
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
              {intro1}
            </Text>

      {/* Row 1 */}
  
        <List.Root as="ul">
          {
            isEmpty(desc1) ? null :   <List.Item color="text_primary">
          <HStack alignItems="flex-start"w="full">
             <Text
          fontFamily="outfit"
          fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
          fontWeight="500"
          color="text_primary"
        >
          {desc1}
        </Text>
         <Text
          fontFamily="outfit"
          fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
          fontWeight="400"
          color="text_primary"
          whiteSpace="pre-wrap"
        >
          {extra1}
        </Text>
          </HStack>
   
      </List.Item>
          }
      {
        isEmpty(desc2) ? null :       <List.Item>
          {/* Row 2 */}
      <HStack alignItems="flex-start"w="full">
        <Text
          fontFamily="outfit"
          fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
          fontWeight="500"
          color="text_primary"
          whiteSpace="pre-wrap"
        >
          {desc2}
        </Text>
        <Text
          fontFamily="outfit"
          fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
          fontWeight="400"
          color="text_primary"
          whiteSpace="pre-wrap"
        >
          {extra2}
        </Text>
      </HStack>
      </List.Item>
      }
 {
        isEmpty(desc3) ? null : <List.Item>
   
      {/* Row 3 */}
      <HStack alignItems="flex-start"w="full">
        <Text
          fontFamily="outfit"
          fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
          fontWeight="500"
          color="text_primary"
          whiteSpace="pre-wrap"
        >
          {desc3}
        </Text>
        <Text
          fontFamily="outfit"
          fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
          fontWeight="400"
          color="text_primary"
          whiteSpace="pre-wrap"
        >
          {extra3}
        </Text>
      </HStack>
      </List.Item>
 }
     {
        isEmpty(desc4) ? null :   <List.Item>
      {/* Row 4 */}
      <HStack alignItems="flex-start"w="full">
        <Text
          fontFamily="outfit"
          fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
          fontWeight="500"
          color="text_primary"
          whiteSpace="pre-wrap"
        >
          {desc4}
        </Text>
        <Text
          fontFamily="outfit"
          fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
          fontWeight="400"
          color="text_primary"
          whiteSpace="pre-wrap"
        >
          {extra4}
        </Text>
      </HStack>
      </List.Item>
     }
    
    </List.Root>
       
      <Text
              fontFamily="outfit"
              fontSize={{ base: "0.8rem", md: "0.875rem", lg: "1rem" }}
              fontWeight="400"
              color="text_primary"
              whiteSpace="pre-wrap"
            >
              {intro1}
            </Text>

 



    </VStack>
  );
};

export default ContentCompWithSubs;
