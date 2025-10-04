import { type ReactNode } from 'react';
import { backendConfig } from '../../config/backend';
import { ConfigContext } from '../../context/config-context';

type Props = {
  children: ReactNode;
};

const initialValues = {
  ...backendConfig
};

export function ConfigProvider({ children }: Props) {
  if (!initialValues.apiHost) {
    throw new Error('VITE_BACKEND_API_HOST env variable is not defined!');
  }

  return (
    <ConfigContext.Provider value={initialValues}>
      {children}
    </ConfigContext.Provider>
  );
}
