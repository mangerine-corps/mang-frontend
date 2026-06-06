"use client";
import {
  Box,
  Button,
  HStack,
  Input,
  Stack,
  Switch,
  Text,
  VStack,
  Spinner,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import PhoneInputWithCode from "../customcomponents/PhoneInputWithCode";
import { useState } from "react";
import OTPInput from "react-otp-input";
import { size } from "es-toolkit/compat";
import { QRCodeSVG } from "qrcode.react";
import { Checkbox } from "../ui/checkbox";
import { PaginatedTable } from "../customcomponents/table";
import { outfit } from "mangarine/pages/_app";
import { useAuth } from "mangarine/state/hooks/user.hook";
import {
  useEnableEmail2FAMutation,
  useEnablePhone2FAMutation,
  useVerifyOtpMutation,
  useSetupApp2FAMutation,
  useEnableApp2FAMutation,
  useDeactivateApp2FAMutation,
  useGet2FASettingsQuery,
  useDisableEmail2FAMutation,
  useDisablePhone2FAMutation,
  useUpdateTwoFactorAuthSettingsMutation,
} from "mangarine/state/services/settings.service";
import { toaster } from "../ui/toaster";
import { Copy, Check } from "lucide-react";

type TfaStep = "idle" | "input" | "otp" | "active";
type AppStep = "idle" | "setup" | "active" | "deactivating";

// ── OTP input shared renderer ─────────────────────────────────────────────────
const OtpBoxes = ({
  otp,
  onChange,
}: {
  otp: string;
  onChange: (v: string) => void;
}) => (
  <OTPInput
    value={otp}
    onChange={(v) => onChange(v.replace(/[^0-9]/g, ""))}
    numInputs={6}
    inputType="number"
    placeholder="000000"
    renderInput={(props, index) => (
      <Input
        bg="main_background"
        borderWidth={1}
        borderRadius="6px"
        fontSize={{ base: "14px", lg: "18px" }}
        fontWeight="500"
        minH={{ base: "44px", lg: "52px" }}
        minW={{ base: "44px", lg: "52px" }}
        color="text_primary"
        borderColor={size(otp) > index ? "primary.200" : "gray.200"}
        focusRingColor="primary.200"
        css={{
          "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
            WebkitAppearance: "none",
            margin: 0,
          },
          "&[type=number]": { MozAppearance: "textfield" },
        }}
        {...props}
      />
    )}
    renderSeparator={<span style={{ width: "6px" }} />}
    containerStyle={{
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "4px",
    }}
  />
);

