"use client"

import { ChakraProvider } from "@chakra-ui/react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import system from "mangarine/theme"

import { Provider } from "react-redux";
import { startPersistor, store } from "mangarine/state/store";

const PersistReadyContext = createContext(false);

export const usePersistReady = () => useContext(PersistReadyContext);

export function Providers(props: ColorModeProviderProps) {
  const [persistReady, setPersistReady] = useState(false);

  useEffect(() => {
    startPersistor(() => {
      setPersistReady(true);
    });
  }, []);

  return (
    <PersistReadyContext.Provider value={persistReady}>
      <Provider store={store}>
        <ChakraProvider value={system}>
          <ColorModeProvider {...props} />
        </ChakraProvider>
      </Provider>
    </PersistReadyContext.Provider>
  );
}
