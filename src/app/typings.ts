/**
 * Represents an exchange rate information object
 */
export interface ExchangeRateModel {
  fromCurrencyCode?: string;
  fromCurrencyName?: string;
  toCurrencyCode?: string;
  toCurrencyName?: string;
  exchangeRate?: string;
  lastRefreshed?: string;
  timeZone?: string;
  bid?: string;
  ask?: string;
}

/**
 * Represents a data history point
 */
export interface HistoryItem {
  date?: string;
  dateObject?: Date;
  close: number;
  high: number;
  low: number;
  open: number;
}

/**
 * Represents a currency
 */
export interface Currency {
  name: string;
  code: string;
}

/**
 * Represents a response object for exchange rates from alpha vantage
 */
export interface ExchangeRateResponse {
  exchangeRate: ExchangeRateModel;
  errorMessage?: string;
}

/**
 * Represents a response object for DAILY_FX from alpha vantage
 */
export interface HistoryResponse {
  metadata: {
    timeZone: string;
    fromSymbol: string;
    info: string;
    lastRefreshed: string;
    outputSize: string;
    toSymbol: string;
  };
  errorMessage?: string;
  timeSeriesDaily: Dictionary<HistoryItem> | HistoryItem[];
}

/**
 * Basic tree type
 */
export type Tree<T> = {
  [key: string]: Tree<T>;
};

/**
 * Basic dictionary type
 */
export type Dictionary<T> = {
  [key: string]: T;
};
