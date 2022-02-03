import React from 'react';
import styled from 'styled-components';
import {colors} from '../../common-styles/_colors';
import {defaultPadding} from '@styles/_layout';
import flags from './flags';

const getCurrencyImage = (ccy: string) => flags[ccy.toLowerCase()] || flags.unknown;

// #region STYLES ------------------------------------------
const CurrencyFlagSC = styled.div<{currency: string}>`
  background-image: url('${({currency}) => getCurrencyImage(currency)}');
  width: ${defaultPadding(3)};
  height: ${defaultPadding(2)};
  border-radius: 10rem;
  background-position: center;
  background-size: cover;
  box-shadow: inset 0px 0px 7px 0px ${colors.light};
`;
// #endregion STYLES ------------------------------------------

/**
 * This component draws the flag of the country specified by the currency
 * @param param0
 * @returns
 */
const CurrencyFlag: React.FC<{currency: string}> = ({currency}) => {
  return <CurrencyFlagSC currency={currency}></CurrencyFlagSC>;
};

export default CurrencyFlag;
