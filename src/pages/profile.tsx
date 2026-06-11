import { Box, Button, Flex, HStack, Icon, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
import { LuArrowLeft, LuCalendarDays } from "react-icons/lu";
import dynamic from "next/dynamic";
const BookConsultationDrawer = dynamic(() => import("mangarine/components/ui-components/bookconsultationdrawer"), { ssr: false });
import EditConsultantProfileCard from "mangarine/components/ui-components/editconsultantprofile";
import EditContactMeCard from "mangarine/components/ui-components/editcontactme";
import EditEducationCard from "mangarine/components/ui-components/editeducationcard";
import EditExperienceCard from "mangarine/components/ui-components/editexperiennce";
import EditIntroductionVideoCard from "mangarine/components/ui-components/editintroductoryvideo";
import EditLanguageCard from "mangarine/components/ui-components/editlanguage";
import EditMyWorksCard from "mangarine/components/ui-components/editmyworkscard";
import ProfileActivitySection from "mangarine/components/ui-components/profileactivitysection";
import EditSkillCard from "mangarine/components/ui-components/editskillscard";
import StatusCard from "mangarine/components/ui-components/statscard";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { BiSolidEditAlt } from "react-icons/bi";
import {
  useGetConsultingServicesQuery,
  useGetEducationQuery,
  useGetExperienceQuery,
  useGetLanguagesQuery,
  useGetSkillsQuery,
  useGetWorkQuery,
  useGetUserInfoQuery,
} from "mangarine/state/services/profile.service";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowingQuery,
} from "mangarine/state/services/posts.service";
import { useDispatch } from "react-redux";
import Head from "next/head";
import { isEmpty } from "es-toolkit/compat";
import {
  setConsulting,
  setEducation,
  setExperience,
  setLanguages,
  setSkills,
  setWorks,
} from "mangarine/state/reducers/profile.reducer";
import { useProfile } from "mangarine/state/hooks/profile.hook";
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

