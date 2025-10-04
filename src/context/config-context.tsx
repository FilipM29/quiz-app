import { createContext } from 'react';
import { backendConfig, type BackendConfig } from '../config/backend';

const initialValues = {
  ...backendConfig
};

export const ConfigContext = createContext<BackendConfig>(initialValues);
