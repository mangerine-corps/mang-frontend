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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import ConsultationHistory from "./consultationhistory";
import PaymentHistory from "./paymenthistory";
import EmptyConsultationVideo from "./emptyconsultationvideo";
import VideoGrid from "./videogrid";
import { useAuth } from "mangarine/state/hooks/user.hook";

// react-date-range (used inside Upcoming_appointments) accesses browser globals
// at module init — skipping SSR prevents it from crashing on page refresh.
const Upcoming_appointments = dynamic(
  () => import("mangarine/components/ui-components/meetings/upcoming_appointments"),
  { ssr: false }
);

const ConsultationPage = () => {
  const { user } = useAuth();
  const router = useRouter();
  const isConsultant = user?.isConsultant === true;

  const [activeTab, setActiveTab] = useState("history");
  const [searchTerm, setSearchTerm] = useState("");
  // fallback: 'md' ensures SSR renders the same value as a desktop client, avoiding hydration mismatch
  const isMobile = useBreakpointValue({ base: true, md: false }, { fallback: "md" }) ?? false;

  // Honour ?tab= query param from DashboardCard navigation links
  useEffect(() => {
    const tabParam = router.query.tab as string | undefined;
    if (tabParam) {
      setActiveTab(tabParam);
      return;
    }
    // Default tab based on user role
    if (user) {
      setActiveTab(user.isConsultant === true ? "upcoming" : "history");
    }
  }, [user?.isConsultant, router.query.tab]);

  const tabs = isConsultant
    ? [
        { label: "Upcoming Consultations", value: "upcoming" },
        { label: "Payment History", value: "payment" },
        { label: "Consultation Videos", value: "videos" },
      ]
    : [
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
        borderRadius="6px"
        px={{ base: "4px", md: "6px" }}
        fontSize={{ base: "xs", md: "0.875rem" }}
        variant="outline"
        bg={isActive ? "bg_button" : "transparent"}
        color="text_primary"
        borderColor={isActive ? "text_primary" : "gray.200"}
        fontFamily="Outfit"
        fontWeight="600"
      >
        {label}
      </Button>
    );
  };

  return (
    <Box w="full" mx="auto">
      {/* Search Bar — only shown on history tab for normal users */}
      {!isConsultant && activeTab === "history" && (
        <Flex justify="center" align="center" mb={4}>
          <Box position="relative" width="100%">
            <Input
              type="text"
              placeholder="Search my consultation"
              pl="40px"
              pr="40px"
              borderRadius="full"
              bg="gray.50"
              fontSize={{ base: "sm", md: "0.875rem" }}
              border="1px solid"
              borderColor="gray.200"
              fontFamily="Outfit"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Box
              position="absolute"
              top="50%"
              left="12px"
              transform="translateY(-50%)"
            >
              <Icon>
                <Image src="/Icons/searchSvg.svg" alt="search" />
              </Icon>
            </Box>
            <Box
              position="absolute"
              top="50%"
              right="12px"
              transform="translateY(-50%)"
              cursor="pointer"
            >
              <Image src="/icons/filter.svg" alt="Filter" />
            </Box>
          </Box>
        </Flex>
      )}

      {/* Tabs */}
      <Flex
        w="full"
        pl="1"
        spaceX="2"
        mb="4"
        overflowX="scroll"
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
      {activeTab === "history" && <ConsultationHistory searchTerm={searchTerm} />}
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
