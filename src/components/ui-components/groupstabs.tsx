import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

interface GroupsTabsProps {
  Groups?: React.ReactNode;
  specified: React.ReactNode;
}

const GroupsTabs: React.FC<GroupsTabsProps> = ({
  Groups,
  specified,
}) => {
  const [activeTab, setActiveTab] = useState<"Groups" | "specified">(
    "Groups"
  );

  // helper function to render the corresponding component
  const renderContent = () => {
    switch (activeTab) {
      case "Groups":
        return <Box>{Groups}</Box>;
      case "specified":
        return <Box>{specified}</Box>;

      default:
        return <Box>{Groups}</Box>;
    }
  };

  return (
    <Box width={{ base: "98%", md: "98%", lg: "100%" }} mx="auto">
      <Flex
        justifyContent="flex-start"
        alignItems="center"
        background="main_background"
        px="4"
        py="3"
        borderRadius="10px"
      >
        <Box
          display="inline-block"
          textAlign="center"
          borderBottom={
            activeTab === "Groups" ? "2px solid black" : "2px solid transparent"
          }
          cursor="pointer"
          onClick={() => setActiveTab("Groups")}
          transition="border-color 0.2s ease"
          pb="2"
          mr="10"
        >
          <Text
            color={activeTab === "Groups" ? "text_primary" : "#999999"}
            fontSize={{ base: "0.75", md: "1rem", lg: "1.25rem" }}
            fontWeight={activeTab === "Groups" ? "bold" : "normal"}
          >
            All Groups
          </Text>
        </Box>

        <Box
          display="inline-block"
          textAlign="center"
          borderBottom={
            activeTab === "specified"
              ? "2px solid black"
              : "2px solid transparent"
          }
          cursor="pointer"
          onClick={() => setActiveTab("specified")}
          transition="border-color 0.2s ease"
          pb={2}
        >
          <Text
            color={activeTab === "specified" ? "text_primary" : "#999999"}
            fontSize={{ base: "0.75", md: "1rem", lg: "1.25rem" }}
            fontWeight={activeTab === "specified" ? "bold" : "normal"}
          >
            My Groups
          </Text>
        </Box>
      </Flex>

      <Box mt="0">{renderContent()}</Box>
    </Box>
  );
};

export default GroupsTabs;
