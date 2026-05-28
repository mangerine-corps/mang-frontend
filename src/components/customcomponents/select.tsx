"use client";

import {
  Box,
  BoxProps,
  ConditionalValue,
  createListCollection,
  Text,
} from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "../ui/select";
import { isEmpty } from "es-toolkit/compat";
import { outfit } from "mangarine/pages/_app";
import { FieldError, Merge } from "react-hook-form";
import { SelectOptions } from "mangarine/types";

type Props =  {
  name: string;
  id: string;
  label: string;
  placeholder: string;
  value: string[];
  defaultValue?: string[];
  bg?: string;
  isMulti?: boolean;
  required: boolean;
  onChange: (value: string) => void;
  size?: ConditionalValue<"md" | "sm" | "lg" | "xs" | undefined>;
  options: Array<SelectOptions>;
  error?: Merge<FieldError, FieldError[]>;
};

const CustomSelect = ({
  label,
  name,
  id,
  required = false,
  placeholder,
  value,
  bg,
  onChange,
  isMulti = false,
  options,
  size = "md",
  defaultValue,
  error,
 ...rest

}: Props) => {
  const collection = createListCollection({ items: options });
  return (
    <SelectRoot
      id={id}
      name={name}
      value={value}
      // bg="red.800"
      color="text_primary"
      style={{
        borderColor: !isEmpty(error)
          ? "error.100"
          : !isEmpty(value)
            ? "text_primary"
            : "input_border",
      }}
      _default={{
        color: 'red.400'
      }}
      _hover={{
        borderColor: !isEmpty(error) ? "error.100" : "primary.100",
      }}
      multiple={isMulti}
      onValueChange={(e: any) => onChange(isMulti ? e.value : (e.value[0] ?? ""))}
      collection={collection}
      defaultValue={defaultValue}
      required={required}
      size={size}
      width="full"
      {...rest}
    >
      <SelectLabel
        className={outfit.className}
        color={"text_primary"}
        fontWeight={"400"}
        fontSize={"0.75rem"}
      >
        {label}{" "}
        {required && (
          <Text as="span" color="red.500">
            *
          </Text>
        )}
      </SelectLabel>

      <SelectTrigger
        bg={bg}
        rounded="lg"
        borderWidth={!isEmpty(error) && 1.5}
        borderColor={!isEmpty(error) && "error.100"}
        _focus={{ borderColor: "text_primary" }}
      >
        <SelectValueText
          px={3}
          rounded="lg"
          color={!isEmpty(value) ? "text_primary" : "gray.200"}
          _placeholder={{ color: "red.500" }}
          fontWeight="400"
          fontSize={"14px"}
          placeholder={placeholder}
        />
      </SelectTrigger>

      <SelectContent
        zIndex={"max"}
        color={"text_primary"}
        bg="main_background"
      >
        {collection.items.map((movie: any) => (
          <SelectItem
            _hover={{ bg: "primary.50", color: "text_primary" }}
            _highlighted={{ bg: "primary.50", color: "text_primary" }}
            px={4}
            py={3}
            item={movie}
            key={movie.value}
          >
            {movie.label}
          </SelectItem>
        ))}
      </SelectContent>
      <Box mt={"1"} w="full">
        {!isEmpty(error) && (
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
    </SelectRoot>
  );
};

export default CustomSelect;
