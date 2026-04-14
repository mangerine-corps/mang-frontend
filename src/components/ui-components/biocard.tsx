import { Avatar, Box, HStack, Image, Progress, Text, VStack, Dialog, Button, IconButton } from "@chakra-ui/react";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useRouter } from "next/router";
// import { InfoTip } from "@/components/ui/toggle-tip"
import { useState } from "react";
import { IoIosEye, IoMdCreate } from "react-icons/io";
import { useGetUserInfoQuery, useGetMissingFieldsQuery, useGetProfileCompletionQuery } from "mangarine/state/services/profile.service";

function Biocard() {
  const { user } = useAuth()
  const router = useRouter()
  const [showMissingModal, setShowMissingModal] = useState(false);
  const { data: userInfo } = useGetUserInfoQuery(undefined);
  const { data: missingFieldsResponse } = useGetMissingFieldsQuery(undefined);
  const { data: profileCompletionResponse } = useGetProfileCompletionQuery(undefined);
  const refreshedUser = (userInfo as any)?.data ?? userInfo;
  const profileCompletionPercent =
    (profileCompletionResponse as any)?.data?.profileCompletionPercent ??
    refreshedUser?.profileCompletionPercent ??
    user?.profileCompletionPercent ??
    0;
  const businessMeetingsPath = user?.isConsultant
    ? "/my-business/dashboard?tab=meetings"
    : "/my-business?startOnboarding=1";

  const goToProfile = () => {
    router.push("/profile");
  };

  const navigateTo = (field: string) => {
    // Map fields to likely routes
    const map: Record<string, string> = {
      'profile picture': "/profile/",
      'bio': "/profile/",
      'title': "/profile/",
      'phone number': "/profile/",
      'profile page banner': "/profile/",
      'timezone': "/settings?tab=general",
      'resume': "/profile",
      'pricing': businessMeetingsPath,
      'availability': businessMeetingsPath,
    };

    const path = map[field.toLowerCase()]
    console.log(field, "path") ;
    router.push(path);
  };
  console.log(user, "user")
  return (
    <VStack
      w="full"
      // pb="12px"
      borderRadius="lg"
      border="1px solid"
      borderColor="border_background"
      bg="bg_box"
      onClick={() => {
        goToProfile();
      }}
    >
      <Box
        w="full"
        h="120px"
        bgImage={`url(${user?.profileBanner})`}
        borderTopRadius="lg"
        position="relative"
        // bgRepeat={"no-repeat"}
        // objectFit={"stretch"}
        objectPosition={"center"}
        // pt="24px"
        // px="24px"
        roundedTop={"lg"}
        bg="grey.300"
      >
        <Box>
          <Avatar.Root
            position="absolute"
            bottom="-28px"
            left={{ base: "4", md: "4", lg: "4" }}
            boxSize={{ base: "16", md: "80px", lg: "80px" }}
            borderRadius="full"
            overflow="hidden"
            border={{ base: "3px solid white", md: "4px solid white" }}
          >
            <Avatar.Fallback name={`${user?.fullName}`} />
            <Avatar.Image src={user?.profilePics} />
          </Avatar.Root>
        </Box>
      </Box>

      <Box
        px="6"
        w="full"
        pt={{ base: "10", md: "12" }}
        pb={{ base: "6", md: "6" }}
        justifyContent="flex-start"
      >
        <VStack justifyContent="flex-start" alignItems={"flex-start"}>
          <Text fontWeight="bold" fontSize="lg" color="text_primary">
            {user?.fullName}
          </Text>

          <Text fontSize="sm" color="text_primary">
            {user?.profession}
          </Text>

          <HStack justifyContent="flex-start" alignItems={"flex-start"}>
            <HStack alignItems={"center"}>
              <Image alt="location" src="/images/location.svg" />
              <Text color="text_primary" fontSize="sm">
                {user?.location}
              </Text>
            </HStack>
            <HStack wordSpacing={1}>
              <Image alt="user img" src="/images/usertag.svg" />
              <Text color="text_primary" fontSize="sm">
                {" "}
                Born{" "}
                {new Date(user?.dateOfBirth).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  // hour12: true,
                })}
              </Text>
            </HStack>
          </HStack>

          <Text
            fontSize="0.875rem"
            color="text_primary"
            textAlign="start"
            pt="2"
          >
            {user?.bio}
          </Text>
        </VStack>
        {
          <VStack alignItems="flex-start" w="full" gap="1">
            <Progress.Root
              value={profileCompletionPercent}
              w="full"
            >
              <Progress.Track w="full">
                <Progress.Range bg="#00A991" />
              </Progress.Track>
            </Progress.Root>
            <HStack w="full" justifyContent="space-between" alignItems="center">
              <Text color="text_primary" fontSize="sm" fontWeight="500">
                Profile {profileCompletionPercent}% Complete
              </Text>
              <IconButton
                aria-label="View missing fields"
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMissingModal(true);
                }}
              >
                <IoIosEye />
              </IconButton>
            </HStack>
            <Button
              bg="button_bg"
              color="button_text"
              size="sm"
              mt="2"
              w="full"
              borderRadius="md"
              justifyContent="center"
              onClick={(e) => {
                e.stopPropagation();
                goToProfile();
              }}
            >
              Complete your profile
            </Button>
          </VStack>
        }
        {showMissingModal && (
          <Dialog.Root
            open={showMissingModal}
            onOpenChange={(e) => setShowMissingModal(Boolean((e as any).open))}
          >
            <Dialog.Backdrop />
            <Dialog.Content p={4} onClick={(e) => e.stopPropagation()}>
              <Dialog.Header
                fontSize="md"
                fontWeight="bold"
                color="text_primary"
              >
                Missing profile fields
              </Dialog.Header>
              <Dialog.CloseTrigger />
              <Dialog.Body>
                <VStack alignItems="stretch" gap={3}>
                  {/* Check if missingFields is the new object structure */}
                  {(() => {
                    const missingFields =
                      (missingFieldsResponse as any)?.data?.missingFields ??
                      refreshedUser?.missingFields ??
                      user?.missingFields ??
                      {};
                    const rawFields = [
                      ...(missingFields.basicProfile || []),
                      ...(missingFields.platformActivation || []),
                      ...(missingFields.bookingRequirements || []),
                    ];
                    // Deduplicate while preserving order and original casing
                    const seen = new Set<string>();
                    const allMissingFields = rawFields.filter((f: string) => {
                      const key = String(f).toLowerCase();
                      if (seen.has(key)) return false;
                      seen.add(key);
                      return true;
                    });

                    if (allMissingFields.length === 0) {
                      return (
                        <Text color="text_primary" fontSize="sm">
                          No missing fields 🎉
                        </Text>
                      );
                    }

                    return allMissingFields.map((field: string) => (
                      <HStack key={field} justifyContent="space-between">
                        <Text
                          textTransform="capitalize"
                          color="text_primary"
                          fontSize="sm"
                        >
                          {field}
                        </Text>
                        <Button
                          size="xs"
                          onClick={() =>
                            navigateTo(field.toLowerCase().replace(" ", ""))
                          }
                        >
                          <IoMdCreate />
                        </Button>
                      </HStack>
                    ));
                  })()}
                </VStack>
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Root>
        )}
      </Box>
    </VStack>
  );
}

export default Biocard;
