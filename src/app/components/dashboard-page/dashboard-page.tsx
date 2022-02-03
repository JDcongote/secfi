import {defaultPadding, headerHeight, respondTo, smallHeaderHeight} from '@styles/_layout';
import {
  Currency,
  ExchangeRateModel,
  ExchangeRateResponse,
  HistoryItem,
  HistoryResponse,
} from '@/app/typings';
import {Flex} from '@chakra-ui/react';
import CurrencyService from '@services/currency-service';
import React from 'react';
import {Component} from 'react';
import {Graph} from '@components/graph/graph';
import ExchangeRate from '@components/exchange-rate/exchange-rate';
import {CurrencyWidget} from '@components/currency-widget/currency-widget';
import MaterialIcon from '../utils/material.icon';
import {colors} from '../../common-styles/_colors';
import styled from 'styled-components';

// #region STYLES ------------------------------------------
const Icon = styled.span`
  i {
    font-weight: bold;
    color: ${colors.dark};
    opacity: 0.7;
  }
`;

const MainContainer = styled(Flex)`
  &&& {
    ${respondTo.xs`
    width: 600px;
    height: calc(100vh - ${smallHeaderHeight});
    margin: 0 auto;
    background: ${colors.white}
  `}
    height: calc(100vh - ${headerHeight});
    background: linear-gradient(180deg, ${colors.white} 0%, ${colors.brand.lightest} 100%);
  }
`;

const WidgetContainer = styled(Flex)`
  &&& {
    margin: ${defaultPadding(1)} 0 ${defaultPadding(2)} 0;
    ${respondTo.xs`
    justify-content: space-evenly;  
  `}
  }
`;

const ExchangeRateContainer = styled.div`
  margin-bottom: ${defaultPadding(2)};
  align-self: center;
  width: 100%;
  display: flex;
  justify-content: center;
`;
// #rendegion STYLES ------------------------------------------

/**
 * Main page of the app
 */
interface State {
  exchangeRate: ExchangeRateModel;
  exchangeRateHistory: HistoryItem[];
  fromCurrencyAmount: number;
  toCurrencyAmount: number;
  loadingRate?: boolean;
  loadingHistory?: boolean;
  exchangeRateError?: boolean;
  historyError?: boolean;
}
export class Dashboard extends Component<{}, State> {
  fromCurrency: Currency = {name: 'Eur', code: 'EUR'};
  toCurrency: Currency = {name: 'Eur', code: 'EUR'};
  fromAmount: number = 100;
  toAmount: number = 100;

  constructor(props: {}) {
    super(props);
    this.state = {
      exchangeRate: {exchangeRate: '1'},
      exchangeRateHistory: [],
      fromCurrencyAmount: 100,
      toCurrencyAmount: 100,
    };
    // bind functions in constructor to avoid creating a new function everytime render is called
    this.onSelectFromCurrency = this.onSelectFromCurrency.bind(this);
    this.onSelectToCurrency = this.onSelectToCurrency.bind(this);
    this.onChangeFromAmount = this.onChangeFromAmount.bind(this);
    this.onChangeToAmount = this.onChangeToAmount.bind(this);
  }
  componentDidMount() {
    this.fetchExchangeRate();
  }
  private onSelectFromCurrency(currency: Currency) {
    this.fromCurrency = currency;
    this.fetchExchangeRate();
  }
  private onSelectToCurrency(currency: Currency) {
    this.toCurrency = currency;
    this.fetchExchangeRate();
  }

  private onChangeFromAmount(amount: number) {
    this.fromAmount = amount;
    const rate = parseFloat(this.state.exchangeRate.exchangeRate!);
    let newToAmount = rate ? rate * amount : 1 * amount;
    if (rate === 1) {
      newToAmount = amount;
    }
    this.setState({
      fromCurrencyAmount: amount,
      toCurrencyAmount: parseFloat(newToAmount.toFixed(6)),
    });
  }
  private onChangeToAmount(amount: number) {
    this.toAmount = amount;
    const rate = parseFloat(this.state.exchangeRate.exchangeRate!);
    let newFromAmount = rate ? (1 / rate) * amount : 1 * amount;
    if (rate === 1) {
      newFromAmount = amount;
    }
    this.setState({
      toCurrencyAmount: amount,
      fromCurrencyAmount: parseFloat(newFromAmount.toFixed(6)),
    });
  }

  private fetchExchangeRate() {
    if (this.fromCurrency && this.toCurrency && this.fromCurrency.code != this.toCurrency.code) {
      this.setState({
        loadingRate: true,
        loadingHistory: true,
        historyError: false,
        exchangeRateError: false,
      });
      //fetch exchange rate
      CurrencyService.get(this.fromCurrency.code, this.toCurrency.code).then(
        (data: ExchangeRateResponse) => {
          if (!data.errorMessage) {
            this.setState({
              exchangeRate: data.exchangeRate,
              loadingRate: false,
            });
            this.onChangeFromAmount(this.fromAmount);
          } else {
            this.setState({
              loadingRate: false,
              exchangeRateError: true,
            });
          }
        }
      );
      //fetch history
      CurrencyService.getHistory(this.fromCurrency.code, this.toCurrency.code).then(
        (response: HistoryResponse) => {
          if (!response.errorMessage) {
            this.setState({
              exchangeRateHistory: response.timeSeriesDaily as HistoryItem[],
              loadingHistory: false,
            });
          } else {
            this.setState({
              loadingHistory: false,
              historyError: true,
            });
          }
        }
      );
    }
  }
  render(): React.ReactNode {
    return (
      <MainContainer
        w="100%"
        p={defaultPadding(1)!}
        height="100%"
        position="relative"
        direction="column"
        justify="space-between">
        <WidgetContainer direction="row" align="center" justify="space-between">
          <CurrencyWidget
            onSelectCurrency={this.onSelectFromCurrency}
            onChangeAmount={this.onChangeFromAmount}
            default="100"></CurrencyWidget>
          <Icon>
            <MaterialIcon iconName="sync_alt" fontSize={20}></MaterialIcon>
          </Icon>
          <CurrencyWidget
            onSelectCurrency={this.onSelectToCurrency}
            onChangeAmount={this.onChangeToAmount}
            default="100"></CurrencyWidget>
        </WidgetContainer>
        <ExchangeRateContainer>
          <ExchangeRate
            loading={this.state.loadingRate!}
            error={this.state.exchangeRateError}
            exchangeRate={this.state.exchangeRate}
            fromAmount={this.state.fromCurrencyAmount}
            toAmount={this.state.toCurrencyAmount}
            defaultCurrency={this.fromCurrency}></ExchangeRate>
        </ExchangeRateContainer>

        <Graph
          data={this.state.exchangeRateHistory}
          loading={this.state.loadingHistory!}
          error={this.state.historyError}></Graph>
      </MainContainer>
    );
  }
}
