import { Box, Flex, Switch, Text, VStack, HStack, Button, Spinner } from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";
import { useEffect, useMemo, useState } from "react";
import { useGetNotificationSettingsQuery, useUpdateNotificationSettingsMutation } from "mangarine/state/services/settings.service";
import { toaster } from "../ui/toaster";

const NotificationSetting = () => {
  const { data, isLoading, isFetching, refetch } = useGetNotificationSettingsQuery({});
  const [updateSettings, { isLoading: saving }] = useUpdateNotificationSettingsMutation();
  const server = useMemo(() => (data as any) || {}, [data]);

  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState<boolean>(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState<boolean>(true);
  const [newMessageEmail, setNewMessageEmail] = useState<boolean>(false);
  const [consultationRequestEmail, setConsultationRequestEmail] = useState<boolean>(false);
  const [platformAnnouncementEmail, setPlatformAnnouncementEmail] = useState<boolean>(false);
  const [paymentConfirmationEmail, setPaymentConfirmationEmail] = useState<boolean>(false);
  const [failedPaymentsEmail, setFailedPaymentsEmail] = useState<boolean>(false);
  const [subscriptionRenewalEmail, setSubscriptionRenewalEmail] = useState<boolean>(false);
  const [paymentReminderEmail, setPaymentReminderEmail] = useState<boolean>(false);

  const [newMessagePush, setNewMessagePush] = useState<boolean>(false);
  const [consultationRequestPush, setConsultationRequestPush] = useState<boolean>(false);
  const [platformAnnouncementPush, setPlatformAnnouncementPush] = useState<boolean>(false);
  const [paymentConfirmationPush, setPaymentConfirmationPush] = useState<boolean>(false);
  const [failedPaymentsPush, setFailedPaymentsPush] = useState<boolean>(false);
  const [subscriptionRenewalPush, setSubscriptionRenewalPush] = useState<boolean>(false);
  const [paymentReminderPush, setPaymentReminderPush] = useState<boolean>(false);

  useEffect(() => {
    if (server && server.id) {
      setEmailNotificationsEnabled(!!server.emailNotificationsEnabled);
      setPushNotificationsEnabled(!!server.pushNotificationsEnabled);
      setNewMessageEmail(!!server.newMessageEmail);
      setConsultationRequestEmail(!!server.consultationRequestEmail);
      setPlatformAnnouncementEmail(!!server.platformAnnouncementEmail);
      setPaymentConfirmationEmail(!!server.paymentConfirmationEmail);
      setFailedPaymentsEmail(!!server.failedPaymentsEmail);
      setSubscriptionRenewalEmail(!!server.subscriptionRenewalEmail);
      setPaymentReminderEmail(!!server.paymentReminderEmail);
      setNewMessagePush(!!server.newMessagePush);
      setConsultationRequestPush(!!server.consultationRequestPush);
      setPlatformAnnouncementPush(!!server.platformAnnouncementPush);
      setPaymentConfirmationPush(!!server.paymentConfirmationPush);
      setFailedPaymentsPush(!!server.failedPaymentsPush);
      setSubscriptionRenewalPush(!!server.subscriptionRenewalPush);
      setPaymentReminderPush(!!server.paymentReminderPush);
    }
  }, [server]);

const onSave = async () => {
  try {
    const res = await updateSettings({
      emailNotificationsEnabled,
      pushNotificationsEnabled,
      newMessageEmail,
      consultationRequestEmail,
      platformAnnouncementEmail,
      paymentConfirmationEmail,
      failedPaymentsEmail,
      subscriptionRenewalEmail,
      paymentReminderEmail,
      newMessagePush,
      consultationRequestPush,
      platformAnnouncementPush,
      paymentConfirmationPush,
      failedPaymentsPush,
      subscriptionRenewalPush,
      paymentReminderPush,
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
      h="auto"
      // minH="1"
      className={outfit.className}
    >
      <Box
        //w={{ base: "95%", md: "280px", lg: "340px", xl: "340px" }}

        borderRadius="lg"
        boxShadow="lg"
        bg="main_background"
        p={{ base: 4, sm: 6, md: 8, lg: 10, xl: 12 }}
        w="full"

        mt={0}
      >
        <HStack justify="space-between" mb={8}>
          <Text color="text_primary" fontSize={{ base: "lg", md: "1.5rem" }} fontWeight="600">Notification Settings</Text>

        </HStack>
        {(isLoading || isFetching) && (
          <HStack py={4}><Spinner size="sm" /><Text>Loading...</Text></HStack>
        )}
        <Box mb={12}>
          <Switch.Root
            w="full"
            alignItems={"flex-start"}
            justifyContent={"space-between"}
            checked={emailNotificationsEnabled}
            onCheckedChange={(e) => setEmailNotificationsEnabled(!!(e as any).checked)}
          >
            <Switch.Label
              font="outfit"
              fontSize={{ base: "1rem", md: "1.5rem", lg: "1.3rem" }}
              fontWeight="600"
              color="text_primary"
              lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px", }}
            >
              Email Notification
            </Switch.Label>
            <Switch.HiddenInput />
            <Switch.Control />
          </Switch.Root>

          <Text
            font="outfit"
            fontSize={{ base: "0.875rem", sm: "1rem", md: "1rem", lg: "1.125rem", }}
            fontWeight="400"
            color="grey.300"
            // lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
            mb="4"
          >
            Receive updates via email for messages, requests, announcements, and
            payments.
          </Text>
          <VStack w="full" alignItems={"flex-start"} gapY={7} justifyContent={"flex-start"} my="4">
            {[{
              label: 'New message', checked: newMessageEmail, onChange: setNewMessageEmail
            }, {
              label: 'Consultation request', checked: consultationRequestEmail, onChange: setConsultationRequestEmail
            }, {
              label: 'Platform announcement', checked: platformAnnouncementEmail, onChange: setPlatformAnnouncementEmail
            }].map((row, idx) => (
              <Switch.Root key={idx} w="full" alignItems={"flex-start"} justifyContent={"space-between"} checked={row.checked} onCheckedChange={(e) => row.onChange(!!(e as any).checked)}>
                <Switch.Label color={"text_primary"} fontSize={{ base: "0.875rem", sm: "1rem", lg: "1rem" }} fontWeight={"400"}>
                  {row.label}
                </Switch.Label>
                <Switch.HiddenInput />
                <Switch.Control />
              </Switch.Root>
            ))}
          </VStack>
        </Box>

        <Box mb={12}>
          <Text
            font="outfit"
            fontSize={{ base: "1rem", md: "1.5rem", lg: "1.3rem" }}
            fontWeight="600"
            color="text_primary"
            lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px", }}
            mb={4}
          >
            Payment Notification
          </Text>

          <VStack className={outfit.className} w="full" alignItems={"flex-start"} justifyContent={"flex-start"} gapY={7} my="4">
            {[{
              label: 'Payment Confirmation', checked: paymentConfirmationEmail, onChange: setPaymentConfirmationEmail
            }, {
              label: 'Failed Payment', checked: failedPaymentsEmail, onChange: setFailedPaymentsEmail
            }, {
              label: 'Subscription renewal', checked: subscriptionRenewalEmail, onChange: setSubscriptionRenewalEmail
            }, {
              label: 'Payment Reminder', checked: paymentReminderEmail, onChange: setPaymentReminderEmail
            }].map((row, idx) => (
              <Switch.Root key={idx} w="full" alignItems={"flex-start"} justifyContent={"space-between"} checked={row.checked} onCheckedChange={(e) => row.onChange(!!(e as any).checked)}>
                <Switch.Label color={"text_primary"} fontSize={{ base: "0.875rem", sm: "1rem", lg: "1rem" }} fontWeight={"400"}>
                  {row.label}
                </Switch.Label>
                <Switch.HiddenInput />
                <Switch.Control />
              </Switch.Root>
            ))}
          </VStack>
        </Box>
        {/* <Box mb={12}>
          <Switch.Root
            w="full"
            alignItems={"flex-start"}
            justifyContent={"space-between"}
            checked={pushNotificationsEnabled}
            onCheckedChange={(e) => setPushNotificationsEnabled(!!(e as any).checked)}
          >
            <Switch.Label
              font="outfit"
              fontSize={{ base: "1rem", lg: "1.3rem" }}
              fontWeight="600"
              color="text_primary"
              lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px", }}
            >
              Push Notification
            </Switch.Label>
            <Switch.HiddenInput />
            <Switch.Control />
          </Switch.Root>

          <Text
            font="outfit"
            fontSize={{ base: "0.875rem", sm: "1rem", md: "1rem", lg: "1.125rem", }}
            fontWeight="400"
            color="grey.300"
            // lineHeight={{ base: "20px", sm: "24px", md: "28px", lg: "32px", xl: "36px",}}
            mb="4"
          >
            Receive updates via email for messages, requests, announcements, and
            payments.
          </Text>
          <VStack w="full" alignItems={"flex-start"} gapY={7} justifyContent={"flex-start"} my="4">
            {[{
              label: 'New message', checked: newMessagePush, onChange: setNewMessagePush
            }, {
              label: 'Consultation request', checked: consultationRequestPush, onChange: setConsultationRequestPush
            }, {
              label: 'Platform announcement', checked: platformAnnouncementPush, onChange: setPlatformAnnouncementPush
            }].map((row, idx) => (
              <Switch.Root key={idx} w="full" alignItems={"flex-start"} justifyContent={"space-between"} checked={row.checked} onCheckedChange={(e) => row.onChange(!!(e as any).checked)}>
                <Switch.Label color={"text_primary"} fontSize={{ base: "0.875rem", sm: "1rem", lg: "1rem" }} fontWeight={"400"}>
                  {row.label}
                </Switch.Label>
                <Switch.HiddenInput />
                <Switch.Control />
              </Switch.Root>
            ))}
          </VStack>
        </Box> */}

        <Button size="sm" px={4} colorScheme="blue" onClick={onSave} loading={saving}>Save Changes</Button>
      </Box>
    </Flex>
  );
};

export default NotificationSetting;
