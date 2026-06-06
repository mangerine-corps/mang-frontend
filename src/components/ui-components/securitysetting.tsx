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
  Separator,
} from "@chakra-ui/react";
import PhoneInputWithCode from "../customcomponents/PhoneInputWithCode";
import { useState } from "react";
import OTPInput from "react-otp-input";
import { size } from "es-toolkit/compat";
import { QRCodeSVG } from "qrcode.react";
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

const OtpBoxes = ({ otp, onChange }: { otp: string; onChange: (v: string) => void }) => (
  <OTPInput
    value={otp}
    onChange={(v) => onChange(v.replace(/[^0-9]/g, ""))}
    numInputs={6}
    inputType="number"
    renderInput={(props, index) => (
      <Input
        bg="main_background"
        borderWidth={1}
        borderRadius="6px"
        fontSize={{ base: "14px", lg: "18px" }}
        fontWeight="500"
        minH={{ base: "40px", lg: "48px" }}
        minW={{ base: "40px", lg: "48px" }}
        maxW={{ base: "44px", lg: "52px" }}
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
    renderSeparator={<span style={{ width: "4px" }} />}
    containerStyle={{ display: "flex", flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: "4px" }}
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
    px={5}
    py={2}
    fontSize="0.875rem"
    fontWeight="500"
    loading={loading}
    onClick={onClick}
    _hover={{ bg: "#1a2a6c" }}
    alignSelf={{ base: "stretch", sm: "flex-start" }}
    disabled={disabled}
    w={{ base: "full", sm: "auto" }}
  >
    {children}
  </Button>
);

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
      await updateSettings({ updateDto: { enableEmail2FA, enablePhone2FA, enableApp2FA, ...next } }).unwrap();
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
    <VStack w="full" pb={2} gap={3}>
      {items.map(({ label, key }) => (
        <Switch.Root
          key={key}
          w="full"
          alignItems="center"
          justifyContent="space-between"
          checked={values[key]}
          onCheckedChange={(e) => handleToggle(key, e.checked)}
          disabled={isLoading}
        >
          <Switch.Label fontFamily="Outfit" fontSize={{ base: "0.875rem", md: "1rem" }} fontWeight="400" color="text_primary">
            {label}
          </Switch.Label>
          <Switch.HiddenInput />
          <Switch.Control />
        </Switch.Root>
      ))}
    </VStack>
  );
};

const ActiveBadge = () => (
  <Box px={2} py={0.5} rounded="full" bg="green.50" _dark={{ bg: "green.900" }}>
    <Text fontSize="0.75rem" fontWeight="600" color="green.600">Active</Text>
  </Box>
);

const TfaSection = ({
  title,
  description,
  step,
  onActivate,
  onDeactivate,
  activating,
  disabling,
  children,
}: {
  title: string;
  description: string;
  step: TfaStep | AppStep;
  onActivate: () => void;
  onDeactivate: () => void;
  activating?: boolean;
  disabling?: boolean;
  children?: React.ReactNode;
}) => (
  <Box w="full">
    <Flex
      direction={{ base: "column", sm: "row" }}
      justify="space-between"
      align={{ base: "flex-start", sm: "center" }}
      gap={3}
      py={4}
    >
      <VStack alignItems="flex-start" gap={0.5} flex={1} minW={0}>
        <HStack gap={2} align="center">
          <Text fontSize={{ base: "0.95rem", md: "1.1rem" }} fontWeight="600" color="text_primary">{title}</Text>
          {(step === "active") && <ActiveBadge />}
        </HStack>
        <Text fontSize={{ base: "0.8rem", md: "0.875rem" }} fontWeight="400" color="grey.500" lineHeight="1.5">
          {description}
        </Text>
      </VStack>
      <Box flexShrink={0}>
        {step === "idle" && (
          <Button
            size="sm" variant="outline" borderColor="#111D4A" color="#111D4A"
            rounded="md" fontSize="0.8rem" fontWeight="600"
            onClick={onActivate} loading={activating}
            _hover={{ bg: "#111D4A", color: "white" }}
          >
            Activate
          </Button>
        )}
        {(step === "active" || step === "deactivating") && (
          <Button
            size="sm" variant="outline" borderColor="red.400" color="red.500"
            rounded="md" fontSize="0.8rem" fontWeight="600"
            onClick={onDeactivate} loading={disabling}
            _hover={{ bg: "red.50" }}
          >
            Deactivate
          </Button>
        )}
        {step === "setup" && (
          <Button
            size="sm" variant="ghost" color="grey.500"
            rounded="md" fontSize="0.8rem" fontWeight="600"
            onClick={onDeactivate}
          >
            Cancel
          </Button>
        )}
      </Box>
    </Flex>
    {children}
  </Box>
);

