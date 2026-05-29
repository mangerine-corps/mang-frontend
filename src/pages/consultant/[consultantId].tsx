import { Box, CloseButton, Dialog, Flex, HStack, Image, Portal, Stack, Text, VStack } from "@chakra-ui/react";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { IoChevronForward } from "react-icons/io5";
import ProfileActivitySection from "mangarine/components/ui-components/profileactivitysection";

import EditConsultantProfileCard from "mangarine/components/ui-components/editconsultantprofile";
import EditEducationCard from "mangarine/components/ui-components/editeducationcard";
// import EditEducationCard from "mangarine/components/ui-components/editeducationcard";
import EditExperienceCard from "mangarine/components/ui-components/editexperiennce";
import EditIntroductionVideoCard from "mangarine/components/ui-components/editintroductoryvideo";
import EditLanguageCard from "mangarine/components/ui-components/editlanguage";
import EditMyWorksCard from "mangarine/components/ui-components/editmyworkscard";
import EditSkillCard from "mangarine/components/ui-components/editskillscard";
import StatusCard from "mangarine/components/ui-components/statscard";
import AppLayout from "mangarine/layouts/AppLayout";
import BlockedConsultant from "mangarine/components/blockuser";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiSolidEditAlt } from "react-icons/bi";

import { Appearance, loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { HiOutlineUserAdd } from "react-icons/hi";
import { Button } from "mangarine/components/ui/button";
import PaymentCard from "mangarine/components/ui-components/paymentcard";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";
import { useDispatch } from "react-redux";
import { useGetConsultantByIdOnDemandMutation } from "mangarine/state/services/consultant.service";
import { isEmpty } from "es-toolkit/compat";
import CustomDatePicker from "mangarine/components/ui-components/bookingcalendarcard";
import PaymentSuccessfulModal from "mangarine/components/ui-components/modals/paymentsuccessful";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useFollow } from "mangarine/hooks/useFollow";
import { useGetblockedUserQuery, useUnblockUserMutation } from "mangarine/state/services/profile.service";
import { toaster } from "mangarine/components/ui/toaster";
import { useGetNotificationsQuery } from "mangarine/state/services/notifications.service";
import { BlockedComp } from "mangarine/components/ui-components/blockedcomp";
import { useGetFollowingQuery } from "mangarine/state/services/posts.service";
import { DEFAULT_AVATAR } from "mangarine/lib/constants";

const contactme = "/assets/images/contactme.png";
// const coverphoto = "/images/coverphoto.png";
const dp = DEFAULT_AVATAR;
const play = "/assets/images/play.svg";
// const works3 = "/images/works3.png";
const verified = "/icons/verified.svg";
const locale = "/images/location.svg";
const dob = "/icons/dob.svg";
const edit = "/icons/edit.svg";

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

const reviews = [
  {
    profilePic: dp, // Replace with actual image path
    name: "John Doe",
    rating: 4,
    review: "Great consultation! Very helpful and knowledgeable.",
  },
  {
    profilePic: dp, // Replace with actual image path
    name: "Jane Smith",
    rating: 5,
    review: "Exceptional service, I highly recommend!",
  },
  {
    profilePic: dp, // Replace with actual image path
    name: "Michael Brown",
    rating: 3,
    review: "It was okay, but I expected more detailed advice.",
  },
];

