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
      'pricing': "/my-business?tab=meetings",
      'availability': "/my-business?tab=meetings",
    };

    const path = map[field.toLowerCase()]
    console.log(field, "path") ;
    router.push(path);
  };
  console.log(user, "user")
  return (
    <VStack
      w={{ base: "100%", sm: "90%", md: "100%" }} // full width on mobile, tighter on small screens
      maxW={{ base: "full", md: "340px", lg: "400px" }} // don’t stretch too wide on large screens
      // pb="12px"
      borderRadius="lg"
      // bg="red.800"
      shadow={{ base: "sm", md: "md", lg: "xs", xl: "xs" }}
      bg="bg_box"
      onClick={() => {
        router.push("./profile");
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
            top={{ base: "20", md: "70px", lg: "65px" }}
            left={{ base: "4", md: "4", lg: "4" }}
            // transform="translateX(-150%)"
            boxSize={{ base: "16", md: "80px", lg: "90px" }}
            borderRadius="full"
            // bg="red.500"
            overflow="hidden"
            border={{ base: "2px solid white", md: "4px solid white" }}
          >
            <Avatar.Fallback name={`${user?.fullName}`} />
            <Avatar.Image src={user?.profilePics} />
          </Avatar.Root>
        </Box>
      </Box>

      <Box
        px="6"
        w="full"
        pt={{ base: "6", md: "40px" }}
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
          <VStack alignItems="flex-start" w="full">
            <HStack w="full" justifyContent="space-between" alignItems="center">
              <Text mb="2" color="text_primary" fontSize="sm" fontWeight="500">
                {(refreshedUser?.isConsultant ?? user?.isConsultant)
                  ? "Complete your consultant profile"
                  : "Complete your profile"}{" "}
                (
                {(profileCompletionResponse as any)?.data
                  ?.profileCompletionPercent ??
                  refreshedUser?.profileCompletionPercent ??
                  user?.profileCompletionPercent ??
                  0}
                %)
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
            <Progress.Root
              value={
                (profileCompletionResponse as any)?.data
                  ?.profileCompletionPercent ??
                refreshedUser?.profileCompletionPercent ??
                user?.profileCompletionPercent ??
                0
              }
              maxW="240px"
              w="full"
            >
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
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
