import {
  Box,
  Button,
  Flex,
  Link,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ConsultationHistory from "./consultationhistory";
import PaymentHistory from "./paymenthistory";
import EmptyConsultationVideo from "./emptyconsultationvideo";
import VideoGrid from "./videogrid";
import { useAuth } from "mangarine/state/hooks/user.hook";


const ConsultationPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const isConsultant = user?.isConsultant === true;

  const [activeTab, setActiveTab] = useState("history");
  // fallback: 'md' ensures SSR renders the same value as a desktop client, avoiding hydration mismatch
  const isMobile = useBreakpointValue({ base: true, md: false }, { fallback: "md" }) ?? false;

  // Honour ?tab= query param from DashboardCard navigation links
  useEffect(() => {
    const tabParam = router.query.tab as string | undefined;
    if (tabParam) {
      setActiveTab(tabParam);
      return;
    }
    // Default to history for everyone — shows bookings they made as a client
    if (user) {
      setActiveTab("history");
    }
  }, [user?.isConsultant, router.query.tab]);

  // All users see "Consultation History" — their own bookings with other consultants.
  // Consultants additionally see "Upcoming Consultations" (their incoming appointments as a consultant).
  const tabs = [
    { label: "Consultation History", value: "history" },
    { label: "Payment History", value: "payment" },
    { label: "Consultation Videos", value: "videos" },
  ];

  const renderTab = (label: string, value: string) => {
    const isActive = activeTab === value;

    if (isMobile) {
      return (
        <Link
          key={value}
          onClick={() => setActiveTab(value)}
          color="text_primary"
          fontWeight="600"
          fontSize={{ base: "xs", md: "0.875rem" }}
          fontFamily="Outfit"
          textDecoration={isActive ? "underline" : "none"}
        >
          {label}
        </Link>
      );
    }

    return (
      <Button
        key={value}
        onClick={() => setActiveTab(value)}
        border="1px solid"
        borderRadius="lg"
        px={{ base: 3, md: 4 }}
        fontSize={{ base: "xs", md: "0.875rem" }}
        variant="outline"
        bg={isActive ? "bg_button" : "transparent"}
        color="text_primary"
        borderColor={isActive ? "text_primary" : "gray.200"}
        fontFamily="Outfit"
        fontWeight="600"
        flexShrink={0}
      >
        {label}
      </Button>
    );
  };

  return (
    <Box w="full" mx="auto">
      {/* Tabs */}
      <Flex
        w="full"
        pl="1"
        spaceX="2"
        mb="4"
        overflowX="auto"
        css={{
          "&::-webkit-scrollbar": { width: "0px", height: "0px" },
          "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
          "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: "0px",
            maxHeight: "0px",
            height: "0px",
            width: 0,
          },
        }}
      >
        {tabs.map((tab) => renderTab(tab.label, tab.value))}
      </Flex>

      {/* Content */}
      {activeTab === "history" && <ConsultationHistory />}
      {activeTab === "payment" && <PaymentHistory />}
      {activeTab === "videos" && (
        <EmptyConsultationVideo onUnlock={() => setActiveTab("videosGrid")} />
      )}
      {activeTab === "videosGrid" && <VideoGrid />}
    </Box>
  );
};

export default ConsultationPage;
