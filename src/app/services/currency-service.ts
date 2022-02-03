import http, {baseHost} from '@services/http-service';
import {AxiosResponse} from 'axios';
import {
  Currency,
  Dictionary,
  ExchangeRateResponse,
  HistoryItem,
  HistoryResponse,
  Tree,
} from '../typings';
import CurrencyList from '../data/currency_list';

/**
 * Since alpha vantage has one the most awful API response JSON models, these keys are used to sanitized the response
 */
const DataModel: Dictionary<string> = {
  'Realtime Currency Exchange Rate': 'exchangeRate',
  '1. From_Currency Code': 'fromCurrencyCode',
  '2. From_Currency Name': 'fromCurrencyName',
  '3. To_Currency Code': 'toCurrencyCode',
  '4. To_Currency Name': 'toCurrencyName',
  '5. Exchange Rate': 'exchangeRate',
  '6. Last Refreshed': 'lastRefreshed',
  '7. Time Zone': 'timeZone',
  '6. Time Zone': 'timeZone',
  '8. Bid Price': 'bid',
  '9. Ask Price': 'ask',
  'Meta Data': 'metadata',
  '1. Information': 'info',
  '2. From Symbol': 'fromSymbol',
  '3. To Symbol': 'toSymbol',
  '4. Output Size': 'outputSize',
  '5. Last Refreshed': 'lastRefreshed',
  'Time Series FX (Daily)': 'timeSeriesDaily',
  '1. open': 'open',
  '2. high': 'high',
  '3. low': 'low',
  '4. close': 'close',
  'Error Message': 'errorMessage',
  Note: 'errorMessage',
};

/**
 * Gets an exchange rate
 * @param fromCurrency
 * @param toCurrency
 * @returns
 */
const get = (fromCurrency: string, toCurrency: string): Promise<ExchangeRateResponse> => {
  return http
    .get<JSON>(baseHost, {
      params: {
        function: 'CURRENCY_EXCHANGE_RATE',
        from_currency: fromCurrency,
        to_currency: toCurrency,
      },
    })
    .then((response: AxiosResponse) => sanitize<ExchangeRateResponse>(response));
};

/**
 * Gets the exchange rate history
 * @param fromCurrency
 * @param toCurrency
 * @returns
 */
const getHistory = (fromCurrency: string, toCurrency: string): Promise<HistoryResponse> => {
  return http
    .get<JSON>(baseHost, {
      params: {
        function: 'FX_DAILY',
        from_symbol: fromCurrency,
        to_symbol: toCurrency,
      },
    })
    .then((response: AxiosResponse) => sanitize<HistoryResponse>(response))
    .then((history: HistoryResponse) => cleanHistory(history));
};

/**
 * Returns a list of physical currencies
 * @returns
 */
const getCurrencies = (): Currency[] => {
  return CurrencyList;
};

/**
 * Sanitize the weird response the AlphaVantage api gives
 * @param response
 */
const sanitize = <T>(response: AxiosResponse): T => {
  let sanitizedData = {};
  if (response.data) {
    sanitizedData = cleanData(response.data);
  }
  return sanitizedData as T;
};

/**
 * Convert the per date object into an array
 * @param history
 * @returns
 */
const cleanHistory = (history: HistoryResponse): HistoryResponse => {
  const cleanData: HistoryItem[] = [];
  const data: Dictionary<HistoryItem> = history?.timeSeriesDaily! as Dictionary<HistoryItem>;
  if (data) {
    Object.keys(data).forEach((key: string) => {
      const item: HistoryItem = data[key];
      cleanData.push({
        date: key,
        close: item.close,
        high: item.high,
        low: item.low,
        open: item.open,
      });
    });
    history.timeSeriesDaily = cleanData;
  }

  return history;
};

/**
 * Recursive function to sanitize a response tree
 * @param data
 * @returns Tree<string>: sanitized data
 */
const cleanData = (data: any): Tree<string> => {
  if (data && typeof data === 'object') {
    const sanitizedData: Tree<string> = {};
    Object.keys(data).forEach((value: string) => {
      const key = DataModel[value] ? DataModel[value] : value;
      sanitizedData[key] = cleanData(data[value]);
    });
    return sanitizedData;
  } else {
    return data;
  }
};

const CurrencyService = {
  get,
  getHistory,
  getCurrencies,
};

export default CurrencyService;
