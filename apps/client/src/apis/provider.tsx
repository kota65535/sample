import {createContext, ReactNode, useEffect, useState} from "react";
import {useEnv} from "../env/hook.ts";
import {ApiClients} from "./types.ts";
import {hc} from "hono/client";
import {AppType} from "@sample/server/src";

export const initServerClient = (baseUrl: string) => {
    return hc<AppType>(baseUrl)
}

export const ApiClientsContext = createContext<ApiClients | undefined>(undefined);

export function ApiClientProvider(props: {children: ReactNode}) {
    const env = useEnv();
    const [client, setClient] = useState<ApiClients | undefined>(undefined);
    useEffect(() => {
        const server = initServerClient(env.SERVER_API_URL);
        setClient({
            server
        });
    }, [client]);

    if (!client) {
        return null;
    }
    return <ApiClientsContext.Provider value={client}>{props.children}</ApiClientsContext.Provider>
}
