import React from 'react';
import styled from 'styled-components';
import {colors} from '@styles/_colors';
import {Currency, ExchangeRateModel} from '@/app/typings';
import {defaultPadding} from '@styles/_layout';
import {Alert, AlertIcon, AlertTitle, Flex} from '@chakra-ui/react';
import {fadeIn, fadeOut} from '../../common-styles/_animations';
import Loader from '../utils/loader';

// #region STYLES ------------------------------------------
const ExchangeRateDiv = styled.div`
  width: 100%;
  padding: ${defaultPadding(1)};
  background-color: ${colors.function.successLight};
  color: ${colors.dark};
  border-radius: 10rem;
  animation: ${(props: {active: boolean}) => (props.active ? fadeIn : fadeOut)} 300ms linear;
`;

const CurrencyB = styled.b`
  margin-right: ${defaultPadding(0.5)};
`;

const Equals = styled.span`
  margin: 0 ${defaultPadding(1)};
  font-weight: bold;
`;
// #endregion STYLES ------------------------------------------

/**
 * This component draws the specified exchange rate
 */
interface Props {
  exchangeRate: ExchangeRateModel;
  fromAmount: number;
  toAmount: number;
  defaultCurrency: Currency;
  loading: boolean;
  error?: boolean;
}
const ExchangeRate: React.FC<Props> = (props: Props) => {
  const content = (
    <Flex justify="center" align="center">
      <Flex justify="space-between">
        <CurrencyB>{props.fromAmount} </CurrencyB>
        {props.exchangeRate.fromCurrencyCode
          ? props.exchangeRate.fromCurrencyCode
          : props.defaultCurrency.code}
      </Flex>
      <Equals>=</Equals>
      <Flex justify="space-between">
        <CurrencyB>{props.toAmount}</CurrencyB>
        {props.exchangeRate.toCurrencyCode
          ? props.exchangeRate.toCurrencyCode
          : props.defaultCurrency.code}
      </Flex>
    </Flex>
  );
  if (props.loading) {
    return (
      <ExchangeRateDiv
        active={props.fromAmount ? true : false}
        key={props.fromAmount + props.fromAmount}>
        <Loader width={50} height={50} type="ring"></Loader>
      </ExchangeRateDiv>
    );
  } else if (!props.error || !props.exchangeRate) {
    return (
      <ExchangeRateDiv
        active={props.fromAmount ? true : false}
        key={props.fromAmount + props.fromAmount}>
        {content}
      </ExchangeRateDiv>
    );
  } else {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Error fetching Exchange Rate</AlertTitle>
      </Alert>
    );
  }
};

export default ExchangeRate;
