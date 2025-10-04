import { Box, Flex, Input, Text } from "@chakra-ui/react";
import { BiSearch } from "react-icons/bi";

const SearchInput = ({  }) => {
  return (
    <Box
     // w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}
     w="450px"
     h="50px"
      borderRadius="md"
      boxShadow="sm"
      bg="bg_box"
      px={2}
      py={2}
    >
      <Flex
        align="center"
       // border="1px solid"
       // borderColor="gray.300"
       // borderRadius="md"
        px={3}
        py={1}
        bg="gray.50"
        w="100%"
      >
        <BiSearch color="#999" size="18px" />
        <Text fontSize="14px" color="gray.600" mx={2} whiteSpace="nowrap">
          Search Settings
        </Text>
        <Input
          // variant="unstyled"
         // placeholder={placeholder}
         // _placeholder={{ color: "#999" }}
          //fontSize="14px"
         // flex="1"
        />
      </Flex>
    </Box>
  );
};

export default SearchInput;
