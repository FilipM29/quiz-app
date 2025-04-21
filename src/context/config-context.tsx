import { createContext, type ReactNode } from "react";
import { backendConfig, type BackendConfig } from "../config/backend";

type Props = {
  children: ReactNode;
};

const initialValues = {
  ...backendConfig,
};

export const ConfigContext = createContext<BackendConfig>(initialValues);

export function ConfigProvider({ children }: Props) {
  if (!initialValues.apiHost) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_URL env variable is not defined!");
  }

  return (
    <ConfigContext.Provider value={initialValues}>
      {children}
    </ConfigContext.Provider>
  );
}