// ── Email 2FA ─────────────────────────────────────────────────────────────────
const EmailTfa = ({ initialActive, enablePhone2FA, enableApp2FA }: { initialActive: boolean; enablePhone2FA: boolean; enableApp2FA: boolean }) => {
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
      toaster.create({ title: "Code sent", description: `A verification code was sent to ${email}`, type: "success", duration: 6000, closable: true });
      setStep("otp");
    } catch (err: any) {
      toaster.create({ title: "Failed to send code", description: err?.data?.message ?? "Please try again.", type: "error", duration: 6000, closable: true });
    }
  };

  const verify = async () => {
    try {
      await verifyOtp({ otp }).unwrap();
      toaster.create({ title: "Email 2FA enabled", type: "success", duration: 4000, closable: true });
      setStep("active");
    } catch (err: any) {
      toaster.create({ title: "Invalid code", description: err?.data?.message ?? "Check the code and try again.", type: "error", duration: 4000, closable: true });
    }
  };

  const deactivate = async () => {
    try {
      await disableEmail2FA(undefined).unwrap();
      toaster.create({ title: "Email 2FA disabled", type: "success", duration: 4000, closable: true });
      setStep("idle");
      setOtp("");
    } catch (err: any) {
      toaster.create({ title: "Failed to disable", description: err?.data?.message ?? "Please try again.", type: "error", duration: 4000, closable: true });
    }
  };

  return (
    <TfaSection
      title="Email Address"
      description="Add an extra layer of protection with a secure code sent directly to your email."
      step={step}
      onActivate={() => setStep("input")}
      onDeactivate={deactivate}
      disabling={disabling}
    >
      {step === "input" && (
        <Stack borderWidth="1px" borderColor="gray.200" p={4} mb={4} rounded="8px" gap={3}>
          <Text fontSize="0.875rem" fontWeight="600" color="text_primary">Verify your email address</Text>
          <Text fontSize="0.8rem" color="grey.500">We will send a one-time code to confirm it belongs to you.</Text>
          <Input
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address" type="email"
            borderWidth={1} borderColor="gray.200" rounded="md"
            px={3} fontSize="0.875rem" color="text_primary" bg="main_background"
          />
          <PrimaryButton loading={sending} onClick={sendCode}>Send Verification Code</PrimaryButton>
        </Stack>
      )}
      {step === "otp" && (
        <Stack borderWidth="1px" borderColor="gray.200" p={4} mb={4} rounded="8px" gap={3}>
          <Text fontSize="0.875rem" fontWeight="600" color="text_primary">Enter verification code</Text>
          <Text fontSize="0.8rem" color="grey.500">Enter the 6-digit code sent to <strong>{email}</strong></Text>
          <OtpBoxes otp={otp} onChange={setOtp} />
          <HStack gap={2} flexWrap="wrap">
            <PrimaryButton loading={verifying} onClick={verify} disabled={otp.length !== 6}>Verify Code</PrimaryButton>
            <Button variant="ghost" onClick={() => setStep("input")} fontSize="0.8rem" color="grey.500">Resend</Button>
          </HStack>
        </Stack>
      )}
      {step === "active" && (
        <Stack borderWidth="1px" borderColor="gray.200" p={4} mb={4} rounded="8px" gap={3}>
          <HStack justify="space-between">
            <Text fontSize="0.875rem" fontWeight="600" color="text_primary">When to require 2FA</Text>
          </HStack>
          <TfaSwitches enableEmail2FA={true} enablePhone2FA={enablePhone2FA} enableApp2FA={enableApp2FA} />
        </Stack>
      )}
    </TfaSection>
  );
};

