import {css, FlattenSimpleInterpolation, SimpleInterpolation} from 'styled-components';
import {Dictionary} from '../typings';

export const flex = {
  flex: css`
    display: flex;
  `,
  centered: css`
    justify-content: center;
    align-items: center;
    text-align: center;
  `,
  centered_no_justify: css`
    align-items: center;
    text-align: center;
  `,
  row: css`
    flex-direction: row;
  `,
  column: css`
    flex-direction: column;
  `,
  fill: css`
    flex: 1;
  `,
  space: css`
    justify-content: space-evenly;
  `,
};

export const breakpoints: Dictionary<string> = {
  xs: '480px',
  sm: '768px',
  md: '992px',
  lg: '1200px',
};

export const defaultSpacing = '8px';
export const defaultPadding = (mult?: number) => {
  return mult ? `${mult}rem` : '1rem';
};
export const defaultSpacing_unitless = 8;
export const headerHeight = '100px';
export const smallHeaderHeight = '50px';

export const respondTo = Object.keys(breakpoints).reduce((accumulator: Dictionary<any>, label) => {
  accumulator[label] = (...args: [any]) => css`
    @media (min-width: ${breakpoints[label]}) {
      ${css(...args)};
    }
  `;
  return accumulator;
}, {});
