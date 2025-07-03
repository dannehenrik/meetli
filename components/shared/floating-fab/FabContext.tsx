// FabContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

export type FabState = {
    label?: string | null;
    isLoading?: boolean; 
    isDisabled?: boolean;
    onPress?: () => void;
};

const FabContext = createContext<{
    fabState: FabState;
    setFabState: (state: FabState) => void;
}>({
    fabState: { },
    setFabState: () => {},
});

export const FabProvider = ({ children }: { children: React.ReactNode }) => {
    const [fabState, setFabState] = useState<FabState>({ label: null });

    return (
        <FabContext.Provider value={{ fabState, setFabState }}>
            {children}
        </FabContext.Provider>
    );
};

export const useFab = () => useContext(FabContext);
