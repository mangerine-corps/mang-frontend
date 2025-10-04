import { Box, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";

interface ConsultantTabsProps {

  consultant?: React.ReactNode;
  specified: React.ReactNode;
}

const ConsultantTabs: React.FC<ConsultantTabsProps> = ({

  consultant,
  specified,
}) => {
  const [activeTab, setActiveTab] = useState<
     "consultant" | "specified"
  >("consultant");

  // helper function to render the corresponding component
  const renderContent = () => {
    switch (activeTab) {
      case "consultant":
        return <Box>{consultant}</Box>;
      // case "specified":
      //   return <Box>{specified}</Box>;

      default:
        return <Box>{consultant}</Box>;
    }
  };

  return (
    <Box
      width="100%"

      mx="auto"

      borderRadius="16px"
      background="main_background"

      p={4}
      mt={{base:"3", lg:"0"}}

    >
      <Flex justifyContent="flex-start" alignItems="center" >
        <Box
          display="inline-block"
          textAlign="center"
          borderBottom={
            activeTab === "consultant"
              ? "2px solid black"
              : "2px solid transparent"
          }
          cursor="pointer"
          onClick={() => setActiveTab("consultant")}
          transition="border-color 0.2s ease"
         pb="2"
          mr="10"
        >
          <Text
            color={activeTab === "consultant" ? "text_primary" : "#999999"}
            fontSize={{base:"1rem",lg:"1.25rem"}}
            fontWeight={activeTab === "consultant" ? "bold" : "normal"}
          >
            All Consultant
          </Text>
        </Box>

        {/* <Box
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
           fontSize={{base:"1rem",lg:"1.25rem"}}
            fontWeight={activeTab === "specified" ? "bold" : "normal"}
          >
           Medical Consultant
          </Text>
        </Box> */}
      </Flex>

      <Box mt="4">{renderContent()}</Box>
    </Box>
  );
};

export default ConsultantTabs;
