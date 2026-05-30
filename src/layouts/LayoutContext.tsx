import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

interface LayoutContextValue {
  subHeader: ReactNode;
  setSubHeader: (node: ReactNode) => void;
}

export const LayoutContext = createContext<LayoutContextValue>({
  subHeader: null,
  setSubHeader: () => {},
});

// Takes an explicit deps array so callers control when the subHeader updates.
// This avoids the infinite re-render loop caused by running the effect every
// render with a new JSX object reference.
export const useSubHeader = (node: ReactNode, deps: React.DependencyList = []) => {
  const { setSubHeader } = useContext(LayoutContext);
  const nodeRef = useRef(node);
  nodeRef.current = node;

  useEffect(() => {
    setSubHeader(nodeRef.current);
    return () => setSubHeader(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
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
