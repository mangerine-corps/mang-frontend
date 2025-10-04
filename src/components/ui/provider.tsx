"use client"

import { ChakraProvider } from "@chakra-ui/react";
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import system from "mangarine/theme"

import { Provider } from "react-redux";
import { store } from "mangarine/state/store";

export function Providers(props: ColorModeProviderProps) {
  return (
    <Provider store={store}>
      <ChakraProvider value={system}>
        <ColorModeProvider {...props} />
      </ChakraProvider>
    </Provider>
  );
}
