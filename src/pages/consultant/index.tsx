import {
  Box,
  EmptyState,
  HStack,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import FavouriteConsultants from "mangarine/components/ui-components/favouriteconsultants";
import ScheduleCard from "mangarine/components/ui-components/schedulecard";
import AppLayout from "mangarine/layouts/AppLayout";
import GeneralFeed from "mangarine/components/ui-components/generalfeed";
import ConsultantTabs from "mangarine/components/ui-components/consultanttab";

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
import UpcomingConsultations from "mangarine/components/ui-components/upcomingconsultation";
import { isEmpty } from "es-toolkit/compat";
import ActivityEmptyState from "mangarine/components/ui-components/emptystate";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";

const Index = () => {
  // Normalize various possible backend representations of favorited flag
  const normalizeIsFavorited = (value: any): boolean => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    if (typeof value === "string") return value.toLowerCase() === "true" || value === "1";
    return false;
  };
 const { upcomingConsultation, favorite } = useConsultants();
  const [showFavs, setShowFavs] = useState<boolean>(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const {
    data: consultantData,
    isLoading,
    isError,
  } = useGetConsultantsQuery(undefined);
  const myConsultdata = consultantData?.data?.consultants;
  const [consultants, setLConsultants] = useState([]);

  useEffect(() => {
    if (consultantData) {
      const { data } = consultantData;
      setLConsultants(data.consultants);
      dispatch(setConsultants(data.consultants));
    }
  }, [consultantData, dispatch]);

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
        my={{ base: "0", md: "12px" }}
        justifyContent={"space-between"}
        w={{ base: "98%", md: "96%", lg: "96%", xl: "full" }}
        mx="auto"
        pos="relative"
        overflowY={"scroll"}
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
          h={{ base: "auto", md: "100vh" }}
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
        <Box
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
          <ConsultantTabs
            consultant={
              <SimpleGrid
                alignItems={"stretch"}
                columns={{ base: 1, sm: 2, md: 1, lg: 2 }}
                gap={4}
              >
                {/* render consultants data */}
                {isLoading ? (
                  // <Box>
                  //   <Text color="text_primary" textAlign={"center"}>
                  //     Loading consultants...
                  //   </Text>
                  // </Box>
                  <>
                    <Stack gap="6" maxW="xs">
                      <Skeleton height="200px" />
                      <Skeleton w="100px" h="16px" />
                      <VStack width="full">
                        <SkeletonText noOfLines={2} />
                      </VStack>
                      <HStack
                        width="full"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Skeleton w="100px" h="16px" />
                        <SkeletonCircle size="12" />
                      </HStack>
                    </Stack>
                    <Stack gap="6" maxW="xs">
                      <Skeleton height="200px" />
                      <Skeleton w="100px" h="16px" />
                      <VStack width="full">
                        <SkeletonText noOfLines={2} />
                      </VStack>
                      <HStack
                        width="full"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Skeleton w="100px" h="16px" />
                        <SkeletonCircle size="12" />
                      </HStack>
                    </Stack>
                    <Stack gap="6" maxW="xs">
                      <Skeleton height="200px" />
                      <Skeleton w="100px" h="16px" />
                      <VStack width="full">
                        <SkeletonText noOfLines={2} />
                      </VStack>
                      <HStack
                        width="full"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Skeleton w="100px" h="16px" />
                        <SkeletonCircle size="12" />
                      </HStack>
                    </Stack>
                    <Stack gap="6" maxW="xs">
                      <Skeleton height="200px" />
                      <Skeleton w="100px" h="16px" />
                      <VStack width="full">
                        <SkeletonText noOfLines={2} />
                      </VStack>
                      <HStack
                        width="full"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Skeleton w="100px" h="16px" />
                        <SkeletonCircle size="12" />
                      </HStack>
                    </Stack>
                  </>
                ) : isError ? (
                  <Box>
                    Oops!! Error fetching consultants. Please try again later.
                  </Box>
                ) : Array.isArray(consultants) && consultants.length > 0 ? (
                  consultants.map((consultant: any) => (
                    <Box key={consultant.id} cursor="pointer" h={"full"}>
                      <GeneralFeed
                        imageSrc={consultant.profilePics}
                        imageAlt={consultant.fullName}
                        name={consultant.fullName}
                        language={consultant.language}
                        profession={consultant.businessName}
                        about={consultant.bio}
                        location={consultant.location}
                        id={consultant?.id}
                        isFavorited={normalizeIsFavorited(
                          consultant?.isFavorited
                        )}
                        onClick={() => handleConsultantClick(consultant.id)}
                      />
                    </Box>
                  ))
                ) : (
                  <Box>No consultants available to display</Box>
                )}
              </SimpleGrid>
            }
            specified={""}
          />
        </Box>
        <VStack
          w={{ base: "100%", md: "25%" }}
          h={{ base: "auto", md: "full" }}
          overflowY={{ base: "visible", md: "auto" }}
          display={{ base: "none", md: "flex" }}
          spaceY={2}
          pos={{ base: "relative", md: "sticky" }}
          top={{ base: "unset", md: 0 }}
          alignSelf="flex-start"
        >
          {!isEmpty(upcomingConsultation) ? (
            <ScheduleCard />
          ) : (
            <ActivityEmptyState />
          )}

          {!isEmpty(favorite) ? (
            <FavouriteConsultantsComp />
          ) : (
            <Box>
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
        </VStack>
      </Box>
    </AppLayout>
  );
};

export default Index;
