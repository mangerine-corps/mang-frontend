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
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
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
} from "mangarine/state/services/settings.service";
import { toaster } from "../ui/toaster";
import CustomInput from "../customcomponents/Input";

type TfaStep = "idle" | "input" | "otp" | "active";

const otpSchema = Yup.object().shape({
  otp: Yup.string().required("Required").length(6, "OTP must be 6 digits"),
});

// ── Reusable 2FA toggle switches ──────────────────────────────────────────────
const TfaSwitches = () => (
  <VStack justifyContent="space-between" alignItems="center" w="full" pb={6} gap={3}>
    {["Log in", "Payment Confirmation", "Account Settings change", "Consultation Booking"].map((label) => (
      <Switch.Root key={label} w="full" alignItems="flex-start" justifyContent="space-between">
        <Switch.Label font="outfit" fontSize="1.1rem" fontWeight="400" color="text_primary">
          {label}
        </Switch.Label>
        <Switch.HiddenInput />
        <Switch.Control />
      </Switch.Root>
    ))}
  </VStack>
);

// ── Email 2FA section ─────────────────────────────────────────────────────────
const EmailTfa = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<TfaStep>("idle");
  const [email, setEmail] = useState(user?.email ?? "");
  const [otp, setOtp] = useState("");

  const [enableEmail2FA, { isLoading: sending }] = useEnableEmail2FAMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();

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

  const deactivate = () => {
    setStep("idle");
    setOtp("");
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
            Deactivate
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
          <Button
            bg="#111D4A"
            color="white"
            rounded="md"
            px={6}
            py={2}
            fontSize="0.875rem"
            fontWeight="500"
            loading={sending}
            onClick={sendCode}
            _hover={{ bg: "#1a2a6c" }}
            alignSelf="flex-start"
          >
            Send Verification Code
          </Button>
        </Stack>
      )}

      {step === "otp" && (
        <Stack borderWidth="1px" borderColor="grey.100" py={4} px={4} mb={6} rounded="8px" gap={4}>
          <Text fontSize="1rem" fontWeight="600" color="text_primary">Enter verification code</Text>
          <Text fontSize="0.875rem" color="grey.500">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </Text>
          <OTPInput
            value={otp}
            onChange={(v) => setOtp(v.replace(/[^0-9]/g, ""))}
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
                  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
                  "&[type=number]": { MozAppearance: "textfield" },
                }}
                {...props}
              />
            )}
            renderSeparator={<span style={{ width: "6px" }} />}
            containerStyle={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "4px" }}
          />
          <HStack gap={3}>
            <Button
              bg="#111D4A" color="white" rounded="md" px={6} py={2}
              fontSize="0.875rem" fontWeight="500"
              loading={verifying}
              onClick={verify}
              _hover={{ bg: "#1a2a6c" }}
              disabled={otp.length !== 6}
            >
              Verify Code
            </Button>
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
          <TfaSwitches />
        </Stack>
      )}
    </>
  );
};

// ── Phone 2FA section ─────────────────────────────────────────────────────────
const PhoneTfa = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<TfaStep>("idle");
  const [phone, setPhone] = useState((user as any)?.phoneNumber ?? "");
  const [otp, setOtp] = useState("");

  const [enablePhone2FA, { isLoading: sending }] = useEnablePhone2FAMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();

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

  const deactivate = () => {
    setStep("idle");
    setOtp("");
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
            Deactivate
          </Text>
        )}
      </HStack>

      {step === "input" && (
        <Stack borderWidth="1px" borderColor="grey.100" py={4} px={4} mb={6} rounded="8px" gap={4}>
          <Text fontSize="1rem" fontWeight="600" color="text_primary">Verify your phone number</Text>
          <Text fontSize="0.875rem" color="grey.500">
            We will send a one-time code via SMS to the number below.
          </Text>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
            type="tel"
            borderWidth={1}
            borderColor="gray.200"
            rounded="md"
            px={3}
            py={2}
            fontSize="0.9rem"
            color="text_primary"
            bg="main_background"
          />
          <Button
            bg="#111D4A" color="white" rounded="md" px={6} py={2}
            fontSize="0.875rem" fontWeight="500"
            loading={sending}
            onClick={sendCode}
            _hover={{ bg: "#1a2a6c" }}
            alignSelf="flex-start"
          >
            Send Verification Code
          </Button>
        </Stack>
      )}

      {step === "otp" && (
        <Stack borderWidth="1px" borderColor="grey.100" py={4} px={4} mb={6} rounded="8px" gap={4}>
          <Text fontSize="1rem" fontWeight="600" color="text_primary">Enter verification code</Text>
          <Text fontSize="0.875rem" color="grey.500">
            Enter the 6-digit code sent to <strong>{phone}</strong>
          </Text>
          <OTPInput
            value={otp}
            onChange={(v) => setOtp(v.replace(/[^0-9]/g, ""))}
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
                  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
                  "&[type=number]": { MozAppearance: "textfield" },
                }}
                {...props}
              />
            )}
            renderSeparator={<span style={{ width: "6px" }} />}
            containerStyle={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "4px" }}
          />
          <HStack gap={3}>
            <Button
              bg="#111D4A" color="white" rounded="md" px={6} py={2}
              fontSize="0.875rem" fontWeight="500"
              loading={verifying}
              onClick={verify}
              _hover={{ bg: "#1a2a6c" }}
              disabled={otp.length !== 6}
            >
              Verify Code
            </Button>
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
          <TfaSwitches />
        </Stack>
      )}
    </>
  );
};