const ConsultantProfile = () => {
  const router = useRouter();
  const {
    query: { consultantId },
  } = router;
  const { selectedConsultant, status } = useConsultants();
  const id = consultantId?.toString();
  const [skip, setSkip] = useState(true);
  const [services, setServices] = useState([]);
  const [works, setWorks] = useState([]);
  const {
    data: blockeduserdata,
    currentData: blockedusercurrentdata,
    isLoading: blockeduserloading,
  } = useGetblockedUserQuery(id as string, { skip: !id });
  const [getConsultant, { data, isLoading, error }] =
    useGetConsultantByIdOnDemandMutation();

  useEffect(() => {
    if (id) {
      setWorks([]);
      setServices([]);
      getConsultant(id)
        .unwrap()
        .then((payload) => {
          const { data } = payload;
          setServices(data?.consultant?.consultancy);
          setWorks(data?.consultant?.works);
          //  console.log(data?.consultant?.works, "payload consult");
        })
        .catch((error) => {
          const { data } = error;
          console.log(data, "error consult");
        });
    }
  }, [id, getConsultant]);
  let info: typeof selectedConsultant | null = null;

  const [consultantInfo, setConsultantInfo] = useState<any>({});
  const [availabilityInfo, setAvailabilityInfo] = useState<any>({});
  const [localFollowerCount, setLocalFollowerCount] = useState<number | null>(null);
  const [paymentSuccessfull, setPaymentSuccessfull] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const { data: isFollowingdata } = useGetFollowingQuery(
    { id },
    {
      skip: !id,
    }
  );
  if (router.asPath === `/consultant/${id}`) {
    info = selectedConsultant;
  }

  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [showBookConsult, setShowBookConsult] = useState<boolean>(false);
  // Track viewport so the mobile Dialog is never "open" on desktop — prevents
  // Chakra's dialog from locking body scroll and firing closeOnInteractOutside
  // (which would close the desktop panel when a calendar date is clicked).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 992); // Chakra lg breakpoint
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const [showPayment, setShowPayment] = useState<{
    secret: string;
    paymentDetails: any;
  }>();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isFollow = isFollowingdata?.data.isFollowing;

  const [follow, setFollow] = useState(false);
  const [unblockUser, { isLoading: unblocking }] = useUnblockUserMutation();
  console.log(info, "consultant");
  // Centralized follow state/label across app
  const {
    isFollowing: hookFollowing,
    label: followLabel,
    toggleFollow,
  } = useFollow({
    targetUserId: (info as any)?.id || (consultantInfo as any)?.id,
    initialIsFollowing:false,
  });
  //  useEffect(() => {
  //    if (isFollow !== undefined) {
  //      setIsFollowing(isFollow);
  //    }
  //  }, [isFollow]);
  const handleFollow = () => {
    setLocalFollowerCount(prev =>
      prev !== null ? prev + (hookFollowing ? -1 : 1) : prev
    );
    toggleFollow();
  };

  useEffect(() => {
    if (!isEmpty(data)) {
      const { data: profileData } = data;
      console.log(profileData, "data");
      setConsultantInfo(profileData.consultant);
      setAvailabilityInfo(profileData.consultationTime);
      //
    }
  }, [data]);
  useEffect(() => {
    if (consultantId) {
      setSkip(false);
    }
  }, []);
  // Show payment success modal after Stripe redirect
  useEffect(() => {
    // Check for Stripe redirect success
    const { redirect_status, payment_intent } = router.query;

    if (redirect_status === "succeeded" || payment_intent) {
      // Get payment amount from localStorage
      if (typeof window !== "undefined") {
        const storedAmount = localStorage.getItem("paymentAmount");
        if (storedAmount) {
          setPaymentAmount(Number(storedAmount));
          setPaymentSuccessfull(true);
          setShowPaymentSuccess(true);
          // Clear stored amount after setting state
          localStorage.removeItem("paymentAmount");
        }
      }
    }
  }, [router.query]);

  const appearance: Appearance = {
    theme: "flat",
    variables: {
      colorPrimary: "#111D4A",
      colorText: "#111827",
      colorTextSecondary: "#6B7280",
      colorBackground: "#FFFFFF",
      borderRadius: "12px",
      fontFamily: "Outfit, sans-serif",
    },
  };

  const loader = "auto";
  console.log(blockeduserdata, "blockdata");

  // Normalize truthy values coming from API (boolean | string | number)
  const normalizeBool = (value: any): boolean => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    if (typeof value === "string")
      return value.toLowerCase() === "true" || value === "1";
    return false;
  };
 console.log(blockeduserdata, "blockeduser")
  // Try to support different possible shapes from the backend for block status
  const blockData: any = (blockeduserdata as any)?.data ?? blockeduserdata;
  const isBlocked =
    normalizeBool(blockData?.isBlocked) ||
    normalizeBool(blockData?.blocked) ||
    normalizeBool(blockData?.blockedByYou) ||
    normalizeBool(blockData?.blockedYou) ||
    normalizeBool(blockData?.isUserBlocked) ||
    normalizeBool(blockData?.isBlockedByUser) ||
    normalizeBool(blockData?.isBlockedByMe) ||
    normalizeBool(status);

  // Unread notifications count (use total from unread list)
  const { data: unreadNotif } = useGetNotificationsQuery({
    status: "unread",
    page: 1,
    limit: 1,
  });
  const unreadTotal = unreadNotif?.total ?? 0;

  // Merge unread count into the info object passed to children
  const baseInfo: any = info || consultantInfo || {};
  const displayInfo: any = { ...baseInfo, unreadNotifications: unreadTotal };

  // Initialize local follower count once data is available
  useEffect(() => {
    if (displayInfo?.followerCount != null && localFollowerCount === null) {
      setLocalFollowerCount(displayInfo.followerCount);
    }
  }, [displayInfo?.followerCount, localFollowerCount]);

  return (
    <AppLayout>
      <>
        <Flex
          // bg="main_background"
          h="full"
          p={{ base: "4", lg: "0" }}
          columnGap={"4"}
          // mt={{ base: "4rem" }}
          flex="4"
          flexDirection={{ base: "column", lg: "row" }}
          overflowX="hidden"
          justifyContent={{ base: "space-between" }}
          scrollbar={"hidden"}
        >
          <Flex
            flexDir="column"
            flex={4}
            h="full"
            overflowY={{ base: "none", lg: "auto" }}
            //  overflowY={{base:"scroll", md:"scroll"}}
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
            // overflowX="hidden"
          >
            {/* Profile card — always visible */}
            <Box w="full">
              <EditConsultantProfileCard
                checkmarkSrc={verified}
                locationSrc={locale}
                dobSrc={dob}
                consultantId={id}
                info={info || consultantInfo}
              />
            </Box>

            {/* Blocked banner */}
            {isBlocked && (
              <Flex
                mt={3}
                w="full"
                bg="#FFF8EC"
                borderWidth="1px"
                borderColor="#F0D9B5"
                borderRadius="xl"
                px={4}
                py={3}
                align="center"
                justify="space-between"
              >
                <Text fontSize="0.875rem" fontFamily="Outfit" color="text_primary" fontWeight="500">
                  You have blocked {(info || consultantInfo)?.fullName}
                </Text>
                <Box
                  as="button"
                  fontSize="0.875rem"
                  fontFamily="Outfit"
                  color="#111D4A"
                  fontWeight="600"
                  textDecoration="underline"
                  cursor="pointer"
                  onClick={async () => {
                    try {
                      const target = info || consultantInfo;
                      if (!target?.id) return;
                      await unblockUser({ userId: target.id, reason: "unBlocked from profile menu" }).unwrap();
                      toaster.create({ description: `${target?.fullName ?? "User"} has been unblocked.` });
                    } catch (err: any) {
                      toaster.create({ description: err?.data?.message || "Unable to unblock user." });
                    }
                  }}
                >
                  {unblocking ? "..." : "Undo"}
                </Box>
              </Flex>
            )}

            {/* Consultant Tier Banner */}
            {!isBlocked && (consultantInfo?.pricingPlan || info?.pricingPlan) && (
              <Box
                mt={3}
                w="full"
                bg="#FFFBF0"
                borderWidth="1px"
                borderColor="#F0D9B5"
                borderRadius="xl"
                px={4}
                py={3}
                cursor="pointer"
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <HStack gap={1} align="center">
                      <Text
                        fontWeight="700"
                        fontSize="0.95rem"
                        color="text_primary"
                        fontFamily="Outfit"
                      >
                        Principal Consultant
                      </Text>
                      <Box color="#F5A623">
                        <RiVerifiedBadgeFill size={16} />
                      </Box>
                    </HStack>
                    <Text fontSize="0.78rem" color="grey.500" fontFamily="Outfit">
                      Lead/Expert Consultant
                    </Text>
                  </Box>
                  <Box color="grey.400">
                    <IoChevronForward size={18} />
                  </Box>
                </Flex>
              </Box>
            )}

            {/* StatsCard and Buttons */}

            {blockeduserloading ? (
              <VStack
                alignItems="center"
                justifyContent="center"
                flex="4"
                h="auto"
                bg="main_background"
              >
                <Text color="text_primary">Loading...</Text>
              </VStack>
            ) : isBlocked ? (
              <BlockedComp info={info || consultantInfo} />
            ) : (
              <>
                <Flex
                  justify="space-between"
                  align={{ base: "flex-start", md: "center" }}
                  flexDir={{ base: "column", md: "row" }}
                  gap={{ base: 3, md: 0 }}
                  my={4}
                  fontSize="0.875rem"
                  color="text_primary"
                >
                  <StatusCard
                    followers={localFollowerCount ?? displayInfo?.followerCount}
                    data={displayInfo}
                    following={displayInfo?.followingCount}
                  />
                  <Flex gap={3} w={{ base: "full", md: "auto" }}>
                    <Button
                      flex={{ base: 1, md: "none" }}
                      px="4"
                      bg="bg_box"
                      borderRadius={8}
                      color="text_primary"
                      onClick={handleFollow}
                    >
                      {followLabel}
                    </Button>
                    <Button
                      flex={{ base: 1, md: "none" }}
                      onClick={() => setShowBookConsult(true)}
                      px="4"
                      bg="button_bg"
                      color="button_text"
                      borderRadius={8}
                    >
                      <Image src="/icons/book.svg" alt="book-img-button"/>
                      <Text display={{ base: "none", sm: "inline" }}>Book Consultation</Text>
                      <Text display={{ base: "inline", sm: "none" }}>Book</Text>
                    </Button>
                  </Flex>
                </Flex>
                <EditMyWorksCard
                  title={"My Works"}
                  works={works}
                  isLoading={isLoading}
                />
                <Box w="full" my="4">
                  <ProfileActivitySection isOwnProfile={false} />
                </Box>
              </>
            )}
          </Flex>

          {/* Mobile booking modal */}
          <Dialog.Root
            open={showBookConsult && isMobile}
            onOpenChange={(e) => { if (!(e as any).open) { setShowBookConsult(false); setShowPayment(undefined); } }}
            size="full"
          >
            <Portal>
              <Dialog.Backdrop display={{ base: "block", lg: "none" }} />
              <Dialog.Positioner display={{ base: "flex", lg: "none" }}>
                <Dialog.Content bg="main_background" maxH="95dvh" overflowY="auto">
                  <Dialog.Header borderBottomWidth="1px" borderColor="gray.100" px={4} py={3}>
                    <HStack justify="space-between" w="full">
                      <Text fontWeight="600" fontSize="1rem" color="text_primary">Book Consultation</Text>
                      <Dialog.CloseTrigger asChild>
                        <CloseButton size="sm" />
                      </Dialog.CloseTrigger>
                    </HStack>
                  </Dialog.Header>
                  <Dialog.Body px={4} py={4}>
                    {showPayment ? (
                      <Box bg="main_background" borderRadius="20px">
                        <Elements
                          options={{ clientSecret: showPayment.secret, appearance: appearance, loader }}
                          stripe={stripePromise}
                        >
                          <PaymentCard
                            paymentDetails={showPayment.paymentDetails}
                            clientSecret={showPayment.secret}
                            onBack={() => setShowPayment(undefined)}
                          />
                        </Elements>
                      </Box>
                    ) : (
                      <CustomDatePicker onClick={(value) => setShowPayment(value)} />
                    )}
                  </Dialog.Body>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>

          {/* Fixed Stack on the right */}
          <Stack flexDir={"column"} h={{ base: "auto", lg: "full" }} overflowY={{ base: "visible", lg: "auto" }} flex={{ base: "none", lg: "1.5" }}>
            {showBookConsult ? (
              <Stack
                h="full"
                // flex={1.5}
                display={{ base: "none", lg: "flex" }}
                flexDir={{ lg: "column" }}
                spaceY={"6"}
              >
                {showPayment ? (
                  <Box bg="main_background" borderRadius={"20px"}>
                    <Elements
                      options={{
                        clientSecret: showPayment.secret,
                        appearance: appearance,
                        loader,
                      }}
                      stripe={stripePromise}
                    >
                      <PaymentCard
                        paymentDetails={showPayment.paymentDetails}
                        clientSecret={showPayment.secret}
                        onBack={() => setShowPayment(undefined)}
                      />
                    </Elements>
                  </Box>
                ) : (
                  <CustomDatePicker
                    onClick={(value) => {
                      setShowPayment(value);
                    }}
                  />
                )}
              </Stack>
            ) : (
              <>
                {/* Desktop — original layout, all cards always shown */}
                <Box
                  display={{ base: "none", lg: "block" }}
                  overflowY="auto"
                  flex="1"
                  css={{
                    "&::-webkit-scrollbar": { width: "0px", height: "0px" },
                    "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
                    "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", height: "0px", width: 0 },
                  }}
                >
                  <EditIntroductionVideoCard
                    title={"Introduction Video"}
                    imageSrc={contactme}
                    playIconSrc={play}
                    videoLink={consultantInfo?.videoIntro}
                    consultantId={id}
                  />
                  <Box mt={4}>
                    <EditSkillCard
                      title={"Skills & Expertise"}
                      isLoading={isLoading}
                      skills={consultantInfo?.skills}
                    />
                  </Box>
                  <Box mt={4}>
                    <EditEducationCard
                      title={"Education"}
                      isLoading={isLoading}
                      educations={consultantInfo?.educations}
                    />
                  </Box>
                  <Box mt={4}>
                    <EditExperienceCard
                      title={"Experience"}
                      isLoading={isLoading}
                      experiences={consultantInfo?.experiences}
                    />
                  </Box>
                  <Box mt={4}>
                    <EditLanguageCard
                      title={"Languages"}
                      isLoading={isLoading}
                      languages={consultantInfo?.languages}
                    />
                  </Box>
                </Box>

                {/* Mobile — only show sections with data, combined empty state */}
                {(() => {
                  const hasVideo      = !!consultantInfo?.videoIntro;
                  const hasSkills     = consultantInfo?.skills?.length > 0;
                  const hasEducation  = consultantInfo?.educations?.length > 0;
                  const hasExperience = consultantInfo?.experiences?.length > 0;
                  const hasLanguages  = consultantInfo?.languages?.length > 0;
                  const hasAnything   = hasVideo || hasSkills || hasEducation || hasExperience || hasLanguages;

                  return (
                    <VStack display={{ base: "flex", lg: "none" }} gap={4} align="stretch" pb={4}>
                      {isLoading ? (
                        <>
                          {[1, 2, 3].map((i) => (
                            <Box key={i} bg="bg_box" borderRadius="15px" p={6} boxShadow="0px 0px 4px 0px #0000001A">
                              <Box h="20px" w="40%" bg="gray.100" borderRadius="4px" mb={3} />
                              <Box h="14px" w="70%" bg="gray.100" borderRadius="4px" mb={2} />
                              <Box h="14px" w="50%" bg="gray.100" borderRadius="4px" />
                            </Box>
                          ))}
                        </>
                      ) : !hasAnything ? (
                        <VStack
                          bg="bg_box"
                          borderRadius="15px"
                          p={8}
                          boxShadow="0px 0px 4px 0px #0000001A"
                          gap={2}
                          align="center"
                          textAlign="center"
                        >
                          <Text fontSize="1rem" fontWeight="600" color="text_primary">
                            Profile incomplete
                          </Text>
                          <Text fontSize="0.875rem" color="grey.500">
                            This consultant hasn&apos;t added their skills, education, or experience yet.
                          </Text>
                        </VStack>
                      ) : (
                        <>
                          {hasVideo && (
                            <EditIntroductionVideoCard
                              title={"Introduction Video"}
                              imageSrc={contactme}
                              playIconSrc={play}
                              videoLink={consultantInfo?.videoIntro}
                              consultantId={id}
                            />
                          )}
                          {hasSkills && (
                            <EditSkillCard title={"Skills & Expertise"} isLoading={false} skills={consultantInfo?.skills} />
                          )}
                          {hasEducation && (
                            <EditEducationCard title={"Education"} isLoading={false} educations={consultantInfo?.educations} />
                          )}
                          {hasExperience && (
                            <EditExperienceCard title={"Experience"} isLoading={false} experiences={consultantInfo?.experiences} />
                          )}
                          {hasLanguages && (
                            <EditLanguageCard title={"Languages"} isLoading={false} languages={consultantInfo?.languages} />
                          )}
                        </>
                      )}
                    </VStack>
                  );
                })()}
              </>
            )}
          </Stack>
        </Flex>
        {showPaymentSuccess && paymentAmount > 0 && (
          <PaymentSuccessfulModal
            isOpen={showPaymentSuccess}
            onOpenChange={setShowPaymentSuccess}
            paymentAmount={paymentAmount}
          />
        )}
      </>
    </AppLayout>
  );
};

export default ConsultantProfile;
