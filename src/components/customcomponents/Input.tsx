import React from "react";
import { Box, ConditionalValue, Input, SystemStyleObject, Text, VStack } from "@chakra-ui/react";
import { isEmpty } from "es-toolkit/compat";
import { InputGroup } from "../ui/input-group";
import { FieldError } from "react-hook-form";

type Props = {
  onChange: (value: string) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement> | undefined;
  onFocus?: React.FocusEventHandler<HTMLInputElement> | undefined;
  value: string | number;
  error?: FieldError | undefined;
  isError?: boolean;
  id?: string;
  placeholder: string;
  label?: string;
  name: string;
  required?: boolean;
  hasRightIcon?: boolean;
  rightIcon?: React.ReactElement;
  hasLeftIcon?: boolean;
  leftIcon?: React.ReactElement | string;
  type?: string;
  validator?: string;
  disabled?: boolean;
  size?: ConditionalValue<
    "md" | "sm" | "lg" | "xl" | "2xl" | "2xs" | "xs" | undefined
  >;
  min?: string;
  max?: string;
  inputStyle?: SystemStyleObject;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  hideErrorText?: boolean;
};
const CustomInput = ({
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  isError,
  label,
  placeholder,
  id,
  name,
  required,
  disabled = false,
  hasRightIcon,
  rightIcon,
  hasLeftIcon,
  leftIcon,
  type = "text",
  validator,
  size = "md",
  min,
  inputStyle = {},
  onKeyDown: onKeyDownProp,
  hideErrorText = false,
}: Props) => {

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
    }
    onKeyDownProp?.(event);
  };

  return (
    <VStack
      id={id}
      // invalid={!!errors["name"]}
      // errorText={errors[name]?.message}
      w="full"
      spaceY={label ? 0.5 : 0}
      alignItems={"flex-start"}
    >
      <Text color={"text_primary"} fontWeight={"400"} fontSize={"1rem"}>
        {label}
        {required && (
          <Text as={"span"} color={"red.400"} ml={1}>
            *
          </Text>
        )}
      </Text>

      <InputGroup
        w="full"
        gap={label ? 0.5 : 0}
        startElement={hasLeftIcon && leftIcon}
        endElement={hasRightIcon && rightIcon}
      >
        <Input
          px={4}
          _focus={{
            borderColor: isError ? "error.100" : "primary.100",
            focusRing: "inside",
            focusRingColor: isError ? "error.100" : "primary.100",
          }}
          _hover={{
            borderColor: isError ? "error.100" : "primary.100",
            focusRing: "inside",

            focusRingColor: isError ? "error.100" : "primary.100",
          }}
          boxShadow="inset 6px 6px 12px rgba(0, 0, 0, 0.2)"
          size={size}
          type={type}
          onKeyDown={handleKeyDown}
          borderColor={
            !isEmpty(error)
              ? "error.100"
              : !isEmpty(value)
                ? "text_primary"
                : "input_border"
          }
          borderWidth={1.5}
          focusRing={"none"}
          shadow={"inner"}
          ring={"none"}
          min={min}
          name={name}
          rounded="6px"
          css={{
            "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
              "-webkit-appearance": "none",
              margin: 0,
            },
            "-moz-appearance": "textfield",
          }}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          _placeholder={{
            color: "gray.150",
            fontSize: "1rem",
          }}
          onChange={(event) => {
            if (validator) {
              const value = event.target.value.replace(validator, "");
              onChange(value);
            } else {
              onChange(event.target.value);
            }
          }}
          onBlur={onBlur}
          onFocus={onFocus}
          fontSize={"1rem"}
          color={"text_primary"}
          {...inputStyle}
        />
      </InputGroup>
      <Box mt={"1"} w="full">
        {!hideErrorText && !isEmpty(error) && (
          <Text
            color="red.500"
            lineHeight={"1.2"}
            textAlign={"left"}
            fontSize="0.75rem"
          >
            {error.message}
          </Text>
        )}
      </Box>
    </VStack>
  );
};

export default CustomInput;