// ── Auth App section ──────────────────────────────────────────────────────────
const AuthAppTfa = () => {
  const [ATfa, setAtfa] = useState(false);
  const [otp, setOtp] = useState("");
  const [setupApp2FA, { isLoading: settingUp }] = useSetupApp2FAMutation();
  const [enableApp2FA, { isLoading: enabling }] = useEnableApp2FAMutation();

  const handleActivate = async () => {
    try {
      await setupApp2FA(undefined).unwrap();
      setAtfa(true);
    } catch {
      toaster.create({ title: "Setup failed", description: "Could not initiate app 2FA setup.", type: "error", duration: 4000, closable: true });
    }
  };

  const handleVerify = async () => {
    try {
      await enableApp2FA({ otp }).unwrap();
      toaster.create({ title: "Authenticator app 2FA enabled", type: "success", duration: 4000, closable: true });
    } catch (err: any) {
      toaster.create({ title: "Invalid code", description: err?.data?.message ?? "Check the code and try again.", type: "error", duration: 4000, closable: true });
    }
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
        {!ATfa ? (
          <Text cursor="pointer" onClick={handleActivate} fontSize="1.1rem" fontWeight="600" color="text_primary" whiteSpace="nowrap">
            {settingUp ? "Setting up…" : "Activate"}
          </Text>
        ) : (
          <Text cursor="pointer" onClick={() => { setAtfa(false); setOtp(""); }} fontSize="1.1rem" fontWeight="600" color="red.500" whiteSpace="nowrap">
            Deactivate
          </Text>
        )}
      </HStack>

      {ATfa && (
        <VStack alignItems="flex-start" w="full" p={4} boxShadow="sm" borderRadius="md" mb={6} gap={4}>
          <Text fontSize="1rem" fontWeight="500" color="text_primary">
            Generate verification codes with Google Authenticator or Authy to strengthen your security.
          </Text>
          <HStack>
            <QRCodeSVG value="https://reactjs.org/" />
            <VStack alignItems="flex-start" pl={3} w="45">
              <Text fontSize="0.9rem" fontWeight="400" color="grey.500">
                Scan this QR code or copy it to set up manually.
              </Text>
              <HStack>
                <Checkbox />
                <Text fontSize="1rem" fontWeight="600" color="text_primary">Copy code</Text>
              </HStack>
            </VStack>
          </HStack>

          <Text fontSize="1rem" fontWeight="500" color="text_primary">Enter the 6-digit code from your app</Text>
          <OTPInput
            value={otp}
            onChange={(v) => setOtp(v.replace(/[^0-9]/g, ""))}
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
                  "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
                  "&[type=number]": { MozAppearance: "textfield" },
                }}
                {...props}
              />
            )}
            renderSeparator={<span style={{ width: "6px" }} />}
            containerStyle={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "4px" }}
          />
          <Button
            bg="#111D4A" color="white" rounded="md" px={6} py={2}
            fontSize="0.875rem" fontWeight="500"
            loading={enabling}
            onClick={handleVerify}
            _hover={{ bg: "#1a2a6c" }}
            disabled={otp.length !== 6}
          >
            Enable 2FA
          </Button>
        </VStack>
      )}
    </>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const SecuritySetting = () => {
  return (
    <Box
      w="full"
      p={{ base: 4, sm: 6, md: 8, lg: 10, xl: 12 }}
      borderRadius="lg"
      boxShadow="lg"
      bg="bg_box"
      mt={{ base: 4, md: 8, lg: 0 }}
      className={outfit.className}
    >
      <Text fontSize={{ base: "1rem", md: "1.5rem" }} fontWeight="600" color="text_primary">
        Two-Factor Authentication (2FA)
      </Text>
      <Text fontSize="1rem" fontWeight="400" color="grey.500" mt={1}>
        Enhance your account security by setting up 2FA. Protect your information with an additional layer of defense.
      </Text>

      <EmailTfa />
      <PhoneTfa />
      <AuthAppTfa />

      <Box w="full" py={10}>
        <Text fontSize={{ base: "1rem", md: "1.5rem" }} fontWeight="600" color="text_primary" mb={4}>
          Login Activities
        </Text>
        <PaginatedTable />
      </Box>
    </Box>
  );
};

export default SecuritySetting;
