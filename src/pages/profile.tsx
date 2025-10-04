import { Box, Flex, Stack } from "@chakra-ui/react";
import DynamicTabs from "mangarine/components/ui-components/consultantfeedwrapper";
import ConsultingServices from "mangarine/components/ui-components/consultingservicestab";
import EditConsultantProfileCard from "mangarine/components/ui-components/editconsultantprofile";
import EditContactMeCard from "mangarine/components/ui-components/editcontactme";
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

const contactme = "/assets/images/contactme.png";
// const coverphoto = "/images/coverphoto.png";
const dp = "/images/dp.png";
const play = "/assets/images/play.svg";
// const works3 = "/images/works3.png";
const verified = "/assets/images/verified consultant.svg";
const locale = "/assets/images/locale.svg";
const dob = "/assets/images/dob.svg";
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

  // };
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

  // fetch target user info when viewing another profile
  const { data: profileInfoData } = useGetUserInfoQuery({ profileId });
  const displayUser = profileId ? profileInfoData?.data : user;
  const isOwnProfile = !profileId || profileId === user?.id;

  useEffect(() => {}, [user]);

  useEffect(() => {
    if (!isEmpty(curConsultData)) {
      const { data: consultingsData } = curConsultData;
      dispatch(setConsulting({ consultings: consultingsData }));
    } else if (!isEmpty(consultData)) {
      const { data: consultingsData } = consultData;
      dispatch(setConsulting({ consultings: consultingsData }));
    }
  }, [consultData, curConsultData, dispatch]);

  useEffect(() => {
    if (!isEmpty(currentWorkData)) {
      const { data: worksData } = currentWorkData;
      dispatch(setWorks({ works: worksData }));
    } else if (!isEmpty(workData)) {
      const { data: worksData } = workData;
      dispatch(setWorks({ works: worksData }));
    }
  }, [workData, currentWorkData, dispatch]);

  useEffect(() => {
    if (!isEmpty(currentSkillData)) {
      const { data: skillsData } = currentSkillData;
      dispatch(setSkills({ skills: skillsData }));
    } else if (!isEmpty(skillData)) {
      const { data: skillsData } = skillData;
      dispatch(setSkills({ skills: skillsData }));
    }
  }, [skillData, currentSkillData, error, dispatch]);

  useEffect(() => {}, [error]);

  useEffect(() => {
    if (!isEmpty(eduCurrentData)) {
      const { data: educationData } = eduCurrentData;
      // console.log(educationData,"edu")
      dispatch(setEducation({ educations: educationData }));
      //  console.log(educationData, "daaaa");
    } else if (!isEmpty(eduData)) {
      const { data: educationData } = eduData;
      dispatch(setEducation({ educations: educationData }));
    }
  }, [eduData, eduCurrentData, dispatch]);

  useEffect(() => {
    if (!isEmpty(expCurrData)) {
      const { data: experiencesData } = expCurrData;
      dispatch(setExperience({ experiences: experiencesData }));
    } else if (!isEmpty(expData)) {
      const { data: experiencesData } = expData;
      dispatch(setExperience({ experiences: experiencesData }));
    }
  }, [expData, expCurrData, dispatch]);

  useEffect(() => {
    if (!isEmpty(currLangData)) {
      const { data: languagesData } = currLangData;
      dispatch(setLanguages({ languages: languagesData }));
    } else if (!isEmpty(langData)) {
      const { data: languagesData } = langData;
      dispatch(setLanguages({ languages: languagesData }));
    }
  }, [langData, currLangData, dispatch]);

  return (
    <AppLayout>
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
          // h="full"
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
          <Box w="full">
            <EditConsultantProfileCard
              checkmarkSrc={verified}
              locationSrc={locale}
              dobSrc={dob}
              info={displayUser}
              editable={isOwnProfile}
            />
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
            works={works}
            isLoading={workLoading}
          />

          {user?.isConsultant === true && (
            <Box w="full" my="4">
              <DynamicTabs data={user}
                // activity={<NewsItem post={[]} />}
                consulting={
                  <ConsultingServices
                    isLoading={consultingLoading}
                    consultings={consultings}
                  />
                }
                reviews={<RatingAndReviewComponent reviews={reviews} />}
              />
            </Box>
          )}
        </Flex>

        <Stack
          flexDir={"column"}
          overflowY={{ base: "none", md: "none", lg: "auto" }}
          flex="1.5"
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
              videoLink={displayUser?.videoIntro}
              playIconSrc={play}
              edit={isOwnProfile ? <BiSolidEditAlt /> : undefined}
            />
            <Box mt={4} w="full">
              <EditContactMeCard
                title={"Contact Me"}
                // info={contact}
                edit={isOwnProfile ? <BiSolidEditAlt /> : undefined}
              />
            </Box>
            <Box mt={4}>
              <EditSkillCard
                isLoading={skillLoading}
                skills={skills}
                title={"Skills & Expertise"}
                edit={isOwnProfile ? edit : undefined}
              />
            </Box>
            <Box mt={4}>
              <EditEducationCard
                title={"Education"}
                educations={educations}
                edit={isOwnProfile ? edit : undefined}
                isLoading={eduLoading}
              />
            </Box>
            <Box mt={4}>
              <EditExperienceCard
                title={"Experience"}
                experiences={experiences}
                edit={isOwnProfile ? edit : undefined}
                isLoading={expLoading}
              />
            </Box>

            <Box mt={4}>
              <EditLanguageCard
                title={"Languages"}
                languages={languages}
                edit={isOwnProfile ? edit : undefined}
                isLoading={langLoading}
              />
            </Box>
          </Box>
        </Stack>
      </Flex>
    </AppLayout>
  );
};

export default Profile;
