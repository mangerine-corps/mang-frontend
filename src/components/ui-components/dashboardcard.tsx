import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import path from "path";
import CustomButton from "../customcomponents/button";
import { useBecomeConsultantMutation } from "mangarine/state/services/user.service";
import { useLazyGetUserInfoQuery } from "mangarine/state/services/profile.service";
import { useDispatch } from "react-redux";
import { setUpdatedInfo } from "mangarine/state/reducers/auth.reducer";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { isEmpty } from "es-toolkit/compat";
import { useEffect } from "react";
import { toaster } from "../ui/toaster";

const DashboardCard = () => {
  const router = useRouter();
  const { tab = "wallet" } = router.query;
  const [becomeConsultant, { isLoading: becomeConsultantLoading, isError: becomeConsultantError }] = useBecomeConsultantMutation();
  const [triggerGetUserInfo] = useLazyGetUserInfoQuery();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const goToTransaction = (tabName) => {
    router.push({ pathname: "/my-business", query: { ...router.query, tab: tabName } }, undefined, { shallow: true });
  };
  const goToConsultation = (tabName) => {
    router.push({ pathname: "/my-business", query: { ...router.query, tab: tabName } }, undefined, { shallow: true });
  };
  useEffect(() => {

  }, [user])


  const menuItems = [
    // {
    //   icon: "/icons/saved.svg",
    //   label: "Saved Items",
    //   action: () => router.push("/dashboard/saved"),
    // },
    {
      icon: "/icons/payment.svg",
      label: "Payments",
      action: () => goToTransaction(""),
    },
    {
      icon: "/icons/payment.svg",
      label: "Transaction History",
      action: () => goToTransaction("wallet"),
    },
    {
      icon: "/icons/payment.svg",
      label: "Earning Reports",
      action: () => goToTransaction("wallet"),
    },
  ];

  const becomeAConsultant = () => {
    becomeConsultant({})
      .unwrap()
      .then(async (res) => {
        // Fetch latest user info and update auth state so UI reflects consultant status
        try {
          const userInfoResp = await triggerGetUserInfo(undefined).unwrap();
          const latestUser = userInfoResp?.data ?? userInfoResp; // handle {data: ...} shape
          if (latestUser) {
            dispatch(setUpdatedInfo({ updatedInfo: latestUser }));
          }
          console.log(latestUser, "latestUser");
          toaster.create({
            title: "Success",
            description: "You have successfully become a consultant!!! please update you profile to start taking consultations",
            type: "success",
            duration: 6000,
            closable: true,
          })
        } catch (e) {
          console.warn("Failed to refresh user info after becoming consultant", e);
        }
        // if(!isEmpty(res.data)){
        //   setOpenConsultant(false)
        // }
      })
      .catch((err) => {
        console.log(err, "error becoming consultant");
      });
  }

  return (
    <VStack
      w={{ base: "100%", sm: "90%", md: "100%" }} // full width on mobile, tighter on small screens
      maxW={{ base: "full", md: "340px", lg: "400px" }} // don’t stretch too wide on large screens
    // display={{ base: "none", md: "flex", lg: "flex" }}
    >
      {/* Menu List */}
      <Box
        w="full"
        // maxW="md"
        // w={{ base: "95%", md: "99%", lg: "full", xl: "340px" }}
        display={{ base: "flex", md: "flex", lg: "flex" }}
        bg="main_background"
        borderRadius="8px"
        // border="1px solid"
        borderColor="border_background"
        boxShadow="sm"
        p="24px"
        gap="24px"
        shadow={{ base: "sm", md: "md", lg: "xs", xl: "xs" }}
      // w="340px"
      >
        <VStack w="full" align="stretch" spaceY={2}>
          {menuItems.map((item, index) => (
            <HStack as="button" key={index} onClick={item.action}>
              <Image src={item.icon} alt="menu-icons" />
              {/* <Icon color="text_primary" as={item.icon} /> */}
              <Text fontSize="0.875rem" fontWeight="400" color="text_primary">
                {item.label}
              </Text>
            </HStack>
          ))}
          {
            !isEmpty(user) && !user?.isConsultant && (
              <CustomButton
                customStyle={{
                  w: "100%",
                }}
                onClick={becomeAConsultant}
                loading={becomeConsultantLoading}
              // onClick={handleSubmit(onSubmit, (error) => console.log(error))}
              >
                <Text
                  color={"button_text"}
                  fontWeight={"600"}
                  fontSize={{ base: "0.875rem", md: "1rem" }}
                  lineHeight={"100%"}
                >
                  Become a Consultant
                </Text>
              </CustomButton>
            )
          }
        </VStack>
      </Box>
    </VStack>
  );
};

export default DashboardCard;
