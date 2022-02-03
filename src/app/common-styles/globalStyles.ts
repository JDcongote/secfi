import {createGlobalStyle} from 'styled-components';
import {flex, respondTo} from '@styles/_layout';
import {colors} from './_colors';

const GlobalStyle = createGlobalStyle`
html {
  height: 100vh;
  width: 100vw;
  font-size: 16px;

  ${respondTo.xs`
    font-size: 10px;
  `}

  body {
    height: 100vh;
  width: 100vw;
    margin: 0;
    font-family: Inter;
    color: ${colors.dark};
    display: grid;
    background: ${colors.light};
    grid-template-rows: 100px 1fr 100px;
    ${flex.flex}
    flex-direction: column;
    overflow-x: hidden;
    .recharts-yAxis{
      .recharts-cartesian-axis-ticks{
        g:first-child {
          display: none;
        }
      }
    }
    .recharts-reference-line{
      .recharts-text {
        font-weight: bold;
      }
    }
  }
}

  /* Firefox-only */
  * {
    scrollbar-width: thin;
    scrollbar-color: #979ba0 #cecfd0;
  }

  /* Chrome/Edge/Safari */
  *::-webkit-scrollbar {
    width: 6px;
  }
  *::-webkit-scrollbar-track {
    background: #cecfd0;
    border-radius: 5px;
  }
  *::-webkit-scrollbar-thumb {
    background: #979ba0;
    border-radius: 5px;
    border: none;
  }
`;

export default GlobalStyle;