// ── Phone 2FA ─────────────────────────────────────────────────────────────────
const PhoneTfa = ({ initialActive, enableEmail2FA, enableApp2FA }: { initialActive: boolean; enableEmail2FA: boolean; enableApp2FA: boolean }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<TfaStep>(initialActive ? "active" : "idle");
  const [phone, setPhone] = useState(((user as any)?.phoneNumber ?? (user as any)?.mobileNumber ?? "").replace(/\D/g, ""));
  const [otp, setOtp] = useState("");

  const [enablePhone2FA, { isLoading: sending }] = useEnablePhone2FAMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [disablePhone2FA, { isLoading: disabling }] = useDisablePhone2FAMutation();

  const sendCode = async () => {
    try {
      await enablePhone2FA(undefined).unwrap();
      toaster.create({ title: "Code sent", description: `A verification code was sent to ${phone}`, type: "success", duration: 6000, closable: true });
      setStep("otp");
    } catch (err: any) {
      toaster.create({ title: "Failed to send code", description: err?.data?.message ?? "Please try again.", type: "error", duration: 6000, closable: true });
    }
  };

  const verify = async () => {
    try {
      await verifyOtp({ otp }).unwrap();
      toaster.create({ title: "Phone 2FA enabled", type: "success", duration: 4000, closable: true });
      setStep("active");
    } catch (err: any) {
      toaster.create({ title: "Invalid code", description: err?.data?.message ?? "Check the code and try again.", type: "error", duration: 4000, closable: true });
    }
  };

  const deactivate = async () => {
    try {
      await disablePhone2FA(undefined).unwrap();
      toaster.create({ title: "Phone 2FA disabled", type: "success", duration: 4000, closable: true });
      setStep("idle");
      setOtp("");
    } catch (err: any) {
      toaster.create({ title: "Failed to disable", description: err?.data?.message ?? "Please try again.", type: "error", duration: 4000, closable: true });
    }
  };

  return (
    <TfaSection
      title="Phone Number"
      description="Add an extra layer of protection with a secure code sent directly to your phone."
      step={step}
      onActivate={() => setStep("input")}
      onDeactivate={deactivate}
      disabling={disabling}
    >
      {step === "input" && (
        <Stack borderWidth="1px" borderColor="gray.200" p={4} mb={4} rounded="8px" gap={3}>
          <Text fontSize="0.875rem" fontWeight="600" color="text_primary">Verify your phone number</Text>
          <Text fontSize="0.8rem" color="grey.500">We will send a one-time code via SMS to the number below.</Text>
          <PhoneInputWithCode value={phone} onChange={setPhone} placeholder="8012345678" />
          <PrimaryButton loading={sending} onClick={sendCode}>Send Verification Code</PrimaryButton>
        </Stack>
      )}
      {step === "otp" && (
        <Stack borderWidth="1px" borderColor="gray.200" p={4} mb={4} rounded="8px" gap={3}>
          <Text fontSize="0.875rem" fontWeight="600" color="text_primary">Enter verification code</Text>
          <Text fontSize="0.8rem" color="grey.500">Enter the 6-digit code sent to <strong>{phone}</strong></Text>
          <OtpBoxes otp={otp} onChange={setOtp} />
          <HStack gap={2} flexWrap="wrap">
            <PrimaryButton loading={verifying} onClick={verify} disabled={otp.length !== 6}>Verify Code</PrimaryButton>
            <Button variant="ghost" onClick={() => setStep("input")} fontSize="0.8rem" color="grey.500">Resend</Button>
          </HStack>
        </Stack>
      )}
      {step === "active" && (
        <Stack borderWidth="1px" borderColor="gray.200" p={4} mb={4} rounded="8px" gap={3}>
          <Text fontSize="0.875rem" fontWeight="600" color="text_primary">When to require 2FA</Text>
          <TfaSwitches enableEmail2FA={enableEmail2FA} enablePhone2FA={true} enableApp2FA={enableApp2FA} />
        </Stack>
      )}
    </TfaSection>
  );
};

