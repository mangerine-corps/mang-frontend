import { Box, Flex, Image, Stack, Text, VStack } from "@chakra-ui/react";
import DynamicTabs from "mangarine/components/ui-components/consultantfeedwrapper";
import ConsultingServices from "mangarine/components/ui-components/consultingservicestab";
import EditConsultantProfileCard from "mangarine/components/ui-components/editconsultantprofile";
import EditEducationCard from "mangarine/components/ui-components/editeducationcard";
// import EditEducationCard from "mangarine/components/ui-components/editeducationcard";
import EditExperienceCard from "mangarine/components/ui-components/editexperiennce";
import EditIntroductionVideoCard from "mangarine/components/ui-components/editintroductoryvideo";
import EditLanguageCard from "mangarine/components/ui-components/editlanguage";
import EditMyWorksCard from "mangarine/components/ui-components/editmyworkscard";
import EditSkillCard from "mangarine/components/ui-components/editskillscard";
import RatingAndReviewComponent from "mangarine/components/ui-components/ratingscard";
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
import { useGetblockedUserQuery } from "mangarine/state/services/profile.service";
import { useGetNotificationsQuery } from "mangarine/state/services/notifications.service";
import { BlockedComp } from "mangarine/components/ui-components/blockedcomp";
import { useGetFollowingQuery } from "mangarine/state/services/posts.service";

const contactme = "/assets/images/contactme.png";
// const coverphoto = "/images/coverphoto.png";
const dp = "/images/dp.png";
const play = "/assets/images/play.svg";
// const works3 = "/images/works3.png";
const verified = "/assets/images/verified consultant.svg";
const locale = "/assets/images/locale.svg";
const dob = "/assets/images/dob.svg";
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
  const [showPayment, setShowPayment] = useState<{
    secret: string;
    paymentDetails: any;
  }>();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { user } = useAuth();
  const isFollow = isFollowingdata?.data.isFollowing;

  const [follow, setFollow] = useState(false);
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
  const handleFollow = () => toggleFollow();

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
    theme: "stripe",
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
            {/* Header card is always visible, but content below depends on block status */}
            <Box w="full">
              {isBlocked ? (
                <VStack
                  alignItems="center"
                  justifyContent="center"
                  flex="4"
                  h="auto"
                  // w="full"
                  bg="main_background"
                >
                  <BlockedConsultant info={info} />
                </VStack>
              ) : (
                <EditConsultantProfileCard
                  checkmarkSrc={verified}
                  locationSrc={locale}
                  dobSrc={dob}
                  consultantId={id}
                  info={info}
                />
              )}
            </Box>

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
              <VStack
                alignItems="center"
                justifyContent="center"
                flex="4"
                h="auto"
                bg="main_background"
              >
                <BlockedComp
                  info={info}
                  buttonText=""
                  title={"You have blocked this User"}
                  details="This user has been blocked by you. Unblock to view their content"
                  onClick={() => {}}
                />
              </VStack>
            ) : (
              <>
                <Flex
                  justify="space-between"
                  align="center"
                  my={4}
                  fontSize="0.875rem"
                  color="text_primary"
                >
                  <StatusCard
                    followers={displayInfo?.followerCount}
                    data={displayInfo}
                    following={displayInfo?.followingCount}
                  />
                  <Flex gap={4}>
                    <Button
                      px="4"
                      bg="bg_box"
                      borderRadius={8}
                      color="text_primary"
                      // {...buttonStyles(0)}
                      onClick={handleFollow}
                    >
                      {followLabel}
                    </Button>
                    <Button
                      //   {...buttonStyles(1, true)}
                      onClick={() => setShowBookConsult(true)}
                      px="4"
                      bg="button_bg"
                      color="button_text"
                      borderRadius={8}
                    >
                      {/* <Text display={{ base: "none", md: "flex" }}>
                        <HiOutlineUserAdd style={{ marginRight: "8px" }} />
                      </Text> */}
                      <Image src="/icons/book.svg" alt="book-img-button"/>
                      Book Consultation
                    </Button>
                  </Flex>
                </Flex>
                <EditMyWorksCard
                  title={"My Works"}
                  edit={edit}
                  works={works}
                  isLoading={isLoading}
                  // consultantId={id}
                />
                <Box w="full" my="4">
                  <DynamicTabs
                    // activity={<NewsItem post={[]} />}
                    consulting={
                      <ConsultingServices
                        isLoading={isLoading}
                        consultings={services}
                        availabilityInfo={availabilityInfo}
                        consultantId={id as string}
                      />
                    }
                    reviews={<RatingAndReviewComponent reviews={reviews} />}
                  />
                </Box>
              </>
            )}
          </Flex>

          {/* Fixed Stack on the right */}
          <Stack flexDir={"column"} h="full" overflowY="auto" flex="1.5">
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
              <Box
                overflowY="auto"
                flex="1"
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
                <EditIntroductionVideoCard
                  title={"Introduction Video"}
                  imageSrc={contactme}
                  playIconSrc={play}
                  videoLink={consultantInfo?.videoIntro}
                  edit={<BiSolidEditAlt />}
                  consultantId={id}
                />
                {/* <Box mt={4} w="full">
                <EditContactMeCard
                  title={"Contact Me"}
                  email={info?.email}
                  phone={info?.mobileNumber}
                  website={"www.sharongraceshow.com"}
                  edit={<BiSolidEditAlt />}
                  consultantId={id}
                />
              </Box> */}
                <Box mt={4}>
                  <EditSkillCard
                    title={"Skills & Expertise"}
                    edit={edit}
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
