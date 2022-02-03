import React from 'react';
import styled, {css} from 'styled-components';

// #region STYLES ------------------------------------------
const Icon = styled.i.attrs(() => ({className: 'material-icons'}))`
  &&& {
    ${(props: {fontSize: number}) =>
      props.fontSize &&
      css`
        font-size: ${props.fontSize};
      `};
  }
`;
// #endregion STYLES ------------------------------------------

/**
 * Given a passed string returns an icon
 * @param {iconName: string; fontSize: number}
 * @returns
 */
const MaterialIcon: React.FC<{iconName: string; fontSize: number}> = ({iconName, fontSize}) => {
  return <Icon fontSize={fontSize}>{iconName}</Icon>;
};

export default MaterialIcon;
