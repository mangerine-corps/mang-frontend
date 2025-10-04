import { Box, Flex, RadioGroup, Switch, Text, VStack, HStack, Button, Spinner } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
type MessagingPreference = 'everyone' | 'followers' | 'communityMembers' | 'noOne';
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from "mangarine/state/services/settings.service";
import { toaster } from "../ui/toaster";

const PrivacySetting = () => {
  const { data, isLoading, refetch, isFetching } = useGetUserSettingsQuery();
  const [updateUserSettings, { isLoading: saving }] = useUpdateUserSettingsMutation();
  const server = useMemo(() => (data as any)?.data || {}, [data]);

  const [messagingPreference, setMessagingPreference] = useState<MessagingPreference | null>(null);
  const [appearInSearchResults, setAppearInSearchResults] = useState<boolean>(false);

  useEffect(() => {
    if (server) {
      if (server.messagingPreference) setMessagingPreference(server.messagingPreference);
      if (typeof server.appearInSearchResults === 'boolean') setAppearInSearchResults(server.appearInSearchResults);
    }
  }, [server]);

 const onSave = async () => {
   try {
     const res = await updateUserSettings({
       messagingPreference,
       appearInSearchResults,
     }).unwrap();

     toaster.create({
       type: "success",
       title: "Settings Saved",
       description:
         res?.message || "Your preferences have been updated successfully.",
       closable: true,
     });

     refetch();
   } catch (err: any) {
     toaster.create({
       type: "error",
       title: "Failed to Save",
       description:
         err?.message || "Something went wrong while saving your settings.",
       closable: true,
     });
   }
 };

  return (
    <Flex
      direction="column"
      align="flex-start"
      justify="flex-start"
      minH="full"
      w="full"
      overflowY={{ base: "auto", md: "flex", lg: "flex" }}
      maxH={{ base: "full", md: "flex", lg: "flex" }}
    >
      <Box
        //w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}

        borderRadius="lg"
        boxShadow="lg"
        bg="main_background"
        p={8}
        w="full"
        //px={6}
        //py={6}
        // marginLeft={40}
        mt={0}
      >
        <HStack justify="space-between" mb={4}>
          <Text fontSize={{ base: "lg", md: "xl",lg: '1.5rem' }} fontWeight="600">Privacy Settings</Text>
        </HStack>
        {(isLoading || isFetching) && (
          <HStack py={4}><Spinner size="sm" /><Text>Loading...</Text></HStack>
        )}
        {/* Phone Section */}
        <Box mt={{ base: 4, md: 8, lg: 0, xl: "flex" }}>
          <Text
            font="outfit"
            fontSize={{ base: "1rem", md: "1.5rem", lg: "1.3rem" }}
            fontWeight="600"
            color="text_primary"
            lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px", }}
            mb={4}
          >
            Messaging
          </Text>
          <Text
            font="outfit"
            fontSize={{ base: "0.875rem", sm: "1rem", md: "1.15rem",}}
            w="400"
            color="text_primary"
            lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px", }}
          >
            Who can message me?
          </Text>
          <VStack
            w="full"
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
            my="4"
          >
            <RadioGroup.Root
              value={messagingPreference as any}
              onValueChange={(e) => setMessagingPreference(e.value as MessagingPreference)}
              w="full"
            >
              <VStack w="full" gapY={7}>
                {[
                  { id: 1, label: "Everyone", value: 'everyone' },
                  { id: 2, label: "Followers", value: 'followers' },
                  { id: 3, label: "Community members", value: 'communityMembers' },
                  { id: 4, label: "No one", value: 'noOne' },
                ].map((item) => (
                  <RadioGroup.Item
                    key={item.id}
                    value={item.value}
                    w="full"
                    alignItems={"flex-start"}
                    justifyContent={"space-between"}

                  // bg="red.900"
                  >
                    <RadioGroup.ItemText
                      color={"text_primary"}
                      fontSize={{ base: "0.875rem", sm: "1rem", md: "1rem", }}
                      fontWeight={"400"}
                      gap={2}
                    >
                      {item.label}
                    </RadioGroup.ItemText>
                    <RadioGroup.ItemHiddenInput />
                    <RadioGroup.ItemIndicator />
                  </RadioGroup.Item>
                ))}
              </VStack>
            </RadioGroup.Root>
          </VStack>
        </Box>

        <Box my={12}>
          <Text
            font="outfit"
            fontSize={{ base: "1rem", md: "1.3rem", }}
            fontWeight="600"
            color="text_primary"
            lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px", }}
            mb={4}
          >
            Profile Visibility
          </Text>

          <VStack
            w="full"
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
            my="4"
          >
            <Switch.Root
              w="full"
              alignItems={"flex-start"}
              justifyContent={"space-between"}
              checked={appearInSearchResults}
              onCheckedChange={(e) => setAppearInSearchResults(!!(e as any).checked)}
            >
              <Switch.Label
                color={"text_primary"}
                fontSize={{ base: "0.875rem", sm: "1rem", md: "1rem",}}
                fontWeight={"400"}
              >
                Appear in search results
              </Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
          </VStack>
        </Box>
        {/* You can add more privacy toggles here later */}
        <Button size="sm" px={4} colorScheme="blue" onClick={onSave} loading={saving}>Save Changes</Button>
      </Box>

    </Flex>
  );
}

export default PrivacySetting;