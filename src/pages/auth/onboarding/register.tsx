import { VStack } from "@chakra-ui/react";

import GuestLayout from "mangarine/layouts/GuestLayout";
import OnboardingOne from "./onboarding-one";

const Register = () => {
  return (
    <GuestLayout>
      <VStack  w="full" h="full" flex={1}>
        
        <OnboardingOne/>
      </VStack>
    </GuestLayout>
  );
};

export default Register;
