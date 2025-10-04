import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Icon,
  Link,
  Text,
  useBreakpointValue,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import ConsultationHistory from "./consultationhistory";
import PaymentHistory from "./paymenthistory";
import VideoGrid from "./videogrid";
import EmptyConsultationVideo from "./emptyconsultationvideo";
import UpcomingConsultations from "mangarine/components/ui-components/upcomingconsultation";
import Upcoming_appointments from "mangarine/components/ui-components/meetings/upcoming_appointments";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";

const ConsultationPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const {favorite} = useConsultants()
  const toggleTab = (tabValue: string) => {
    setActiveTab((prev) => (prev === tabValue ? "" : tabValue));
  };
  console.log(favorite, "favvvv")
  const renderTab = (label: string, value: string) => {
    const isActive = activeTab === value;

    if (isMobile) {
      return (
        <Link
          onClick={() => toggleTab(value)}
          color={isActive ? "text_primary" : "text_primary"}
          fontWeight="600"
          fontSize={{ base: "xs", md: "0.875rem" }}
          fontFamily="outfit"
          textDecoration={isActive ? "underline" : "none"}
        >
          {label}
        </Link>
      );
    }

    return (

       <Button
        onClick={() => toggleTab(value)}
        border="1px solid"
        borderRadius="6px"
        px={{ base: "4px", md: "6px" }}
        // py={{base: "6px", md: "8px"}}
        fontSize={{ base: "xs", md: "0.875rem" }}
        variant="outline"
        bg={isActive ? "bg_button" : "transparent"}
        color="text_primary"
        borderColor={isActive ? "text_primary" : "gray.200"}
        font="outfit"
        //fontSize="1rem"
        fontWeight="600"
      >
        {label}
      </Button>

    );
  };

  return (
    <Box  w="full" mx="auto" >
      {/* Search Bar */}
      {/* <Flex justify="center" align="center" mb={6}>
        <Box position="relative" width="100%">
          <Input
            type="text"
            placeholder="Search my consultation"
            pl="40px"
            pr="40px"
            borderRadius="full"
            bg="gray.50"
            fontSize={{ base: "sm", md: "md" }}
            border="1px solid"
            borderColor="gray.200"
            w="100%"
          />
          <Box position="absolute" top="50%" left="12px" transform="translateY(-50%)">
            <Icon>
              <Image src="/Icons/searchSvg.svg" alt="search" />
            </Icon>
          </Box>
          <Box position="absolute" top="50%" right="12px" transform="translateY(-50%)" cursor="pointer">
            <Image src="/icons/filter.svg" alt="Filter"  />
          </Box>
        </Box>
      </Flex> */}

      <Flex  w="full"  pl="1" spaceX={"2"} mb="4" overflowX={"scroll"}
        // gap={4}
        // mb={6}
        // // pl="32"
        // bg="yellow.800"
        // // wrap="nowrap"
        // overflowX={"scroll"}
        // justify={{ base: "flex-start", md: "flex-start" }}
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
        {renderTab("Upcoming Consultations", "upcoming")}
        {renderTab("Payment History", "payment")}
        {renderTab("Consultation Videos", "videos")}
      </Flex>

      {activeTab === "upcoming" && <Upcoming_appointments />}
      {activeTab === "payment" && <PaymentHistory />}
      {activeTab === "videos" && (
        <EmptyConsultationVideo onUnlock={() => setActiveTab("videosGrid")} />
      )}
      {activeTab === "videosGrid" && <VideoGrid />}
    </Box>
  );
};

export default ConsultationPage;