const Profile = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { profileId } = (router.query as { profileId?: string }) || {};

  // Redirect legacy /profile?profileId=UUID → /profile/UUID
  useEffect(() => {
    if (profileId && !router.asPath.startsWith(`/profile/${profileId}`)) {
      router.replace(`/profile/${profileId}`);
    }
  }, [profileId, router]);

  const { user } = useAuth();
  // router.query is empty on the first render before hydration — wait for it to be ready
  // so we never incorrectly treat a /profile/[id] route as the own-profile route
  const routerReady = router.isReady;
  const isOwnProfile = routerReady ? (!profileId || profileId === user?.id) : false;
  const { works, skills, educations, experiences, languages, consultings ,contact} =
    useProfile();
  // Fetch fresh profile data — for own profile pass undefined so the API hits /users/get/
  // For other users this single call returns works/skills/education/experience/languages too
  const {
    data: profileInfoRawData,
    currentData: profileInfoCurrentData,
    isLoading: userInfoLoading,
  } = useGetUserInfoQuery({ profileId }, { skip: !routerReady });

  // Individual section queries — only needed for own profile (edit / Redux sync)
  const {
    data: workData,
    currentData: currentWorkData,
    isLoading: workLoading,
  } = useGetWorkQuery({ profileId }, { skip: !isOwnProfile });
  const {
    data: skillData,
    currentData: currentSkillData,
    isLoading: skillLoading,
    error,
  } = useGetSkillsQuery({ profileId }, { skip: !isOwnProfile });
  const {
    data: eduData,
    currentData: eduCurrentData,
    isLoading: eduLoading,
  } = useGetEducationQuery({ profileId }, { skip: !isOwnProfile });
  const {
    data: expData,
    currentData: expCurrData,
    isLoading: expLoading,
  } = useGetExperienceQuery({ profileId }, { skip: !isOwnProfile });
  const {
    data: langData,
    currentData: currLangData,
    isLoading: langLoading,
  } = useGetLanguagesQuery({ profileId }, { skip: !isOwnProfile });

  const {
    data: consultData,
    currentData: curConsultData,
    isLoading: consultingLoading,
  } = useGetConsultingServicesQuery({ profileId }, { skip: !isOwnProfile });

  // API may return { data: {...} } or the object directly — normalise both shapes
  const unwrapUserInfo = (res: any) => res?.data ?? res;
  // Only use currentData — never fall back to `data` which may hold a previous user's result
  const freshUserData = unwrapUserInfo(profileInfoCurrentData);
  // Guard: when viewing another user, ensure the resolved data actually belongs to them
  // This prevents logged-in user's cached data from briefly appearing
  const verifiedUserData = profileId && freshUserData?.id !== profileId ? undefined : freshUserData;
  // For own profile fall back to Redux user while the query loads
  // For other users show skeleton until the correct data resolves
  // Before router is ready show nothing to prevent own data flashing
  const displayUser = !routerReady
    ? undefined
    : profileId
      ? verifiedUserData
      : (verifiedUserData ?? user);

  useEffect(() => {}, [user]);

  useEffect(() => {
    if (!isOwnProfile) return;
    if (!isEmpty(curConsultData)) {
      const { data: consultingsData } = curConsultData;
      dispatch(setConsulting({ consultings: consultingsData }));
    } else if (!isEmpty(consultData)) {
      const { data: consultingsData } = consultData;
      dispatch(setConsulting({ consultings: consultingsData }));
    }
  }, [consultData, curConsultData, dispatch, isOwnProfile]);

  useEffect(() => {
    if (!isOwnProfile) return;
    const raw = currentWorkData ?? workData;
    if (!raw) return;
    // Normalize: { data: [...] } or [...] directly
    const worksArr = Array.isArray(raw) ? raw : Array.isArray(raw.data) ? raw.data : [];
    dispatch(setWorks({ works: worksArr }));
  }, [workData, currentWorkData, dispatch, isOwnProfile]);

  useEffect(() => {
    if (!isOwnProfile) return;
    if (!isEmpty(currentSkillData)) {
      const { data: skillsData } = currentSkillData;
      dispatch(setSkills({ skills: skillsData }));
    } else if (!isEmpty(skillData)) {
      const { data: skillsData } = skillData;
      dispatch(setSkills({ skills: skillsData }));
    }
  }, [skillData, currentSkillData, error, dispatch, isOwnProfile]);

  useEffect(() => {}, [error]);

  useEffect(() => {
    if (!isOwnProfile) return;
    if (!isEmpty(eduCurrentData)) {
      const { data: educationData } = eduCurrentData;
      dispatch(setEducation({ educations: educationData }));
    } else if (!isEmpty(eduData)) {
      const { data: educationData } = eduData;
      dispatch(setEducation({ educations: educationData }));
    }
  }, [eduData, eduCurrentData, dispatch, isOwnProfile]);

  useEffect(() => {
    if (!isOwnProfile) return;
    if (!isEmpty(expCurrData)) {
      const { data: experiencesData } = expCurrData;
      dispatch(setExperience({ experiences: experiencesData }));
    } else if (!isEmpty(expData)) {
      const { data: experiencesData } = expData;
      dispatch(setExperience({ experiences: experiencesData }));
    }
  }, [expData, expCurrData, dispatch, isOwnProfile]);

  useEffect(() => {
    if (!isOwnProfile) return;
    if (!isEmpty(currLangData)) {
      const { data: languagesData } = currLangData;
      dispatch(setLanguages({ languages: languagesData }));
    } else if (!isEmpty(langData)) {
      const { data: languagesData } = langData;
      dispatch(setLanguages({ languages: languagesData }));
    }
  }, [langData, currLangData, dispatch, isOwnProfile]);

  // Normalize: API may return { data: [...] } or [...] directly (API is inconsistent across endpoints)
  const normalizeWorks = (res: any): any[] => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    return [];
  };

  // When viewing another user's profile, use data already embedded in getUserInfo response
  const displayWorks = isOwnProfile ? works : (verifiedUserData?.works ?? []);
  const displaySkills = isOwnProfile ? skills : (verifiedUserData?.skills ?? []);
  const displayEducations = isOwnProfile ? educations : (verifiedUserData?.educations ?? []);
  const displayExperiences = isOwnProfile ? experiences : (verifiedUserData?.experiences ?? []);
  const displayLanguages = isOwnProfile ? languages : (verifiedUserData?.languages ?? []);
  const displayConsultings = isOwnProfile ? consultings : ((curConsultData?.data ?? consultData?.data) || []);

  const [bookingOpen, setBookingOpen] = useState(false);
  const showBookButton = !isOwnProfile && displayUser?.isConsultant;

  const { data: followData, refetch: refetchFollow } = useGetFollowingQuery(
    { targetUserId: profileId },
    { skip: isOwnProfile || !profileId || !routerReady }
  );
  const isFollowing: boolean =
    followData?.data?.isFollowing ?? followData?.isFollowing ?? false;
  const [followUser, { isLoading: isFollowingLoading }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: isUnfollowingLoading }] = useUnfollowUserMutation();
  const followBusy = isFollowingLoading || isUnfollowingLoading;

  const handleFollowToggle = async () => {
    if (!profileId) return;
    if (isFollowing) {
      await unfollowUser({ targetUserId: profileId });
    } else {
      await followUser({ targetUserId: profileId });
    }
    refetchFollow();
  };

  const noScrollbar = {
    "&::-webkit-scrollbar": { width: "0px", height: "0px" },
    "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
    "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", height: "0px", width: 0 },
  };

  const ogTitle = displayUser?.fullName ? `${displayUser.fullName} — Mangerine` : "Mangerine";
  const ogDescription = displayUser?.bio || (displayUser?.businessName ?? displayUser?.title ?? "View profile on Mangerine");
  const ogImage = displayUser?.profilePics || DEFAULT_AVATAR;
  const ogUrl = typeof window !== "undefined"
    ? `${window.location.origin}/profile/${profileId ?? displayUser?.id ?? ""}`
    : `/profile/${profileId ?? ""}`;

  return (
    <>
    <Head>
      <title>{ogTitle}</title>
      <meta name="description" content={ogDescription} />
      <meta property="og:type" content="profile" />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={ogUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={ogTitle} />
      <meta name="twitter:description" content={ogDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Head>
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", lg: "3fr 2fr" }}
      gap={4}
      w="full"
      h={{ base: "auto", md: "full", lg: "full" }}
      minH={0}
      overflowY={{ base: "visible", md: "auto" }}
      overflowX="hidden"
      alignItems="start"
      css={noScrollbar}
    >
      {/* Left — main profile content */}
      <Flex
        flexDir="column"
        gap={4}
        minW={0}
        pb={{ base: 6, lg: 2 }}
      >
          <HStack
            cursor="pointer"
            onClick={() => router.back()}
            color="text_muted"
            _hover={{ color: "text_primary" }}
            transition="color 0.2s"
            w="fit-content"
          >
            <Icon><LuArrowLeft /></Icon>
            <Text fontSize="0.875rem" fontWeight="500">Back</Text>
          </HStack>

          {!displayUser ? (
            <Box bg="bg_box" borderRadius="2xl" overflow="hidden">
              <Skeleton h={{ base: "130px", lg: "180px" }} w="full" />
              <Box px={6} pt={2} pb={4}>
                <Flex justify="space-between" align="flex-end" mb={3}>
                  <SkeletonCircle size="20" mt="-10" border="3px solid white" />
                  <HStack gap={2}>
                    <Skeleton h="32px" w="32px" rounded="lg" />
                    <Skeleton h="32px" w="32px" rounded="lg" />
                    <Skeleton h="32px" w="32px" rounded="lg" />
                  </HStack>
                </Flex>
                <VStack align="flex-start" gap={2}>
                  <Skeleton h="5" w="40%" rounded="md" />
                  <Skeleton h="3.5" w="55%" rounded="md" />
                  <Skeleton h="3" w="70%" rounded="md" />
                  <HStack gap={3} mt={1}>
                    <Skeleton h="3" w="24" rounded="md" />
                    <Skeleton h="3" w="20" rounded="md" />
                  </HStack>
                </VStack>
              </Box>
            </Box>
          ) : (
            <EditConsultantProfileCard
              checkmarkSrc={verified}
              locationSrc={locale}
              dobSrc={dob}
              info={displayUser}
              editable={isOwnProfile}
            />
          )}

          {/* StatsCard + Book button */}
          <Flex
            justify="space-between"
            align={{ base: "flex-start", sm: "center" }}
            flexDir={{ base: "column", sm: "row" }}
            gap={3}
            fontSize="0.875rem"
            color="text_primary"
          >
            <StatusCard
              data={displayUser}
              followers={displayUser?.followerCount}
              following={displayUser?.followingCount}
            />
            <HStack gap={2} flexShrink={0}>
              {!isOwnProfile && (
                <Button
                  size="sm"
                  px={5}
                  borderRadius="8px"
                  loading={followBusy}
                  bg={isFollowing ? "transparent" : "#111D4A"}
                  color={isFollowing ? "text_primary" : "white"}
                  borderWidth={isFollowing ? "1.5px" : "0"}
                  borderColor="text_primary"
                  _hover={{
                    bg: isFollowing ? "red.50" : "#1C275D",
                    color: isFollowing ? "red.500" : "white",
                    borderColor: isFollowing ? "red.400" : "#1C275D",
                  }}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Button>
              )}
              {showBookButton && (
                <Button
                  bg="bt_schedule"
                  color="white"
                  size="sm"
                  px={5}
                  borderRadius="8px"
                  _hover={{ bg: "bt_schedule_hover" }}
                  onClick={() => setBookingOpen(true)}
                >
                  <Icon mr={1}><LuCalendarDays /></Icon>
                  Book Consultation
                </Button>
              )}
            </HStack>
          </Flex>

          <EditMyWorksCard
            title={"My Works"}
            edit={isOwnProfile ? edit : undefined}
            works={displayWorks}
            isLoading={isOwnProfile ? workLoading : userInfoLoading}
          />

          <ProfileActivitySection isOwnProfile={isOwnProfile} profileId={profileId} userId={user?.id} />
        </Flex>

      {/* Right — supplementary profile cards */}
      <Flex
        flexDir="column"
        gap={4}
        minW={0}
        pb={{ base: 6, lg: 2 }}
      >
        <EditIntroductionVideoCard
          title={"Introduction Video"}
          imageSrc={contactme}
          videoLink={displayUser?.videoIntro}
          playIconSrc={play}
          edit={isOwnProfile ? <BiSolidEditAlt /> : undefined}
        />
        <EditContactMeCard
          title={"Contact Me"}
          info={displayUser}
          edit={isOwnProfile ? <BiSolidEditAlt /> : undefined}
        />
        <EditSkillCard
          isLoading={isOwnProfile ? skillLoading : userInfoLoading}
          skills={displaySkills}
          title={"Skills & Expertise"}
          edit={isOwnProfile ? edit : undefined}
        />
        <EditEducationCard
          title={"Education"}
          educations={displayEducations}
          edit={isOwnProfile ? edit : undefined}
          isLoading={isOwnProfile ? eduLoading : userInfoLoading}
        />
        <EditExperienceCard
          title={"Experience"}
          experiences={displayExperiences}
          edit={isOwnProfile ? edit : undefined}
          isLoading={isOwnProfile ? expLoading : userInfoLoading}
        />
        <EditLanguageCard
          title={"Languages"}
          languages={displayLanguages}
          edit={isOwnProfile ? edit : undefined}
          isLoading={isOwnProfile ? langLoading : userInfoLoading}
        />
      </Flex>
    </Box>

    {showBookButton && displayUser && (
      <BookConsultationDrawer
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        consultant={{
          id: displayUser.id,
          fullName: displayUser.fullName,
          profilePics: displayUser.profilePics,
          title: displayUser.title,
        }}
      />
    )}
    </>
  );
};

export default Profile;
