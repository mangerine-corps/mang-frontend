import { Box, HStack, VStack } from "@chakra-ui/react";
import AppLayout from "mangarine/layouts/AppLayout";
import ShareReview from "mangarine/components/ui-components/sharereview";
import AddPaymentMethod from "mangarine/components/ui-components/addpaymentmethod";
import ActivityOverview from "mangarine/components/ui-components/activityoverview";
import EarningDashboard from "mangarine/components/ui-components/earningdashboard";
import ConsultationOverview from "mangarine/components/ui-components/consultationoverview";
import ConsultationGauge from "mangarine/components/ui-components/consultationguage";
// import ConsultationOverview from "mangarine/components/ui-components/consultationoverview";

const Dashboard = () => {
  return (
    <Box
      display={"flex"}
      flexDir={{ base: "column", md: "row", lg: "row", xl: "row" }}
      // alignItems={"center"}
      // my="12px"
      justifyContent={"space-between"}
      w={{ base: "98%", md: "96%", lg: "96%", xl: "full" }}
      mx="auto"
      overflowY={"auto"}
      spaceY={{ base: "4", md: "0" }}
      css={{
        "&::-webkit-scrollbar": {
          width: "0px",

          height: "0px",
        },
        "&::-webkit-scrollbar-track": {
          width: "0px",
          background: "transparent",

          height: "0px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "transparent",
          borderRadius: "0px",
          maxHeight: "0px",
          height: "0px",
          width: 0,
        },
      }}
    >
      <VStack
        // mx={2}
        flex={1}
        w="full"
        // bg="bg_box"
        overflowY={"scroll"}
        css={{
          "&::-webkit-scrollbar": {
            width: "0px",

            height: "0px",
          },
          "&::-webkit-scrollbar-track": {
            width: "0px",
            background: "transparent",

            height: "0px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: "0px",
            maxHeight: "0px",
            height: "0px",
            width: 0,
          },
        }}
        rounded={"xl"}
      >
        <Box w="full" h="full">
          <ActivityOverview />
          <EarningDashboard />
          <HStack align="flex-start" flexDir={{base:"column", md:"column", lg:"row", xl:"row"}}  w="full" mb="12">


              <ConsultationOverview />
              <ConsultationGauge />


          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Dashboard;
