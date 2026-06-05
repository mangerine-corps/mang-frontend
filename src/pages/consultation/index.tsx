import { Box, Flex, VStack } from "@chakra-ui/react";
import ScheduledConsultation from "mangarine/components/ui-components/scheduledconsultation";
import ProspectiveFollowing from "mangarine/components/ui-components/prospectivefollowing";
import { useEffect } from "react";
import { useGetConsultantsQuery } from "mangarine/state/services/consultant.service";
import { useDispatch } from "react-redux";
import { setConsultants } from "mangarine/state/reducers/consultant.reducer";
import ConsultationPage from "mangarine/components/ui-components/consultationpage";
import ConsultationReadyBanner from "mangarine/components/ui-components/ConsultationReadyBanner";

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px", height: "0px" },
  "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
  "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", height: "0px", width: 0 },
};

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
      <Flex gap={4} w="full" h={{ base: "auto", md: "full" }} overflow={{ base: "visible", md: "hidden" }}>
        {/* Center content */}
        <VStack
          h={{ base: "auto", md: "full" }}
          w="full"
          overflowY="auto"
          overflowX="hidden"
          rounded="xl"
          align="stretch"
          css={noScrollbar}
        >
          <ConsultationPage />
        </VStack>

        {/* Right sidebar */}
        <VStack
          display={{ base: "none", lg: "flex" }}
          alignItems="stretch"
          w="260px"
          flexShrink={0}
          spaceY={2}
          h="full"
          overflowY="auto"
          css={noScrollbar}
        >
          <ScheduledConsultation />
          <ProspectiveFollowing />
        </VStack>
      </Flex>
    </>
  );
};

export default Consultation;
