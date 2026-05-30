import { Box, VStack } from "@chakra-ui/react";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import ScheduledConsultation from "mangarine/components/ui-components/scheduledconsultation";
import ProspectiveFollowing from "mangarine/components/ui-components/prospectivefollowing";
import { useEffect } from "react";
import { useGetConsultantsQuery } from "mangarine/state/services/consultant.service";
import { useDispatch } from "react-redux";
import { setConsultants } from "mangarine/state/reducers/consultant.reducer";
import ConsultationPage from "mangarine/components/ui-components/consultationpage";
import ConsultationReadyBanner from "mangarine/components/ui-components/ConsultationReadyBanner";

const Consultation = () => {
  const dispatch = useDispatch();
  const { data: consultantData } = useGetConsultantsQuery(undefined);
  const myConsultdata = consultantData?.data?.consultants;

  useEffect(() => {
    if (myConsultdata) dispatch(setConsultants(myConsultdata));
  }, [myConsultdata, dispatch]);
  return (
          <>
      <ConsultationReadyBanner />
      <Box
        display={"flex"}
        // bg="red.900"
        flexDir={{ base: "column", md: "row", lg: "row", xl: "row" }}
        // alignItems={"center"}
        my={{ base: "0", md: "0px" }}
        justifyContent={"space-between"}
        w={{ base: "98%", md: "96%", lg: "96%", xl: "full" }}
        mx="auto"
        pos="relative"
        // overflowY={"scroll"}
        // spaceY={{ base: "4", md: "0" }}
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
          w={{ base: "100%", md: "25%" }}
          h={{ base: "auto", md: "full" }}
          overflowY="auto"
          // py={4}
          display={{ base: "none", md: "flex" }}
          spaceY={2}
        >
          <Biocard />

          <DashboardCard />

          {/* <ConsultationDetailsBox /> */}
          {/* <PaymentBox /> */}
          {/* <PaymentCard /> */}
        </VStack>
        <VStack
          mx={{ base: "0", md: 4, lg: 4, xl: 4 }}
          flex={1}
          h="full"
          // bg="main_background"
          overflowY={{ base: "scroll", md: "scroll" }}
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
          overflowX="hidden"


        >
          <ConsultationPage />
        </VStack>
         <VStack
          w={{ base: "100%", md: "25%" }}
          h={{ base: "auto", md: "100vh" }}
          overflowY={{ base: "visible", md: "auto" }}
          display={{ base: "none", md: "flex" }}
          // spaceY={2}
          pos={{ base: "relative", md: "sticky" }}
          top={{ base: "unset", md: 0 }}
          alignSelf="flex-start"
        >
          <>
            <ScheduledConsultation />
            <ProspectiveFollowing />
          </>
        </VStack>
      </Box>
      </>
      );
};

export default Consultation;
