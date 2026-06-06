import { Box, Flex, RadioGroup, Switch, Text, VStack, HStack, Spinner } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
type MessagingPreference = 'everyone' | 'followers' | 'communityMembers' | 'noOne';
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from "mangarine/state/services/settings.service";
import { toaster } from "../ui/toaster";

const PrivacySetting = () => {
  const { data, isLoading, refetch, isFetching } = useGetUserSettingsQuery();
  const [updateUserSettings, { isLoading: saving }] = useUpdateUserSettingsMutation();
  const server = useMemo(() => (data as any)?.data || {}, [data]);

  const [messagingPreference, setMessagingPreference] = useState<MessagingPreference | null>(null);
  const [showOnlineStatus, setShowOnlineStatus] = useState<boolean>(false);
  const [appearInSearchResults, setAppearInSearchResults] = useState<boolean>(false);
  const [allowSearchEngines, setAllowSearchEngines] = useState<boolean>(false);

  useEffect(() => {
    if (server) {
      if (server.messagingPreference) setMessagingPreference(server.messagingPreference);
      if (typeof server.showOnlineStatus === 'boolean') setShowOnlineStatus(server.showOnlineStatus);
      if (typeof server.appearInSearchResults === 'boolean') setAppearInSearchResults(server.appearInSearchResults);
      if (typeof server.allowSearchEngines === 'boolean') setAllowSearchEngines(server.allowSearchEngines);
    }
  }, [server]);

  const saveSettings = async (overrides: Partial<{
    messagingPreference: MessagingPreference;
    showOnlineStatus: boolean;
    appearInSearchResults: boolean;
    allowSearchEngines: boolean;
  }> = {}) => {
    try {
      const res = await updateUserSettings({
        messagingPreference,
        showOnlineStatus,
        appearInSearchResults,
        allowSearchEngines,
        ...overrides,
      }).unwrap();

      toaster.create({
        type: "success",
        title: "Saved",
        description: res?.message || "Your preferences have been updated.",
        closable: true,
      });

      refetch();
    } catch (err: any) {
      toaster.create({
        type: "error",
        title: "Failed to Save",
        description: err?.message || "Something went wrong while saving your settings.",
        closable: true,
      });
    }
  };

  return (
    <Flex
      direction="column"
      align="flex-start"
      justify="flex-start"
      h="full"
      w="full"
      overflowY="auto"
    >
      <Box
        borderRadius="lg"
        boxShadow="lg"
        bg="main_background"
        p={{ base: 4, md: 8 }}
        w="full"
      >
        <HStack justify="space-between" mb={4}>
          <Text fontSize={{ base: "1rem", md: "1.5rem" }} fontWeight="600">Privacy Settings</Text>
          {saving && <Spinner size="sm" />}
        </HStack>
        {(isLoading || isFetching) && (
          <HStack py={4}><Spinner size="sm" /><Text>Loading...</Text></HStack>
        )}

        <Box>
          <Text
            font="outfit"
            fontSize={{ base: "0.875rem", md: "1.1rem" }}
            fontWeight="600"
            color="text_primary"
            lineHeight="1.4"
            mb={4}
          >
            Messaging
          </Text>
          <Text
            font="outfit"
            fontSize={{ base: "0.8rem", md: "0.95rem" }}
            w="400"
            color="text_primary"
            lineHeight="1.4"
          >
            Who can message me?
          </Text>
          <VStack w="full" alignItems="flex-start" justifyContent="flex-start" my="4">
            <RadioGroup.Root
              value={messagingPreference as any}
              onValueChange={(e) => {
                const val = e.value as MessagingPreference;
                setMessagingPreference(val);
                saveSettings({ messagingPreference: val });
              }}
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
                    alignItems="flex-start"
                    justifyContent="space-between"
                  >
                    <RadioGroup.ItemText
                      color="text_primary"
                      fontSize={{ base: "0.875rem", md: "1rem" }}
                      fontWeight="400"
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
            fontSize={{ base: "0.875rem", md: "1.1rem" }}
            fontWeight="600"
            color="text_primary"
            lineHeight="1.4"
            mb={4}
          >
            Profile Visibility
          </Text>
          <VStack w="full" alignItems="flex-start" justifyContent="flex-start" my="4">
            <Switch.Root
              w="full"
              alignItems="flex-start"
              justifyContent="space-between"
              checked={showOnlineStatus}
              onCheckedChange={(e) => {
                const val = !!(e as any).checked;
                setShowOnlineStatus(val);
                saveSettings({ showOnlineStatus: val });
              }}
            >
              <Switch.Label
                color="text_primary"
                fontSize={{ base: "0.875rem", md: "1rem" }}
                fontWeight="400"
              >
                Show online status
              </Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
          </VStack>
        </Box>

        <Box my={12}>
          <Text
            font="outfit"
            fontSize={{ base: "0.875rem", md: "1.1rem" }}
            fontWeight="600"
            color="text_primary"
            lineHeight="1.4"
            mb={4}
          >
            Search Visibility
          </Text>
          <VStack w="full" alignItems="flex-start" justifyContent="flex-start" my="4" gapY={6}>
            <Switch.Root
              w="full"
              alignItems="flex-start"
              justifyContent="space-between"
              checked={appearInSearchResults}
              onCheckedChange={(e) => {
                const val = !!(e as any).checked;
                setAppearInSearchResults(val);
                saveSettings({ appearInSearchResults: val });
              }}
            >
              <Switch.Label
                color="text_primary"
                fontSize={{ base: "0.875rem", md: "1rem" }}
                fontWeight="400"
              >
                Appear in search results
              </Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>

            <Switch.Root
              w="full"
              alignItems="flex-start"
              justifyContent="space-between"
              checked={allowSearchEngines}
              onCheckedChange={(e) => {
                const val = !!(e as any).checked;
                setAllowSearchEngines(val);
                saveSettings({ allowSearchEngines: val });
              }}
            >
              <Switch.Label
                color="text_primary"
                fontSize={{ base: "0.875rem", md: "1rem" }}
                fontWeight="400"
              >
                Allow search engines to link to my profile
              </Switch.Label>
              <Switch.HiddenInput />
              <Switch.Control />
            </Switch.Root>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
}

export default PrivacySetting;
