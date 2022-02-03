import React from 'react';
import styled, {css} from 'styled-components';
import {colors} from '@styles/_colors';
import {
  defaultPadding,
  defaultSpacing,
  flex,
  headerHeight,
  respondTo,
  smallHeaderHeight,
} from '@styles/_layout';
import MaterialIcon from '@components/utils/material.icon';

// #region STYLES ------------------------------------------
const HeaderTag = styled.header`
  font-weight: bold;
  padding: ${defaultPadding(2)} ${defaultPadding()};
  width: 100%;
  height: ${headerHeight};
  // background: linear-gradient(90deg, ${colors.brand.dark} 0%, ${colors.brand.light} 100%);
  background: ${colors.brand.light};
  box-shadow: 0px 0px 16px 2px ${colors.brand.mid};
  color: ${colors.white};
  ${flex.flex};
  ${flex.centered_no_justify};
  overflow: hidden;
  position: relative;
  z-index: 1;
  ${respondTo.xs`
    height: ${smallHeaderHeight};
  `}
`;

const Icon = styled.span`
  i {
    font-weight: bold;
  }
  margin-right: ${defaultSpacing};
`;

const IconBackground = styled.span`
  transform: rotateZ(225deg);
  margin-right: ${defaultSpacing};
  position: absolute;
  right: -18px;
  opacity: 0.1;
`;
// #endregion STYLES ------------------------------------------

/**
 * Simple header
 * @param param0
 * @returns
 */
const Header: React.FC<{title: string}> = ({title}) => {
  return (
    <HeaderTag>
      <Icon>
        <MaterialIcon iconName="sync_alt" fontSize={20}></MaterialIcon>
      </Icon>
      <IconBackground>
        <MaterialIcon iconName="sync_alt" fontSize={220}></MaterialIcon>
      </IconBackground>

      {title}
    </HeaderTag>
  );
};

export default Header;
