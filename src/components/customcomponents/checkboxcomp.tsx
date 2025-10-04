"use client";

import { Checkbox } from "@chakra-ui/react";
import { useState } from "react";

type CheckBoxProps = {
  label: string;
  checked?: boolean;
  onChecked?: any;
};
export const CheckBoxComp = ({ label, checked, onChecked }: CheckBoxProps) => {


  return (
    <Checkbox.Root
      checked={checked}
      onCheckedChange={(e) => onChecked(!!e.checked)}

    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Root>
  );
};
