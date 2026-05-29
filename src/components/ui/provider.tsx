"use client"

import { ChakraProvider } from "@chakra-ui/react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import system from "mangarine/theme"

import { Provider } from "react-redux";
import { isPersistorReady, onPersistorReady, store } from "mangarine/state/store";

const PersistReadyContext = createContext(false);

export const usePersistReady = () => useContext(PersistReadyContext);

export function Providers(props: ColorModeProviderProps) {
  // Check synchronously — if rehydration finished before this component
  // even mounts (fast devices), we skip the loading state entirely.
  const [persistReady, setPersistReady] = useState(() => isPersistorReady());

  useEffect(() => {
    if (isPersistorReady()) {
      setPersistReady(true);
      return;
    }
    onPersistorReady(() => setPersistReady(true));
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
