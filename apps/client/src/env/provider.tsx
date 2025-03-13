import { createContext, ReactNode, useEffect, useState } from 'react';
import {Env, schema} from "../env/type.ts";

const ENV_FILE = "env.json"

export const loadEnv = async (baseUrl?: string): Promise<Env> => {
  const response = await fetch(`${baseUrl ?? ''}/${ENV_FILE}`)
  const config = await response.json()
  return schema.parse(config)
}

export type EnvProviderProps = {
  children: ReactNode;
  onLoad?: (config: Env) => void | Promise<void>;
};

export const EnvContext = createContext<Env | undefined>(undefined);

export function EnvProvider(props: Readonly<EnvProviderProps>) {
  const { onLoad } = props;
  const [config, setEnv] = useState<Env | undefined>(undefined);
  useEffect(() => {
    (async () => {
      const c = await loadEnv();
      await onLoad?.(c);
      setEnv(c);
    })();
  }, [onLoad, setEnv]);

  if (!config) {
    return null;
  }
  return <EnvContext.Provider value={config}>{props.children}</EnvContext.Provider>;
}
