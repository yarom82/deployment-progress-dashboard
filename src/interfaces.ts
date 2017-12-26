
export interface ClientStats {
  id: string
  name: string
  nLocations: number
  nDeployedLocations: number
}

export type Data = Record<string, ClientStats>