// ── Auth App 2FA ──────────────────────────────────────────────────────────────
const AuthAppTfa = ({ initialActive, enableEmail2FA, enablePhone2FA }: { initialActive: boolean; enableEmail2FA: boolean; enablePhone2FA: boolean }) => {
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
      toaster.create({ title: "Setup failed", description: "Could not initiate app 2FA setup.", type: "error", duration: 4000, closable: true });
    }
  };

  const handleEnable = async () => {
    try {
      await enableApp2FA({ otp }).unwrap();
      toaster.create({ title: "Authenticator app 2FA enabled", type: "success", duration: 4000, closable: true });
      setStep("active");
      setOtp("");
    } catch (err: any) {
      toaster.create({ title: "Invalid code", description: err?.data?.message ?? "Check the code and try again.", type: "error", duration: 4000, closable: true });
    }
  };

  const handleDeactivate = async () => {
    if (step === "active") { setStep("deactivating"); setOtp(""); return; }
    try {
      await deactivateApp2FA({ otp }).unwrap();
      toaster.create({ title: "App 2FA disabled", type: "success", duration: 4000, closable: true });
      setStep("idle");
      setOtp("");
    } catch (err: any) {
      toaster.create({ title: "Failed to disable", description: err?.data?.message ?? "Check the code and try again.", type: "error", duration: 4000, closable: true });
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TfaSection
      title="Authentication App"
      description="Use an authenticator app like Google Authenticator or Authy to generate codes."
      step={step}
      onActivate={handleSetup}
      onDeactivate={handleDeactivate}
      activating={settingUp}
      disabling={deactivating}
    >
      {step === "setup" && (
        <Stack borderWidth="1px" borderColor="gray.200" p={4} mb={4} rounded="8px" gap={3}>
          <Text fontSize="0.875rem" fontWeight="600" color="text_primary">Scan the QR code with your authenticator app</Text>
          <Text fontSize="0.8rem" color="grey.500">Use Google Authenticator, Authy, or any TOTP app to scan the code below.</Text>
          <Flex gap={4} alignItems="flex-start" direction={{ base: "column", sm: "row" }}>
            {otpauthUrl && (
              <Box flexShrink={0}>
                <QRCodeSVG value={otpauthUrl} size={130} />
              </Box>
            )}
            <VStack alignItems="flex-start" gap={2} flex={1} minW={0}>
              <Text fontSize="0.8rem" color="grey.500">Can&apos;t scan? Enter this key manually:</Text>
              <HStack
                bg="gray.50" _dark={{ bg: "mainBlack.950" }}
                borderWidth={1} borderColor="gray.200"
                rounded="md" px={3} py={2} gap={2} w="full"
              >
                <Text fontSize="0.75rem" fontFamily="mono" color="text_primary" flex={1} wordBreak="break-all">{secret}</Text>
                <IconButton size="xs" variant="ghost" onClick={copySecret} aria-label="Copy secret" flexShrink={0}>
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                </IconButton>
              </HStack>
            </VStack>
          </Flex>
          <Text fontSize="0.875rem" fontWeight="500" color="text_primary">Enter the 6-digit code from your app</Text>
          <OtpBoxes otp={otp} onChange={setOtp} />
          <PrimaryButton loading={enabling} onClick={handleEnable} disabled={otp.length !== 6}>Enable 2FA</PrimaryButton>
        </Stack>
      )}
      {step === "active" && (
        <Stack borderWidth="1px" borderColor="gray.200" p={4} mb={4} rounded="8px" gap={3}>
          <Text fontSize="0.875rem" fontWeight="600" color="text_primary">When to require 2FA</Text>
          <TfaSwitches enableEmail2FA={enableEmail2FA} enablePhone2FA={enablePhone2FA} enableApp2FA={true} />
        </Stack>
      )}
      {step === "deactivating" && (
        <Stack borderWidth="1px" borderColor="red.100" p={4} mb={4} rounded="8px" gap={3}>
          <Text fontSize="0.875rem" fontWeight="600" color="text_primary">Confirm deactivation</Text>
          <Text fontSize="0.8rem" color="grey.500">Enter the current 6-digit code from your authenticator app to confirm.</Text>
          <OtpBoxes otp={otp} onChange={setOtp} />
          <HStack gap={2} flexWrap="wrap">
            <Button
              bg="red.500" color="white" rounded="md" px={5} fontSize="0.875rem" fontWeight="500"
              loading={deactivating} onClick={handleDeactivate} disabled={otp.length !== 6}
              _hover={{ bg: "red.600" }} alignSelf={{ base: "stretch", sm: "flex-start" }}
              w={{ base: "full", sm: "auto" }}
            >
              Confirm Deactivate
            </Button>
            <Button variant="ghost" onClick={() => setStep("active")} fontSize="0.8rem" color="grey.500"
              w={{ base: "full", sm: "auto" }}>
              Cancel
            </Button>
          </HStack>
        </Stack>
      )}
    </TfaSection>
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
    <Box
      w="full"
      className={outfit.className}
      overflowY="auto"
      css={{ "&::-webkit-scrollbar": { width: "0px" } }}
    >
      <Box
        w="full"
        maxW="800px"
        mx="auto"
        p={{ base: 4, sm: 5, md: 6 }}
        borderRadius="lg"
        bg="bg_box"
      >
        {/* Header */}
        <Box mb={4}>
          <Text fontSize={{ base: "1.1rem", md: "1.35rem" }} fontWeight="700" color="text_primary">
            Two-Factor Authentication (2FA)
          </Text>
          <Text fontSize={{ base: "0.8rem", md: "0.875rem" }} color="grey.500" mt={1} lineHeight="1.6">
            Enhance your account security by setting up 2FA.
          </Text>
        </Box>

        {isLoading ? (
          <Flex justify="center" py={10}>
            <Spinner color="grey.400" />
          </Flex>
        ) : (
          <VStack align="stretch" gap={0} divideY="1px">
            <EmailTfa initialActive={enableEmail2FA} enablePhone2FA={enablePhone2FA} enableApp2FA={enableApp2FA} />
            <PhoneTfa initialActive={enablePhone2FA} enableEmail2FA={enableEmail2FA} enableApp2FA={enableApp2FA} />
            <AuthAppTfa initialActive={enableApp2FA} enableEmail2FA={enableEmail2FA} enablePhone2FA={enablePhone2FA} />
          </VStack>
        )}
      </Box>

      {/* Login Activities */}
      <Box
        w="full"
        maxW="800px"
        mx="auto"
        mt={4}
        p={{ base: 4, sm: 5, md: 6 }}
        borderRadius="lg"
        bg="bg_box"
      >
        <Text fontSize={{ base: "1.1rem", md: "1.35rem" }} fontWeight="700" color="text_primary" mb={4}>
          Login Activities
        </Text>
        <Box overflowX="auto">
          <PaginatedTable />
        </Box>
      </Box>
    </Box>
  );
};

export default SecuritySetting;
