import { createContext, ReactNode, useEffect, useState } from 'react';
import { Env, loadEnv } from './index.ts';

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
