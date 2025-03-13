import { useContext } from 'react'
import { ApiClients } from "./types";
import { ApiClientsContext } from "./provider";

export function useApiClient(name: keyof ApiClients) {

  const clients = useContext(ApiClientsContext)
  if (!clients) {
    throw new Error('useApiClient must be used within a ApiClientsProvider')
  }
  return clients[name]
}
