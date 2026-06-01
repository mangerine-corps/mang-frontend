import { Box, Flex, HStack, Icon, Skeleton, SkeletonCircle, Stack, Text, VStack } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
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
import { useEffect } from "react";
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
  const { works, skills, educations, experiences, languages, consultings ,contact} =
    useProfile();
  const {
    data: workData,
    currentData: currentWorkData,
    isLoading: workLoading,
  } = useGetWorkQuery({ profileId });
  const {
    data: skillData,
    currentData: currentSkillData,
    isLoading: skillLoading,
    error,
  } = useGetSkillsQuery({ profileId });
  const {
    data: eduData,
    currentData: eduCurrentData,
    isLoading: eduLoading,
  } = useGetEducationQuery({ profileId });
  const {
    data: expData,
    currentData: expCurrData,
    isLoading: expLoading,
  } = useGetExperienceQuery({ profileId });
  const {
    data: langData,
    currentData: currLangData,
    isLoading: langLoading,
  } = useGetLanguagesQuery({ profileId });

  const {
    data: consultData,
    currentData: curConsultData,
    isLoading: consultingLoading,
  } = useGetConsultingServicesQuery({ profileId });

  // Fetch fresh profile data — for own profile pass undefined so the API hits /users/get/
  const {
    data: profileInfoRawData,
    currentData: profileInfoCurrentData,
  } = useGetUserInfoQuery({ profileId });

  // API may return { data: {...} } or the object directly — normalise both shapes
  const unwrapUserInfo = (res: any) => res?.data ?? res;
  const freshUserData = unwrapUserInfo(profileInfoCurrentData ?? profileInfoRawData);
  // Merge fresh data (for up-to-date follower/following counts) with Redux user as fallback
  const displayUser = profileId ? freshUserData : (freshUserData ?? user);
  const isOwnProfile = !profileId || profileId === user?.id;

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

  // When viewing another user's profile, derive display data directly from query results
  const displayWorks = isOwnProfile ? works : normalizeWorks(currentWorkData ?? workData);
  const displaySkills = isOwnProfile ? skills : ((currentSkillData?.data ?? skillData?.data) || []);
  const displayEducations = isOwnProfile ? educations : ((eduCurrentData?.data ?? eduData?.data) || []);
  const displayExperiences = isOwnProfile ? experiences : ((expCurrData?.data ?? expData?.data) || []);
  const displayLanguages = isOwnProfile ? languages : ((currLangData?.data ?? langData?.data) || []);
  const displayConsultings = isOwnProfile ? consultings : ((curConsultData?.data ?? consultData?.data) || []);

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
      h={{ base: "auto", lg: "full" }}
      alignItems="start"
      overflowX="hidden"
      css={noScrollbar}
    >
      {/* Left — main profile content */}
      <Flex
        flexDir="column"
        h={{ base: "auto", lg: "full" }}
        overflowY={{ base: "visible", lg: "auto" }}
        rounded="xl"
        css={noScrollbar}
      >
          <HStack
            mb={3}
            cursor="pointer"
            onClick={() => router.back()}
            color="text_muted"
            _hover={{ color: "text_primary" }}
            transition="color 0.2s"
            w="fit-content"
          >
            <Icon>
              <LuArrowLeft />
            </Icon>
            <Text fontSize="0.875rem" fontWeight="500">Back</Text>
          </HStack>

          <Box w="full">
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
          </Box>


          {/* StatsCard and Buttons */}
          <Flex
            justify="space-between"
            align="center"
            my={4}
            fontSize="0.875rem"
            color="text_primary"
          >
            <StatusCard
              data={displayUser}
              followers={displayUser?.followerCount}
              following={displayUser?.followingCount}
            />
            {/* <Flex gap={4}>
            <Button {...buttonStyles(0)} onClick={() => handleButtonClick(0)}>
              Follow
            </Button>
            <Button
              {...buttonStyles(1, true)}
              onClick={() => handleButtonClick(1)}
            >
              <HiOutlineUserAdd style={{ marginRight: "8px" }} />
              Book Consultation
            </Button>
          </Flex> */}
          </Flex>

          <EditMyWorksCard
            title={"My Works"}
            edit={isOwnProfile ? edit : undefined}
            works={displayWorks}
            isLoading={workLoading}
          />

          <Box w="full" my="4">
            <ProfileActivitySection isOwnProfile={isOwnProfile} profileId={profileId} userId={user?.id} />
          </Box>
        </Flex>

      {/* Right — supplementary profile cards */}
      <Stack
        flexDir="column"
        h={{ base: "auto", lg: "full" }}
        overflowY={{ base: "visible", lg: "auto" }}
        css={noScrollbar}
      >
          <Box overflowY="auto" css={noScrollbar}>
            <EditIntroductionVideoCard
              title={"Introduction Video"}
              imageSrc={contactme}
              videoLink={displayUser?.videoIntro}
              playIconSrc={play}
              edit={isOwnProfile ? <BiSolidEditAlt /> : undefined}
            />
            <Box mt={4} w="full">
              <EditContactMeCard
                title={"Contact Me"}
                info={displayUser}
                edit={isOwnProfile ? <BiSolidEditAlt /> : undefined}
              />
            </Box>
            <Box mt={4}>
              <EditSkillCard
                isLoading={skillLoading}
                skills={displaySkills}
                title={"Skills & Expertise"}
                edit={isOwnProfile ? edit : undefined}
              />
            </Box>
            <Box mt={4}>
              <EditEducationCard
                title={"Education"}
                educations={displayEducations}
                edit={isOwnProfile ? edit : undefined}
                isLoading={eduLoading}
              />
            </Box>
            <Box mt={4}>
              <EditExperienceCard
                title={"Experience"}
                experiences={displayExperiences}
                edit={isOwnProfile ? edit : undefined}
                isLoading={expLoading}
              />
            </Box>
            <Box mt={4}>
              <EditLanguageCard
                title={"Languages"}
                languages={displayLanguages}
                edit={isOwnProfile ? edit : undefined}
                isLoading={langLoading}
              />
            </Box>
          </Box>
        </Stack>
    </Box>
    </>
  );
};

export default Profile;
