"use client"

import { ChakraProvider } from "@chakra-ui/react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import system from "mangarine/theme"

import { Provider } from "react-redux";
import { onPersistorReady, startPersistor, store } from "mangarine/state/store";

const PersistReadyContext = createContext(false);

export const usePersistReady = () => useContext(PersistReadyContext);

export function Providers(props: ColorModeProviderProps) {
  // Always start false so server and client first renders match (avoids hydration mismatch).
  // useEffect fires immediately after mount and resolves in the same tick if already ready.
  const [persistReady, setPersistReady] = useState(false);

  useEffect(() => {
    let active = true;

    const markReady = () => {
      if (active) {
        setPersistReady(true);
      }
    };

    const storageUnavailable = () => {
      try {
        const probeKey = "__mangerine_storage_probe__";
        window.localStorage.setItem(probeKey, "1");
        window.localStorage.removeItem(probeKey);
        return false;
      } catch {
        return true;
      }
    };

    if (typeof window === "undefined" || storageUnavailable()) {
      markReady();
      return () => {
        active = false;
      };
    }

    // startPersistor boots redux-persist (once, guarded).
    // onPersistorReady fires the callback immediately if already done.
    const unsubscribe = onPersistorReady(markReady);
    const fallback = window.setTimeout(markReady, 2500);

    try {
      startPersistor();
    } catch (error) {
      console.error("Failed to start persisted auth state:", error);
      markReady();
    }

    return () => {
      active = false;
      unsubscribe();
      window.clearTimeout(fallback);
    };
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
