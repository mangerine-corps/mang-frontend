import { Image, Text, VStack } from "@chakra-ui/react";
import CustomButton from "mangarine/components/customcomponents/button";
import { ColorModeButton } from "mangarine/components/ui/color-mode";
import GuestLayout from "mangarine/layouts/GuestLayout";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { setCredentials, setPreAuth } from "mangarine/state/reducers/auth.reducer";
import { useDispatch } from "react-redux";

const Success = () => {
  const {preAuth} = useAuth()
  const dispatch = useDispatch()


  const gotoHome = () => {
    const {token,user} = preAuth
    dispatch(setCredentials({user:user,token:token}))
    dispatch(setPreAuth({info: {}}))
    
  }
  return (
    <GuestLayout>
      <VStack
      
        // px={{base:"0px", md:"40px",lg:"40px"}}
        h="full"
        // bg='red.500'
        flex={1}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {/* <Text> Success</Text> */}
        {/* <Box display={{ base: "flex", md: "none" }}>
          <Logo
            logo={`${colorMode === "dark" ? "/images/logo.svg" : "/images/logoDark.svg"}`}
            bgColor={"bd_background"}
          />
        </Box> */}

        <Image src="/images/Vector.svg" alt="success-img" />
        <VStack w={{ base: "80%", md: "60%" }} my="8px">
          <Text
            textAlign={"center"}
            color="text_primary"
            mt="8"
            fontSize="2rem"
            fontWeight="600"
          >
            Registration Successful!
          </Text>
          <Text
            textAlign={"center"}
            mb="8"
            fontSize="1.25rem"
            lineHeight={"30px"}
            color="text_primary"
          >
            Your account has successfully been created. Enjoy features on
            Mangerine.{" "}
          </Text>
        </VStack>
        <CustomButton
          customStyle={{
              w:"30%"
          }}
          onClick={gotoHome}
        >
          <Text
            color={"button_text"}
            fontWeight={"600"}
            fontSize={"1rem"}
            lineHeight={"100%"}
          >
            Go to home
          </Text>
        </CustomButton>
      </VStack>
    </GuestLayout>
  );
};

export default Success;
