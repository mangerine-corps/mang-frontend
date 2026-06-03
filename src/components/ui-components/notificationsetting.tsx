import { Box, Flex, Switch, Text, VStack, HStack, Spinner, Icon } from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";
import { useEffect, useMemo, useState } from "react";
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation } from "mangarine/state/services/settings.service";
import { toaster } from "../ui/toaster";
import { Check } from "lucide-react";

const NotificationSetting = () => {
  const { data, isLoading, isFetching, refetch } = useGetNotificationSettingsQuery({});
  const [updateSettings, { isLoading: saving }] = useUpdateNotificationSettingsMutation();
  const server = useMemo(() => (data as any) || {}, [data]);

  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState<boolean>(true);
  const [paymentNotificationsEnabled, setPaymentNotificationsEnabled] = useState<boolean>(true);

  const [emailSelected, setEmailSelected] = useState<Set<string>>(new Set());
  const [paymentSelected, setPaymentSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (server && server.id) {
      setEmailNotificationsEnabled(!!server.emailNotificationsEnabled);
      setPaymentNotificationsEnabled(
        typeof server.paymentNotificationsEnabled === 'boolean'
          ? server.paymentNotificationsEnabled
          : !!server.emailNotificationsEnabled
      );

      const email = new Set<string>();
      if (server.newMessageEmail) email.add('newMessage');
      if (server.consultationRequestEmail) email.add('consultationRequest');
      if (server.platformAnnouncementEmail) email.add('platformAnnouncement');
      setEmailSelected(email);

      const payment = new Set<string>();
      if (server.paymentConfirmationEmail) payment.add('paymentConfirmation');
      if (server.failedPaymentsEmail) payment.add('failedPayments');
      if (server.subscriptionRenewalEmail) payment.add('subscriptionRenewal');
      if (server.paymentReminderEmail) payment.add('paymentReminder');
      setPaymentSelected(payment);
    }
  }, [server]);

  const saveSettings = async (overrides: Partial<{
    emailNotificationsEnabled: boolean;
    paymentNotificationsEnabled: boolean;
    emailSelected: Set<string>;
    paymentSelected: Set<string>;
  }> = {}) => {
    const merged = {
      emailNotificationsEnabled,
      paymentNotificationsEnabled,
      emailSelected,
      paymentSelected,
      ...overrides,
    };
    try {
      const res = await updateSettings({
        emailNotificationsEnabled: merged.emailNotificationsEnabled,
        pushNotificationsEnabled: false,
        newMessageEmail: merged.emailSelected.has('newMessage'),
        consultationRequestEmail: merged.emailSelected.has('consultationRequest'),
        platformAnnouncementEmail: merged.emailSelected.has('platformAnnouncement'),
        paymentConfirmationEmail: merged.paymentSelected.has('paymentConfirmation'),
        failedPaymentsEmail: merged.paymentSelected.has('failedPayments'),
        subscriptionRenewalEmail: merged.paymentSelected.has('subscriptionRenewal'),
        paymentReminderEmail: merged.paymentSelected.has('paymentReminder'),
        newMessagePush: false,
        consultationRequestPush: false,
        platformAnnouncementPush: false,
        paymentConfirmationPush: false,
        failedPaymentsPush: false,
        subscriptionRenewalPush: false,
        paymentReminderPush: false,
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

  const toggleEmail = (value: string) => {
    const next = new Set(emailSelected);
    next.has(value) ? next.delete(value) : next.add(value);
    setEmailSelected(next);
    saveSettings({ emailSelected: next });
  };

  const togglePayment = (value: string) => {
    const next = new Set(paymentSelected);
    next.has(value) ? next.delete(value) : next.add(value);
    setPaymentSelected(next);
    saveSettings({ paymentSelected: next });
  };

  return (
    <Flex direction="column" align="flex-start" justify="flex-start" h="full" w="full" className={outfit.className}>
      <Box
        borderRadius="lg"
        boxShadow="lg"
        bg="main_background"
        p={{ base: 4, sm: 6, md: 8, lg: 10, xl: 12 }}
        w="full"
        h="full"
      >
        <HStack justify="space-between" mb={8}>
          <Text color="text_primary" fontSize={{ base: "lg", md: "1.5rem" }} fontWeight="600">
            Notification Settings
          </Text>
          {saving && <Spinner size="sm" />}
        </HStack>
        {(isLoading || isFetching) && (
          <HStack py={4}><Spinner size="sm" /><Text>Loading...</Text></HStack>
        )}

        {/* Email Notification */}
        <Box mb={12}>
          <Switch.Root
            w="full"
            alignItems="flex-start"
            justifyContent="space-between"
            checked={emailNotificationsEnabled}
            onCheckedChange={(e) => {
              const val = !!(e as any).checked;
              setEmailNotificationsEnabled(val);
              saveSettings({ emailNotificationsEnabled: val });
            }}
          >
            <Switch.Label
              font="outfit"
              fontSize={{ base: "1rem", md: "1.5rem", lg: "1.3rem" }}
              fontWeight="600"
              color="text_primary"
              lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px" }}
            >
              Email Notification
            </Switch.Label>
            <Switch.HiddenInput />
            <Switch.Control />
          </Switch.Root>

          <Text
            font="outfit"
            fontSize={{ base: "1rem", sm: "1.1rem", md: "1.1rem", lg: "1.2rem" }}
            fontWeight="400"
            color="grey.300"
            mt={2}
            mb={4}
          >
            Receive updates via email for messages, requests, announcements, and payments.
          </Text>

          <Box
            opacity={emailNotificationsEnabled ? 1 : 0.4}
            pointerEvents={emailNotificationsEnabled ? "auto" : "none"}
          >
            <VStack w="full" alignItems="flex-start" gapY={7} justifyContent="flex-start">
              {[
                { label: 'New message', value: 'newMessage' },
                { label: 'Consultation request', value: 'consultationRequest' },
                { label: 'Platform announcement', value: 'platformAnnouncement' },
              ].map((item) => (
                <HStack
                  key={item.value}
                  w="full"
                  justifyContent="space-between"
                  cursor="pointer"
                  onClick={() => toggleEmail(item.value)}
                >
                  <Text
                    color="text_primary"
                    fontSize={{ base: "1rem", sm: "1.1rem", md: "1.1rem" }}
                    fontWeight="400"
                  >
                    {item.label}
                  </Text>
                  <Box
                    boxSize={5}
                    borderRadius="sm"
                    borderWidth={2}
                    borderColor={emailSelected.has(item.value) ? "text_primary" : "gray.300"}
                    bg={emailSelected.has(item.value) ? "text_primary" : "transparent"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    {emailSelected.has(item.value) && (
                      <Icon color="white" boxSize={3}>
                        <Check />
                      </Icon>
                    )}
                  </Box>
                </HStack>
              ))}
            </VStack>
          </Box>
        </Box>

        {/* Payment Notification */}
        <Box mb={12}>
          <Switch.Root
            w="full"
            alignItems="flex-start"
            justifyContent="space-between"
            checked={paymentNotificationsEnabled}
            onCheckedChange={(e) => {
              const val = !!(e as any).checked;
              setPaymentNotificationsEnabled(val);
              saveSettings({ paymentNotificationsEnabled: val });
            }}
          >
            <Switch.Label
              font="outfit"
              fontSize={{ base: "1rem", md: "1.5rem", lg: "1.3rem" }}
              fontWeight="600"
              color="text_primary"
              lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px" }}
            >
              Payment Notification
            </Switch.Label>
            <Switch.HiddenInput />
            <Switch.Control />
          </Switch.Root>

          <Box
            opacity={paymentNotificationsEnabled ? 1 : 0.4}
            pointerEvents={paymentNotificationsEnabled ? "auto" : "none"}
            mt={4}
          >
            <VStack w="full" alignItems="flex-start" gapY={7} justifyContent="flex-start">
              {[
                { label: 'Payment Confirmation', value: 'paymentConfirmation' },
                { label: 'Failed Payment', value: 'failedPayments' },
                { label: 'Subscription renewal', value: 'subscriptionRenewal' },
                { label: 'Payment Reminder', value: 'paymentReminder' },
              ].map((item) => (
                <HStack
                  key={item.value}
                  w="full"
                  justifyContent="space-between"
                  cursor="pointer"
                  onClick={() => togglePayment(item.value)}
                >
                  <Text
                    color="text_primary"
                    fontSize={{ base: "1rem", sm: "1.1rem", md: "1.1rem" }}
                    fontWeight="400"
                  >
                    {item.label}
                  </Text>
                  <Box
                    boxSize={5}
                    borderRadius="sm"
                    borderWidth={2}
                    borderColor={paymentSelected.has(item.value) ? "text_primary" : "gray.300"}
                    bg={paymentSelected.has(item.value) ? "text_primary" : "transparent"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    {paymentSelected.has(item.value) && (
                      <Icon color="white" boxSize={3}>
                        <Check />
                      </Icon>
                    )}
                  </Box>
                </HStack>
              ))}
            </VStack>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default NotificationSetting;
