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
  Flex,
} from "@chakra-ui/react";
import PhoneInputWithCode from "../customcomponents/PhoneInputWithCode";
import { useState } from "react";
import OTPInput from "react-otp-input";
import { size } from "es-toolkit/compat";
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

type TfaStep = "idle" | "input" | "otp" | "active";
type AppStep = "idle" | "setup" | "active" | "deactivating";

// OTP input: boxes sized to always fit 6 on any screen
const OtpBoxes = ({ otp, onChange }: { otp: string; onChange: (v: string) => void }) => (
  <Box w="full" overflowX="auto">
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
          fontSize="14px"
          fontWeight="500"
          h="40px"
          w="40px"
          minW="40px"
          maxW="40px"
          color="text_primary"
          borderColor={size(otp) > index ? "primary.200" : "border_background"}
          focusRingColor="primary.200"
          textAlign="center"
          css={{
            "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
            "&[type=number]": { MozAppearance: "textfield" },
          }}
          {...props}
        />
      )}
      renderSeparator={<Box w="4px" flexShrink={0} />}
      containerStyle={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    />
  </Box>
);

const PrimaryButton = ({ onClick, loading, disabled, children }: {
  onClick: () => void; loading?: boolean; disabled?: boolean; children: React.ReactNode;
}) => (
  <Button
    bg="button_bg" color="button_text" rounded="md" px={5}
    fontSize="0.875rem" fontWeight="500"
    loading={loading} onClick={onClick}
    _hover={{ opacity: 0.85 }} disabled={disabled}
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

const TfaSwitches = ({ enableEmail2FA, enablePhone2FA, enableApp2FA }: {
  enableEmail2FA: boolean; enablePhone2FA: boolean; enableApp2FA: boolean;
}) => {
  const [values, setValues] = useState<SwitchValues>({
    login: false, paymentConfirmation: false, accountSettingsChange: false, consultationBooking: false,
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
    <VStack w="full" gap={3}>
      {items.map(({ label, key }) => (
        <Switch.Root
          key={key} w="full" alignItems="center" justifyContent="space-between"
          checked={values[key]} onCheckedChange={(e) => handleToggle(key, e.checked)} disabled={isLoading}
        >
          <Switch.Label fontFamily="Outfit" fontSize="0.85rem" fontWeight="400" color="text_primary" flex={1} minW={0}>
            {label}
          </Switch.Label>
          <Switch.HiddenInput />
          <Switch.Control flexShrink={0} ml={3} />
        </Switch.Root>
      ))}
    </VStack>
  );
};

const TfaSection = ({ title, description, step, onActivate, onDeactivate, activating, disabling, children }: {
  title: string; description: string; step: TfaStep | AppStep;
  onActivate: () => void; onDeactivate: () => void;
  activating?: boolean; disabling?: boolean; children?: React.ReactNode;
}) => (
  <Box w="full" minW={0}>
    <Box py={4}>
      <Flex justify="space-between" align="center" gap={2} mb={1} w="full">
        <HStack gap={2} flex={1} minW={0} overflow="hidden">
          <Text fontSize="0.875rem" fontWeight="600" color="text_primary" flexShrink={0}>{title}</Text>
          {step === "active" && (
            <Box px={2} py={0.5} rounded="full" bg="green.50" _dark={{ bg: "green.900" }} flexShrink={0}>
              <Text fontSize="0.65rem" fontWeight="600" color="green.600">Active</Text>
            </Box>
          )}
        </HStack>
        <Box flexShrink={0} pl={2}>
          {step === "idle" && (
            <Text cursor="pointer" onClick={onActivate} fontSize="0.825rem" fontWeight="600" color="button_bg" whiteSpace="nowrap">
              {activating ? "Setting up…" : "Activate"}
            </Text>
          )}
          {(step === "active" || step === "deactivating") && (
            <Text cursor="pointer" onClick={onDeactivate} fontSize="0.825rem" fontWeight="600" color="red.500" whiteSpace="nowrap">
              {disabling ? "Disabling…" : "Deactivate"}
            </Text>
          )}
          {step === "setup" && (
            <Text cursor="pointer" onClick={onDeactivate} fontSize="0.825rem" fontWeight="600" color="grey.500" whiteSpace="nowrap">
              Cancel
            </Text>
          )}
        </Box>
      </Flex>
      <Text fontSize="0.775rem" fontWeight="400" color="grey.500" lineHeight="1.5" pr={12}>
        {description}
      </Text>
    </Box>
    {children}
  </Box>
);

const ExpandBox = ({ children, borderColor = "border_background" }: { children: React.ReactNode; borderColor?: string }) => (
  <Box borderTopWidth="1px" borderColor={borderColor} pt={3} mb={4}>
    <VStack align="stretch" gap={3}>
      {children}
    </VStack>
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
      toaster.create({ title: "Code sent", description: `Verification code sent to ${email}`, type: "success", duration: 6000, closable: true });
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
      setStep("idle"); setOtp("");
    } catch (err: any) {
      toaster.create({ title: "Failed to disable", description: err?.data?.message ?? "Please try again.", type: "error", duration: 4000, closable: true });
    }
  };

  return (
    <TfaSection title="Email Address" description="Get a secure code sent to your email as an extra layer of protection." step={step} onActivate={() => setStep("input")} onDeactivate={deactivate} disabling={disabling}>
      {step === "input" && (
        <ExpandBox>
          <Text fontSize="0.85rem" fontWeight="600" color="text_primary">Verify your email address</Text>
          <Text fontSize="0.78rem" color="grey.500">We&apos;ll send a one-time code to confirm it belongs to you.</Text>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" type="email" borderWidth={1} borderColor="border_background" rounded="md" px={3} fontSize="0.875rem" color="text_primary" bg="main_background" />
          <PrimaryButton loading={sending} onClick={sendCode}>Send Verification Code</PrimaryButton>
        </ExpandBox>
      )}
      {step === "otp" && (
        <ExpandBox>
          <Text fontSize="0.85rem" fontWeight="600" color="text_primary">Enter verification code</Text>
          <Text fontSize="0.78rem" color="grey.500">Enter the 6-digit code sent to <strong>{email}</strong></Text>
          <OtpBoxes otp={otp} onChange={setOtp} />
          <HStack gap={2} flexWrap="wrap">
            <PrimaryButton loading={verifying} onClick={verify} disabled={otp.length !== 6}>Verify Code</PrimaryButton>
            <Button variant="ghost" onClick={() => setStep("input")} fontSize="0.8rem" color="grey.500" w={{ base: "full", sm: "auto" }}>Resend</Button>
          </HStack>
        </ExpandBox>
      )}
      {step === "active" && (
        <ExpandBox>
          <Text fontSize="0.85rem" fontWeight="600" color="text_primary">When to require 2FA</Text>
          <TfaSwitches enableEmail2FA={true} enablePhone2FA={enablePhone2FA} enableApp2FA={enableApp2FA} />
        </ExpandBox>
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
      toaster.create({ title: "Code sent", description: `Verification code sent to ${phone}`, type: "success", duration: 6000, closable: true });
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
      setStep("idle"); setOtp("");
    } catch (err: any) {
      toaster.create({ title: "Failed to disable", description: err?.data?.message ?? "Please try again.", type: "error", duration: 4000, closable: true });
    }
  };

  return (
    <TfaSection title="Phone Number" description="Get a secure code sent to your phone as an extra layer of protection." step={step} onActivate={() => setStep("input")} onDeactivate={deactivate} disabling={disabling}>
      {step === "input" && (
        <ExpandBox>
          <Text fontSize="0.85rem" fontWeight="600" color="text_primary">Verify your phone number</Text>
          <Text fontSize="0.78rem" color="grey.500">We&apos;ll send a one-time code via SMS to the number below.</Text>
          <PhoneInputWithCode value={phone} onChange={setPhone} placeholder="8012345678" />
          <PrimaryButton loading={sending} onClick={sendCode}>Send Verification Code</PrimaryButton>
        </ExpandBox>
      )}
      {step === "otp" && (
        <ExpandBox>
          <Text fontSize="0.85rem" fontWeight="600" color="text_primary">Enter verification code</Text>
          <Text fontSize="0.78rem" color="grey.500">Enter the 6-digit code sent to <strong>{phone}</strong></Text>
          <OtpBoxes otp={otp} onChange={setOtp} />
          <HStack gap={2} flexWrap="wrap">
            <PrimaryButton loading={verifying} onClick={verify} disabled={otp.length !== 6}>Verify Code</PrimaryButton>
            <Button variant="ghost" onClick={() => setStep("input")} fontSize="0.8rem" color="grey.500" w={{ base: "full", sm: "auto" }}>Resend</Button>
          </HStack>
        </ExpandBox>
      )}
      {step === "active" && (
        <ExpandBox>
          <Text fontSize="0.85rem" fontWeight="600" color="text_primary">When to require 2FA</Text>
          <TfaSwitches enableEmail2FA={enableEmail2FA} enablePhone2FA={true} enableApp2FA={enableApp2FA} />
        </ExpandBox>
      )}
    </TfaSection>
  );
};

// ── Auth App 2FA ──────────────────────────────────────────────────────────────
const AuthAppTfa = ({ initialActive, enableEmail2FA, enablePhone2FA }: { initialActive: boolean; enableEmail2FA: boolean; enablePhone2FA: boolean }) => {
  const [step, setStep] = useState<AppStep>(initialActive ? "active" : "idle");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [otp, setOtp] = useState("");
  const [setupApp2FA, { isLoading: settingUp }] = useSetupApp2FAMutation();
  const [enableApp2FA, { isLoading: enabling }] = useEnableApp2FAMutation();
  const [deactivateApp2FA, { isLoading: deactivating }] = useDeactivateApp2FAMutation();

  const handleSetup = async () => {
    try {
      const result = await setupApp2FA(undefined).unwrap();
      setQrCodeUrl((result as any)?.data?.qrCodeUrl ?? "");
      setStep("setup");
    } catch {
      toaster.create({ title: "Setup failed", description: "Could not initiate app 2FA setup.", type: "error", duration: 4000, closable: true });
    }
  };

  const handleEnable = async () => {
    try {
      await enableApp2FA({ otp }).unwrap();
      toaster.create({ title: "Authenticator app 2FA enabled", type: "success", duration: 4000, closable: true });
      setStep("active"); setOtp("");
    } catch (err: any) {
      toaster.create({ title: "Invalid code", description: err?.data?.message ?? "Check the code and try again.", type: "error", duration: 4000, closable: true });
    }
  };

  const handleDeactivate = async () => {
    if (step === "active") { setStep("deactivating"); setOtp(""); return; }
    try {
      await deactivateApp2FA({ otp }).unwrap();
      toaster.create({ title: "App 2FA disabled", type: "success", duration: 4000, closable: true });
      setStep("idle"); setOtp("");
    } catch (err: any) {
      toaster.create({ title: "Failed to disable", description: err?.data?.message ?? "Check the code and try again.", type: "error", duration: 4000, closable: true });
    }
  };

  return (
    <TfaSection title="Authentication App" description="Use Google Authenticator or Authy to generate secure codes." step={step} onActivate={handleSetup} onDeactivate={handleDeactivate} activating={settingUp} disabling={deactivating}>
      {step === "setup" && (
        <ExpandBox>
          <Text fontSize="0.85rem" fontWeight="600" color="text_primary">Scan the QR code with your authenticator app</Text>
          <Text fontSize="0.78rem" color="grey.500">Use Google Authenticator, Authy, or any TOTP app.</Text>
          {qrCodeUrl && (
            <Box>
              <img src={qrCodeUrl} alt="2FA QR Code" style={{ width: 130, height: 130, display: "block" }} />
            </Box>
          )}
          <Text fontSize="0.85rem" fontWeight="500" color="text_primary">Enter the 6-digit code from your app</Text>
          <OtpBoxes otp={otp} onChange={setOtp} />
          <PrimaryButton loading={enabling} onClick={handleEnable} disabled={otp.length !== 6}>Enable 2FA</PrimaryButton>
        </ExpandBox>
      )}
      {step === "active" && (
        <ExpandBox>
          <Text fontSize="0.85rem" fontWeight="600" color="text_primary">When to require 2FA</Text>
          <TfaSwitches enableEmail2FA={enableEmail2FA} enablePhone2FA={enablePhone2FA} enableApp2FA={true} />
        </ExpandBox>
      )}
      {step === "deactivating" && (
        <ExpandBox borderColor="red.100">
          <Text fontSize="0.85rem" fontWeight="600" color="text_primary">Confirm deactivation</Text>
          <Text fontSize="0.78rem" color="grey.500">Enter the current 6-digit code from your authenticator app.</Text>
          <OtpBoxes otp={otp} onChange={setOtp} />
          <VStack gap={2} align="stretch">
            <Button bg="red.500" color="white" rounded="md" px={5} fontSize="0.875rem" fontWeight="500" loading={deactivating} onClick={handleDeactivate} disabled={otp.length !== 6} _hover={{ bg: "red.600" }} w="full">
              Confirm Deactivate
            </Button>
            <Button variant="ghost" onClick={() => setStep("active")} fontSize="0.8rem" color="grey.500" w="full">
              Cancel
            </Button>
          </VStack>
        </ExpandBox>
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
    <Box w="full" maxW={{ base: "100%", sm: "540px", md: "full" }} mx="auto" className={outfit.className}>
      <Box borderRadius="lg" boxShadow="lg" bg="main_background" p={{ base: 4, md: 8 }} w="full">
        <Text fontSize={{ base: "1rem", md: "1.5rem" }} fontWeight="600" color="text_primary" mb={1}>
          Two-Factor Authentication (2FA)
        </Text>
        <Text fontSize={{ base: "0.875rem", md: "1rem" }} color="grey.500" mb={6}>
          Enhance your account security with an additional layer of defense.
        </Text>

        {isLoading ? (
          <Flex justify="center" py={8}><Spinner color="grey.400" /></Flex>
        ) : (
          <VStack align="stretch" gap={0} divideY="1px">
            <EmailTfa initialActive={enableEmail2FA} enablePhone2FA={enablePhone2FA} enableApp2FA={enableApp2FA} />
            <PhoneTfa initialActive={enablePhone2FA} enableEmail2FA={enableEmail2FA} enableApp2FA={enableApp2FA} />
            <AuthAppTfa initialActive={enableApp2FA} enableEmail2FA={enableEmail2FA} enablePhone2FA={enablePhone2FA} />
          </VStack>
        )}

        <Box w="full" mt={10}>
          <Text fontSize={{ base: "1rem", md: "1.5rem" }} fontWeight="600" color="text_primary" mb={4}>
            Login Activities
          </Text>
          <Box w="full" overflowX="auto">
            <PaginatedTable />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SecuritySetting;
