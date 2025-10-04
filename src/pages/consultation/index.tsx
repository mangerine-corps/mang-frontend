import { Box, Stack, VStack } from "@chakra-ui/react";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import FavouriteConsultants from "mangarine/components/ui-components/favouriteconsultants";
import ScheduleCard from "mangarine/components/ui-components/schedulecard";
import AppLayout from "mangarine/layouts/AppLayout";

import ScheduledConsultation from "mangarine/components/ui-components/scheduledconsultation";
import { useEffect, useState } from "react";
import FavouriteConsultantsComp from "mangarine/components/ui-components/favourite_consultants_card";
import { useRouter } from "next/router";
import { useGetConsultantsQuery } from "mangarine/state/services/consultant.service";
import { useDispatch } from "react-redux";
import {
  selectConsultant,
  setConsultants,
} from "mangarine/state/reducers/consultant.reducer";
import ConsultationPage from "mangarine/components/ui-components/consultationpage";
import ConsultationDetailsBox from "mangarine/components/ui-components/consultationdetailsbox";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";
import { isEmpty } from "es-toolkit/compat";

const Consultation = () => {
  const [showSchConsult, setShowSchConsult] = useState<boolean>(false);
  const [showFavs, setShowFavs] = useState<boolean>(false);
 const { favorite } = useConsultants();
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    data: consultantData,
    isLoading,
    isError,
  } = useGetConsultantsQuery(undefined);
  const myConsultdata = consultantData?.data?.consultants;

  useEffect(() => {
    console.log(myConsultdata, "data");
    dispatch(setConsultants(myConsultdata));
  }, [myConsultdata, dispatch]);

  const handleConsultantClick = (consultantId: string) => {
    dispatch(selectConsultant(consultantId));
    router.push(`consultant/${consultantId}`);
  };
  return (
    <AppLayout>
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


            {(!isEmpty(favorite)) ? (
              <FavouriteConsultantsComp />
            ) : (
              <Box
               
              >
                <FavouriteConsultants
                  title={"Favourite Consultants"}
                  content={"No Favourite Consultants!"}
                  details={
                    "You haven't added any consultants to your favorites yet. Tap the ♥ icon to start saving your favorite consultants!"
                  }
                  imageSrc={"/icons/emptyct.svg"}
                />
              </Box>
            )}

            {/* <Stack
              flex={1.5}
              display={{ base: "none", lg: "flex" }}
              flexDir={{ lg: "column" }}
              spaceY={"6"}
            >
              <BookingCalendarCard />
            </Stack> */}
          </>
        </VStack>
      </Box>
    </AppLayout>
  );
};

export default Consultation;
