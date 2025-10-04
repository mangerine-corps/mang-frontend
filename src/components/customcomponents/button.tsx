import React from "react";
import { Button } from "../ui/button";
import { ConditionalValue, SystemStyleObject } from "@chakra-ui/react";
import { outfit } from "mangarine/pages/_app";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  size?: ConditionalValue<
    "md" | "sm" | "lg" | "xl" | "2xl" | "2xs" | "xs" | undefined
  >;
  variant?: ConditionalValue<"solid" | "outline" | undefined>;
  children: React.ReactNode;
  customStyle?: SystemStyleObject;
};
const CustomButton = ({
  disabled = false,
  loading = false,
  onClick,
  size = "md",
  variant = "solid",
  children,
  customStyle = {}
}: Props) => {
  const bgColor = variant === "solid" ? "button_bg" : "transparent";
  //   const btnSize = size === 'md'? '2.6rem'
  
  return (
    <Button
      size={size}
      onClick={onClick}
      variant={variant}
      h={"2.6rem"}
      w="full"
      className={outfit.className}
      disabled={disabled}
      _disabled={{
        opacity: 0.7,
      }}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      bg={bgColor}
      borderWidth={variant === "outline" ? 1 : 0}
      borderColor={"primary.300"}
      color={variant === "solid" ? "white" : "primary.300"}
      loading={loading}
      _hover={{
        bg: bgColor,
        opacity: 0.9,
      }}
      loadingText={"Please wait..."}
      type="submit"
      fontWeight={"600"}
      fontSize={"15px"}
      borderRadius={"8px"}
      {...customStyle}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