const PrimaryButton = ({
  onClick,
  loading,
  disabled,
  children,
}: {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <Button
    bg="#111D4A"
    color="white"
    rounded="md"
    px={6}
    py={2}
    fontSize="0.875rem"
    fontWeight="500"
    loading={loading}
    onClick={onClick}
    _hover={{ bg: "#1a2a6c" }}
    alignSelf="flex-start"
    disabled={disabled}
  >
    {children}
  </Button>
);

// ── TfaSwitches ───────────────────────────────────────────────────────────────
interface SwitchValues {
  login: boolean;
  paymentConfirmation: boolean;
  accountSettingsChange: boolean;
  consultationBooking: boolean;
}

const TfaSwitches = ({
  enableEmail2FA,
  enablePhone2FA,
  enableApp2FA,
}: {
  enableEmail2FA: boolean;
  enablePhone2FA: boolean;
  enableApp2FA: boolean;
}) => {
  const [values, setValues] = useState<SwitchValues>({
    login: false,
    paymentConfirmation: false,
    accountSettingsChange: false,
    consultationBooking: false,
  });
  const [updateSettings, { isLoading }] = useUpdateTwoFactorAuthSettingsMutation();

  const handleToggle = async (key: keyof SwitchValues, val: boolean) => {
    const next = { ...values, [key]: val };
    setValues(next);
    try {
      await updateSettings({
        updateDto: {
          enableEmail2FA,
          enablePhone2FA,
          enableApp2FA,
          ...next,
        },
      }).unwrap();
    } catch {
      setValues(values);
    }
  };

  const items: { label: string; key: keyof SwitchValues }[] = [
    { label: "Log in", key: "login" },
    { label: "Payment Confirmation", key: "paymentConfirmation" },
    { label: "Account Settings change", key: "accountSettingsChange" },
    { label: "Consultation Booking", key: "consultationBooking" },
  ];

  return (
    <VStack justifyContent="space-between" alignItems="center" w="full" pb={6} gap={3}>
      {items.map(({ label, key }) => (
        <Switch.Root
          key={key}
          w="full"
          alignItems="flex-start"
          justifyContent="space-between"
          checked={values[key]}
          onCheckedChange={(e) => handleToggle(key, e.checked)}
          disabled={isLoading}
        >
          <Switch.Label font="outfit" fontSize="1.1rem" fontWeight="400" color="text_primary">
            {label}
          </Switch.Label>
          <Switch.HiddenInput />
          <Switch.Control />
        </Switch.Root>
      ))}
    </VStack>
  );
};

// ── Email 2FA ─────────────────────────────────────────────────────────────────
const EmailTfa = ({
  initialActive,
  enablePhone2FA,
  enableApp2FA,
}: {
  initialActive: boolean;
  enablePhone2FA: boolean;
  enableApp2FA: boolean;
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<TfaStep>(initialActive ? "active" : "idle");
  const [email, setEmail] = useState(user?.email ?? "");
  const [otp, setOtp] = useState("");

  const [enableEmail2FA, { isLoading: sending }] = useEnableEmail2FAMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [disableEmail2FA, { isLoading: disabling }] = useDisableEmail2FAMutation();

  const sendCode = async () => {
    try {
      await enableEmail2FA(undefined).unwrap();
      toaster.create({
        title: "Code sent",
        description: `A verification code was sent to ${email}`,
        type: "success",
        duration: 6000,
        closable: true,
      });
      setStep("otp");
    } catch (err: any) {
      toaster.create({
        title: "Failed to send code",
        description: err?.data?.message ?? "Please try again.",
        type: "error",
        duration: 6000,
        closable: true,
      });
    }
  };

  const verify = async () => {
    try {
      await verifyOtp({ otp }).unwrap();
      toaster.create({ title: "Email 2FA enabled", type: "success", duration: 4000, closable: true });
      setStep("active");
    } catch (err: any) {
      toaster.create({
        title: "Invalid code",
        description: err?.data?.message ?? "Check the code and try again.",
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  };

  const deactivate = async () => {
    try {
      await disableEmail2FA(undefined).unwrap();
      toaster.create({ title: "Email 2FA disabled", type: "success", duration: 4000, closable: true });
      setStep("idle");
      setOtp("");
    } catch (err: any) {
      toaster.create({
        title: "Failed to disable",
        description: err?.data?.message ?? "Please try again.",
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  };

  return (
    <>
      <HStack justifyContent="space-between" alignItems="center" w="full" py={10}>
        <VStack alignItems="flex-start">
          <Text fontSize="1.2rem" fontWeight="600" color="text_primary">Email Address</Text>
          <Text fontSize="1rem" fontWeight="400" color="grey.500">
            Add an extra layer of protection with a secure code sent directly to your email.
          </Text>
        </VStack>
        {step === "idle" ? (
          <Text cursor="pointer" onClick={() => setStep("input")} fontSize="1.1rem" fontWeight="600" color="text_primary" whiteSpace="nowrap">
            Activate
          </Text>
        ) : (
          <Text cursor="pointer" onClick={deactivate} fontSize="1.1rem" fontWeight="600" color="red.500" whiteSpace="nowrap">
            {disabling ? "Disabling…" : "Deactivate"}
          </Text>
        )}
      </HStack>

      {step === "input" && (
        <Stack borderWidth="1px" borderColor="grey.100" py={4} px={4} mb={6} rounded="8px" gap={4}>
          <Text fontSize="1rem" fontWeight="600" color="text_primary">Verify your email address</Text>
          <Text fontSize="0.875rem" color="grey.500">
            We will send a one-time code to the email below to confirm it belongs to you.
          </Text>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            type="email"
            borderWidth={1}
            borderColor="gray.200"
            rounded="md"
            px={3}
            py={2}
            fontSize="0.9rem"
            color="text_primary"
            bg="main_background"
          />
          <PrimaryButton loading={sending} onClick={sendCode}>
            Send Verification Code
          </PrimaryButton>
        </Stack>
      )}

      {step === "otp" && (
        <Stack borderWidth="1px" borderColor="grey.100" py={4} px={4} mb={6} rounded="8px" gap={4}>
          <Text fontSize="1rem" fontWeight="600" color="text_primary">Enter verification code</Text>
          <Text fontSize="0.875rem" color="grey.500">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </Text>
          <OtpBoxes otp={otp} onChange={setOtp} />
          <HStack gap={3}>
            <PrimaryButton loading={verifying} onClick={verify} disabled={otp.length !== 6}>
              Verify Code
            </PrimaryButton>
            <Button variant="ghost" onClick={() => setStep("input")} fontSize="0.875rem" color="grey.500">
              Resend
            </Button>
          </HStack>
        </Stack>
      )}

      {step === "active" && (
        <Stack borderWidth="1px" borderColor="grey.100" py={3} px={3} mb={6} rounded="8px" gap={0}>
          <HStack justifyContent="space-between" alignItems="center" w="full" pb={2} mb={4} borderBottomWidth="1px" borderBottomColor="grey.100">
            <VStack alignItems="flex-start">
              <Text fontSize="1.1rem" fontWeight="600" color="text_primary">2FA Setup</Text>
              <Text fontSize="0.875rem" fontWeight="400" color="grey.500">Choose when to require a code</Text>
            </VStack>
            <Text fontSize="0.875rem" fontWeight="600" color="green.500">Active</Text>
          </HStack>
          <TfaSwitches enableEmail2FA={true} enablePhone2FA={enablePhone2FA} enableApp2FA={enableApp2FA} />
        </Stack>
      )}
    </>
  );
};

// ── Phone 2FA ─────────────────────────────────────────────────────────────────
const PhoneTfa = ({
  initialActive,
  enableEmail2FA,
  enableApp2FA,
}: {
  initialActive: boolean;
  enableEmail2FA: boolean;
  enableApp2FA: boolean;
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<TfaStep>(initialActive ? "active" : "idle");
  const [phone, setPhone] = useState(
    ((user as any)?.phoneNumber ?? (user as any)?.mobileNumber ?? "").replace(/\D/g, "")
  );
  const [otp, setOtp] = useState("");

  const [enablePhone2FA, { isLoading: sending }] = useEnablePhone2FAMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [disablePhone2FA, { isLoading: disabling }] = useDisablePhone2FAMutation();

  const sendCode = async () => {
    try {
      await enablePhone2FA(undefined).unwrap();
      toaster.create({
        title: "Code sent",
        description: `A verification code was sent to ${phone}`,
        type: "success",
        duration: 6000,
        closable: true,
      });
      setStep("otp");
    } catch (err: any) {
      toaster.create({
        title: "Failed to send code",
        description: err?.data?.message ?? "Please try again.",
        type: "error",
        duration: 6000,
        closable: true,
      });
    }
  };

  const verify = async () => {
    try {
      await verifyOtp({ otp }).unwrap();
      toaster.create({ title: "Phone 2FA enabled", type: "success", duration: 4000, closable: true });
      setStep("active");
    } catch (err: any) {
      toaster.create({
        title: "Invalid code",
        description: err?.data?.message ?? "Check the code and try again.",
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  };

  const deactivate = async () => {
    try {
      await disablePhone2FA(undefined).unwrap();
      toaster.create({ title: "Phone 2FA disabled", type: "success", duration: 4000, closable: true });
      setStep("idle");
      setOtp("");
    } catch (err: any) {
      toaster.create({
        title: "Failed to disable",
        description: err?.data?.message ?? "Please try again.",
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  };

  return (
    <>
      <HStack justifyContent="space-between" alignItems="center" w="full" pb={10}>
        <VStack alignItems="flex-start">
          <Text fontSize="1.2rem" fontWeight="600" color="text_primary">Phone Number</Text>
          <Text fontSize="1rem" fontWeight="400" color="grey.500">
            Add an extra layer of protection with a secure code sent directly to your phone.
          </Text>
        </VStack>
        {step === "idle" ? (
          <Text cursor="pointer" onClick={() => setStep("input")} fontSize="1.1rem" fontWeight="600" color="text_primary" whiteSpace="nowrap">
            Activate
          </Text>
        ) : (
          <Text cursor="pointer" onClick={deactivate} fontSize="1.1rem" fontWeight="600" color="red.500" whiteSpace="nowrap">
            {disabling ? "Disabling…" : "Deactivate"}
          </Text>
        )}
      </HStack>

      {step === "input" && (
        <Stack borderWidth="1px" borderColor="grey.100" py={4} px={4} mb={6} rounded="8px" gap={4}>
          <Text fontSize="1rem" fontWeight="600" color="text_primary">Verify your phone number</Text>
          <Text fontSize="0.875rem" color="grey.500">
            We will send a one-time code via SMS to the number below.
          </Text>
          <PhoneInputWithCode
            value={phone}
            onChange={setPhone}
            placeholder="8012345678"
          />
          <PrimaryButton loading={sending} onClick={sendCode}>
            Send Verification Code
          </PrimaryButton>
        </Stack>
      )}

      {step === "otp" && (
        <Stack borderWidth="1px" borderColor="grey.100" py={4} px={4} mb={6} rounded="8px" gap={4}>
          <Text fontSize="1rem" fontWeight="600" color="text_primary">Enter verification code</Text>
          <Text fontSize="0.875rem" color="grey.500">
            Enter the 6-digit code sent to <strong>{phone}</strong>
          </Text>
          <OtpBoxes otp={otp} onChange={setOtp} />
          <HStack gap={3}>
            <PrimaryButton loading={verifying} onClick={verify} disabled={otp.length !== 6}>
              Verify Code
            </PrimaryButton>
            <Button variant="ghost" onClick={() => setStep("input")} fontSize="0.875rem" color="grey.500">
              Resend
            </Button>
          </HStack>
        </Stack>
      )}

      {step === "active" && (
        <Stack borderWidth="1px" borderColor="grey.100" py={3} px={3} mb={6} rounded="8px" gap={0}>
          <HStack justifyContent="space-between" alignItems="center" w="full" pb={2} mb={4} borderBottomWidth="1px" borderBottomColor="grey.100">
            <VStack alignItems="flex-start">
              <Text fontSize="1.1rem" fontWeight="600" color="text_primary">2FA Setup</Text>
              <Text fontSize="0.875rem" fontWeight="400" color="grey.500">Choose when to require a code</Text>
            </VStack>
            <Text fontSize="0.875rem" fontWeight="600" color="green.500">Active</Text>
          </HStack>
          <TfaSwitches enableEmail2FA={enableEmail2FA} enablePhone2FA={true} enableApp2FA={enableApp2FA} />
        </Stack>
      )}
    </>
  );
};

// ── Auth App 2FA ──────────────────────────────────────────────────────────────
const AuthAppTfa = ({
  initialActive,
  enableEmail2FA,
  enablePhone2FA,
}: {
  initialActive: boolean;
  enableEmail2FA: boolean;
  enablePhone2FA: boolean;
}) => {
  const [step, setStep] = useState<AppStep>(initialActive ? "active" : "idle");
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [otp, setOtp] = useState("");
  const [copied, setCopied] = useState(false);

  const [setupApp2FA, { isLoading: settingUp }] = useSetupApp2FAMutation();
  const [enableApp2FA, { isLoading: enabling }] = useEnableApp2FAMutation();
  const [deactivateApp2FA, { isLoading: deactivating }] = useDeactivateApp2FAMutation();

  const handleSetup = async () => {
    try {
      const result = await setupApp2FA(undefined).unwrap();
      setOtpauthUrl((result as any).otpauthUrl ?? "");
      setSecret((result as any).secret ?? "");
      setStep("setup");
    } catch {
      toaster.create({
        title: "Setup failed",
        description: "Could not initiate app 2FA setup.",
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  };

  const handleEnable = async () => {
    try {
      await enableApp2FA({ otp }).unwrap();
      toaster.create({ title: "Authenticator app 2FA enabled", type: "success", duration: 4000, closable: true });
      setStep("active");
      setOtp("");
    } catch (err: any) {
      toaster.create({
        title: "Invalid code",
        description: err?.data?.message ?? "Check the code and try again.",
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateApp2FA({ otp }).unwrap();
      toaster.create({ title: "App 2FA disabled", type: "success", duration: 4000, closable: true });
      setStep("idle");
      setOtp("");
    } catch (err: any) {
      toaster.create({
        title: "Failed to disable",
        description: err?.data?.message ?? "Check the code and try again.",
        type: "error",
        duration: 4000,
        closable: true,
      });
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <HStack justifyContent="space-between" alignItems="center" w="full" pb={10}>
        <VStack alignItems="flex-start">
          <Text fontSize="1.2rem" fontWeight="600" color="text_primary">Authentication App</Text>
          <Text fontSize="1rem" fontWeight="400" color="grey.500">
            Use an authenticator app like Google Authenticator or Authy to generate codes.
          </Text>
        </VStack>
        {step === "idle" && (
          <Text cursor="pointer" onClick={handleSetup} fontSize="1.1rem" fontWeight="600" color="text_primary" whiteSpace="nowrap">
            {settingUp ? "Setting up…" : "Activate"}
          </Text>
        )}
        {step === "setup" && (
          <Text cursor="pointer" onClick={() => { setStep("idle"); setOtp(""); }} fontSize="1.1rem" fontWeight="600" color="red.500" whiteSpace="nowrap">
            Cancel
          </Text>
        )}
        {step === "active" && (
          <Text cursor="pointer" onClick={() => { setStep("deactivating"); setOtp(""); }} fontSize="1.1rem" fontWeight="600" color="red.500" whiteSpace="nowrap">
            Deactivate
          </Text>
        )}
        {step === "deactivating" && (
          <Text cursor="pointer" onClick={() => setStep("active")} fontSize="1.1rem" fontWeight="600" color="grey.500" whiteSpace="nowrap">
            Cancel
          </Text>
        )}
      </HStack>

      {step === "setup" && (
        <Stack borderWidth="1px" borderColor="grey.100" py={4} px={4} mb={6} rounded="8px" gap={4}>
          <Text fontSize="1rem" fontWeight="600" color="text_primary">
            Scan the QR code with your authenticator app
          </Text>
          <Text fontSize="0.875rem" color="grey.500">
            Use Google Authenticator, Authy, or any TOTP app to scan the code below.
          </Text>

          <HStack gap={6} alignItems="flex-start" flexWrap="wrap">
            {otpauthUrl && <QRCodeSVG value={otpauthUrl} size={140} />}
            <VStack alignItems="flex-start" gap={2} flex={1} minW="180px">
              <Text fontSize="0.875rem" color="grey.500">
                Can&apos;t scan? Enter this key manually in your app:
              </Text>
              <HStack
                bg="grey.50"
                _dark={{ bg: "mainBlack.950" }}
                borderWidth={1}
                borderColor="grey.100"
                rounded="md"
                px={3}
                py={2}
                gap={2}
                w="full"
              >
                <Text fontSize="0.8rem" fontFamily="mono" color="text_primary" flex={1} wordBreak="break-all">
                  {secret}
                </Text>
                <IconButton
                  size="xs"
                  variant="ghost"
                  onClick={copySecret}
                  aria-label="Copy secret"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </IconButton>
              </HStack>
            </VStack>
          </HStack>

          <Text fontSize="1rem" fontWeight="500" color="text_primary">
            Enter the 6-digit code from your app to confirm setup
          </Text>
          <OtpBoxes otp={otp} onChange={setOtp} />
          <PrimaryButton loading={enabling} onClick={handleEnable} disabled={otp.length !== 6}>
            Enable 2FA
          </PrimaryButton>
        </Stack>
      )}

      {step === "active" && (
        <Stack borderWidth="1px" borderColor="grey.100" py={3} px={3} mb={6} rounded="8px" gap={0}>
          <HStack justifyContent="space-between" alignItems="center" w="full" pb={2} mb={4} borderBottomWidth="1px" borderBottomColor="grey.100">
            <VStack alignItems="flex-start">
              <Text fontSize="1.1rem" fontWeight="600" color="text_primary">2FA Setup</Text>
              <Text fontSize="0.875rem" fontWeight="400" color="grey.500">Choose when to require a code</Text>
            </VStack>
            <Text fontSize="0.875rem" fontWeight="600" color="green.500">Active</Text>
          </HStack>
          <TfaSwitches enableEmail2FA={enableEmail2FA} enablePhone2FA={enablePhone2FA} enableApp2FA={true} />
        </Stack>
      )}

      {step === "deactivating" && (
        <Stack borderWidth="1px" borderColor="red.100" py={4} px={4} mb={6} rounded="8px" gap={4}>
          <Text fontSize="1rem" fontWeight="600" color="text_primary">Confirm deactivation</Text>
          <Text fontSize="0.875rem" color="grey.500">
            Enter the current 6-digit code from your authenticator app to confirm.
          </Text>
          <OtpBoxes otp={otp} onChange={setOtp} />
          <HStack gap={3}>
            <Button
              bg="red.500"
              color="white"
              rounded="md"
              px={6}
              py={2}
              fontSize="0.875rem"
              fontWeight="500"
              loading={deactivating}
              onClick={handleDeactivate}
              disabled={otp.length !== 6}
              _hover={{ bg: "red.600" }}
              alignSelf="flex-start"
            >
              Confirm Deactivate
            </Button>
          </HStack>
        </Stack>
      )}
    </>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const SecuritySetting = () => {
  const { data: twoFAStatus, isLoading } = useGet2FASettingsQuery();

  const settings = (twoFAStatus as any)?.data?.settings ?? {};
  const enableEmail2FA = settings.enableEmail2FA ?? false;
  const enablePhone2FA = settings.enablePhone2FA ?? false;
  const enableApp2FA = settings.enableApp2FA ?? false;

  return (
    <Flex direction="column" h="full" w="full" className={outfit.className}>
    <Box
      w="full"
      h="full"
      p={{ base: 4, sm: 6, md: 8, lg: 10, xl: 12 }}
      borderRadius="lg"
      boxShadow="lg"
      bg="bg_box"
      className={outfit.className}
    >
      <Text fontSize={{ base: "1rem", md: "1.5rem" }} fontWeight="600" color="text_primary">
        Two-Factor Authentication (2FA)
      </Text>
      <Text fontSize="1rem" fontWeight="400" color="grey.500" mt={1}>
        Enhance your account security by setting up 2FA. Protect your information with an additional layer of defense.
      </Text>

      {isLoading ? (
        <Flex justify="center" py={10}>
          <Spinner color="grey.400" />
        </Flex>
      ) : (
        <>
          <EmailTfa initialActive={enableEmail2FA} enablePhone2FA={enablePhone2FA} enableApp2FA={enableApp2FA} />
          <PhoneTfa initialActive={enablePhone2FA} enableEmail2FA={enableEmail2FA} enableApp2FA={enableApp2FA} />
          <AuthAppTfa initialActive={enableApp2FA} enableEmail2FA={enableEmail2FA} enablePhone2FA={enablePhone2FA} />
        </>
      )}

      <Box w="full" py={10}>
        <Text fontSize={{ base: "1rem", md: "1.5rem" }} fontWeight="600" color="text_primary" mb={4}>
          Login Activities
        </Text>
        <PaginatedTable />
      </Box>
    </Box>
    </Flex>
  );
};

export default SecuritySetting;
