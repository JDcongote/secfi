import React, {ChangeEvent} from 'react';
import {Component} from 'react';
import styled, {css} from 'styled-components';
import {colors} from '@styles/_colors';
import {defaultPadding, defaultSpacing} from '@styles/_layout';
import CurrencyFlag from '@components/currency-flag/currency-flag';
import CurrencyService from '@services/currency-service';
import AutoComplete from '@components/autocomplete/autocomplete';
import {Currency} from '@/app/typings';
import {Flex} from '@chakra-ui/react';
import getSymbolFromCurrency from 'currency-symbol-map';

// #region STYLES ------------------------------------------
const Widget = styled.div`
  max-width: 200px;
  border: 1px solid ${colors.light};
  border-radius: ${defaultPadding(0.3)};
  padding: ${defaultPadding(0.5)};
`;

const Input = styled.input`
  text-transform: uppercase;
  font-weight: bold;
  color: ${colors.brand.dark};
  min-width: 4ch;
  background-color: ${colors.brand.lightest};
  outline-color: ${colors.function.successDark};
  border-radius: ${defaultPadding(0.3)};
  padding: ${defaultPadding(0.3)};
  transition: all 300ms;
  ${(props: {valueText: string}) =>
    css`
      width: ${props.valueText.length + 1}ch;
    `};
`;

const CurrencyIcon = styled.span`
  font-weight: bold;
  color: ${colors.brand.mid};
  margin-right: ${defaultSpacing};
`;
// #endregion STYLES ------------------------------------------

/**
 * this component draws the widget allowing the user to choose a currency and set an amount for said currency
 */
interface State {
  currency: Currency;
  amount: string;
}
interface Props {
  onSelectCurrency: (currency: Currency) => void;
  onChangeAmount: (amount: number) => void;
  default: string;
}
export class CurrencyWidget extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currency: {name: 'Euro', code: 'EUR'},
      amount: this.props.default,
    };
    // bind functions in constructor to avoid creating a new function everytime render is called
    this.handleSelectCurrency = this.handleSelectCurrency.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  private handleSelectCurrency(currency: Currency) {
    this.setState({
      currency,
    });
    this.props.onSelectCurrency(currency);
  }

  private handleChange(event: ChangeEvent<HTMLInputElement>) {
    const amount = event.target.value ? event.target.value : '0';
    this.setState({
      amount,
    });
    // only emit non NaNs
    amount && this.props.onChangeAmount(parseFloat(amount));
  }

  render(): React.ReactNode {
    return (
      <Widget>
        <Flex align="center">
          <CurrencyFlag currency={this.state?.currency.code}></CurrencyFlag>
          <AutoComplete
            suggestions={CurrencyService.getCurrencies()}
            onSelectCurrency={this.handleSelectCurrency}
          />
        </Flex>
        <Flex align="center" padding={defaultPadding(0.5)} justify="center">
          <CurrencyIcon>{getSymbolFromCurrency(this.state?.currency.code)}</CurrencyIcon>
          <Input
            type="number"
            placeholder={this.state.amount}
            valueText={this.state.amount}
            onChange={this.handleChange}
          />
        </Flex>
      </Widget>
    );
  }
}
