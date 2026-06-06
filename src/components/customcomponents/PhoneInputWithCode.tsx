import { Box, HStack, Input, Text, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FieldError } from "react-hook-form";
import {
    PHONE_CODES_UNIQUE,
    formatPhoneForApi,
    parseStoredPhone,
    PhoneCode,
} from "mangarine/lib/phone-codes";

interface PhoneInputWithCodeProps {
    value?: string;
    onChange: (fullNumber: string) => void;
    label?: string;
    required?: boolean;
    error?: FieldError | string;
    placeholder?: string;
    disabled?: boolean;
}

const DEFAULT_CODE: PhoneCode =
    PHONE_CODES_UNIQUE.find((c) => c.code === "NG") ?? PHONE_CODES_UNIQUE[0];

const PhoneInputWithCode = ({
    value,
    onChange,
    label,
    required,
    error,
    placeholder = "Enter phone number",
    disabled,
}: PhoneInputWithCodeProps) => {
    const [selected, setSelected] = useState<PhoneCode>(DEFAULT_CODE);
    const [localNumber, setLocalNumber] = useState("");
    const initialised = useRef(false);

    useEffect(() => {
        if (initialised.current) return;
        initialised.current = true;
        if (!value) return;
        const parsed = parseStoredPhone(value);
        if (parsed) {
            setSelected(parsed.entry);
            setLocalNumber(parsed.local);
        } else {
            setLocalNumber(value.replace(/\D/g, ""));
        }
    }, [value]);

    const handleDialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const entry =
            PHONE_CODES_UNIQUE.find(
                (c) => `${c.code}-${c.dial}` === e.target.value
            ) ?? selected;
        setSelected(entry);
        onChange(formatPhoneForApi(entry.dial, localNumber));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const digits = e.target.value.replace(/\D/g, "");
        setLocalNumber(digits);
        onChange(formatPhoneForApi(selected.dial, digits));
    };

    const errorMsg =
        typeof error === "string" ? error : (error as FieldError)?.message;
    const hasValue = Boolean(localNumber);

    return (
        <VStack w="full" alignItems="flex-start" spaceY={0}>
            {label && (
                <Text
                    color="#999999"
                    fontWeight="400"
                    fontSize="0.75rem"
                    mb="1px"
                >
                    {label}
                    {required && (
                        <Text as="span" color="red.400" ml={1}>
                            *
                        </Text>
                    )}
                </Text>
            )}
            <HStack w="full" gap={0} alignItems="stretch">
                {/* Country code dropdown */}
                <Box
                    as="select"
                    borderWidth="1.5px"
                    borderColor={
                        errorMsg
                            ? "red.500"
                            : hasValue
                              ? "text_primary"
                              : "input_border"
                    }
                    borderRightWidth={0}
                    borderLeftRadius="6px"
                    bg="main_background"
                    color="text_primary"
                    fontSize="0.85rem"
                    px={2}
                    h="10"
                    minW="110px"
                    maxW="110px"
                    cursor="pointer"
                    _focus={{ outline: "none", borderColor: "primary.100" }}
                    disabled={disabled}
                    value={`${selected.code}-${selected.dial}`}
                    onChange={handleDialChange}
                >
                    {PHONE_CODES_UNIQUE.map((c) => (
                        <option key={`${c.code}-${c.dial}`} value={`${c.code}-${c.dial}`}>
                            {c.flag} +{c.dial}
                        </option>
                    ))}
                </Box>

                {/* Number input */}
                <Input
                    flex={1}
                    type="tel"
                    value={localNumber}
                    onChange={handleNumberChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    borderWidth={1.5}
                    borderLeftRadius={0}
                    borderRightRadius="6px"
                    borderColor={
                        errorMsg
                            ? "red.500"
                            : hasValue
                              ? "text_primary"
                              : "input_border"
                    }
                    focusRing="none"
                    px={4}
                    fontSize="1rem"
                    color="text_primary"
                    _placeholder={{ color: "gray.150", fontSize: "1rem" }}
                    _focus={{ borderColor: "primary.100" }}
                    css={{
                        "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button":
                            { WebkitAppearance: "none", margin: 0 },
                        MozAppearance: "textfield",
                    }}
                />
            </HStack>
            {errorMsg && (
                <Text color="red.500" fontSize="0.75rem" lineHeight="1.2" mt={1}>
                    {errorMsg}
                </Text>
            )}
        </VStack>
    );
};

export default PhoneInputWithCode;
