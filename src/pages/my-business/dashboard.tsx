"use client";

import { useEffect } from "react";
import { Center, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import MyBusinessWorkspace from "mangarine/components/ui-components/mybusiness/workspace";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useGetConsultantStatusQuery } from "mangarine/state/services/user.service";

const MyBusinessDashboardPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useGetConsultantStatusQuery();

  useEffect(() => {
    if (!isLoading) {
      console.log("[/users/become/consultant/status]", { data, isError, error });
    }
  }, [isLoading, data, error]);

  useEffect(() => {
    if (user && !user.isConsultant) {
      router.replace("/my-business?startOnboarding=1");
    }
  }, [router, user]);

  return (
    <>
      {user?.isConsultant ? (
        <MyBusinessWorkspace />
      ) : (
        <Center w="full" h="full">
          <Spinner size="lg" color="text_primary" />
        </Center>
      )}
    </>
  );
};

export default MyBusinessDashboardPage;
