
export interface ClientStats {
  id: string
  name: string
  descriptionHtml: string
  locations: Array<Location>
  nLastTotalTransactions: number
  lastTotalTransactionsReportDate: Date
  transactionsRatePerSec: number
}

export interface Location {
  name: string
  isDeployed: boolean
  coordinates: Coordinates
}

export interface Coordinates {
  lat: number
  lon: number
}

export type Data = Record<string, ClientStats>
