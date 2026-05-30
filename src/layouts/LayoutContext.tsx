import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface LayoutContextValue {
  subHeader: ReactNode;
  setSubHeader: (node: ReactNode) => void;
}

export const LayoutContext = createContext<LayoutContextValue>({
  subHeader: null,
  setSubHeader: () => {},
});

export const useSubHeader = (node: ReactNode) => {
  const { setSubHeader } = useContext(LayoutContext);
  // Run on every render so dynamic subHeaders (e.g. filter state) stay in sync
  useEffect(() => {
    setSubHeader(node);
  });
  // Clear on unmount
  useEffect(() => () => setSubHeader(null), []);
};

export const useLayoutContext = () => useContext(LayoutContext);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [subHeader, setSubHeader] = useState<ReactNode>(null);
  return (
    <LayoutContext.Provider value={{ subHeader, setSubHeader }}>
      {children}
    </LayoutContext.Provider>
  );
}
