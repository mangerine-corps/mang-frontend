import { Box, VStack } from "@chakra-ui/react";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import ActivityBox from "mangarine/components/ui-components/activitybox";
import BookingCalendar from "mangarine/components/ui-components/bookingcalender";
import WhoToFollow from "mangarine/components/ui-components/whotofollow";
import NotificationPage from "mangarine/components/ui-components/notificationpage";

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px", height: "0px" },
  "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
  "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", height: "0px", width: 0 },
};

const Notification = () => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", md: "1fr 2fr", lg: "1fr 2fr 1fr" }}
      gap={4}
      w="full"
      h={{ base: "auto", md: "full" }}
      alignItems="start"
      css={noScrollbar}
    >
      {/* Left sidebar */}
      <VStack
        display={{ base: "none", md: "flex" }}
        alignItems="stretch"
        w="full"
        spaceY={2}
        h="full"
        overflowY="auto"
        css={noScrollbar}
      >
        <Biocard />
        <DashboardCard />
      </VStack>

      {/* Center — notification list */}
      <Box
        bg="bg_box"
        rounded="xl"
        h={{ base: "auto", md: "full" }}
        w="full"
        overflowY="auto"
        css={noScrollbar}
      >
        <NotificationPage />
      </Box>

      {/* Right sidebar */}
      <VStack
        display={{ base: "none", md: "flex" }}
        alignItems="stretch"
        w="full"
        spaceY={2}
        h="full"
        overflowY="auto"
        css={noScrollbar}
      >
        <Box w="full" cursor="pointer">
          <ActivityBox />
        </Box>
        <Box w="full">
          <BookingCalendar />
        </Box>
        <WhoToFollow />
      </VStack>
    </Box>
  );
};

export default Notification;
