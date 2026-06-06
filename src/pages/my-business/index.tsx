"use client";

import { useEffect } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import ConsultantOnboardingFlow from "mangarine/components/ui-components/mybusiness/onboarding-flow";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useGetConsultantStatusQuery } from "mangarine/state/services/user.service";

const MyBusinessPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useGetConsultantStatusQuery();

  useEffect(() => {
    if (!isLoading) {
      console.log("[/users/become/consultant/status]", { data, isError, error });
    }
  }, [isLoading, data, error]);

  useEffect(() => {
    if (user?.isConsultant) {
      router.replace("/my-business/dashboard");
    }
  }, [router, user?.isConsultant]);

  return (
    <>
      {user?.isConsultant ? (
        <Center w="full" h="full">
          <Spinner size="lg" color="text_primary" />
        </Center>
      ) : (
        <ConsultantOnboardingFlow />
      )}
    </>
  );
};

export default MyBusinessPage;
