import React, {ChangeEvent, FocusEventHandler, Ref, RefObject, useEffect, useRef} from 'react';
import {useState} from 'react';
import {Flex, UnorderedList} from '@chakra-ui/react';
import styled, {css} from 'styled-components';
import {defaultPadding, defaultSpacing, flex, respondTo} from '@styles/_layout';
import {Currency} from '@/app/typings';
import {colors} from '@styles/_colors';
import ModalClick from '../utils/modalClick';

// #region STYLES ------------------------------------------
const ListItem = styled.li`
  padding: ${defaultSpacing};

  /* if list item is active change the background*/
  ${(props: {active: boolean}) =>
    props.active &&
    css`
      background: ${colors.light};
    `};
`;

const List = styled(UnorderedList)`
  &&& {
    position: absolute;
    left: 0;
    top: 80px;
    width: 100vw;
    background: white;
    z-index: 999;
    border: 2px solid #e8e8e8;
    ${respondTo.xs`
      width:600px; 
  `}
  }
`;

const Input = styled.input`
  text-transform: uppercase;
  font-weight: bold;
  color: ${colors.dark};
  width: 4rem;
  margin-left: ${defaultSpacing};
  background-color: ${colors.brand.lightest};
  border-radius: ${defaultPadding(0.3)};
  transition: all 300ms;
  text-align: center;
  outline-color: ${colors.function.successDark};
  padding: ${defaultPadding(0.3)};
  ${(props: {active: boolean}) =>
    props.active &&
    css`
      //transform: translateX(-50%);
      // width: 90vw;
    `};
`;
// #endregion STYLES ------------------------------------------

/**
 * This component takes a list of suggestions that is then filtered based on user input
 * @param suggestions: Currency[]; props
 * @returns
 */
const AutoComplete: React.FC<{
  suggestions: Currency[];
  onSelectCurrency: (currency: Currency) => void;
}> = ({suggestions, onSelectCurrency}) => {
  /**
   * Hooks
   */
  // main value of input
  const [value, setValue] = useState<string>('');
  // wether the input is active or not
  const [active, setActive] = useState<boolean>(false);
  // controls when the suggestion list appears
  const [showList, setShowList] = useState<boolean>(false);
  // filtered list based on user input
  const [filteredList, setFilteredList] = useState<Currency[]>([]);
  // controls the active suggestion in the list, for keyboard navigation of list
  const [activeItemIndex, setActiveItemIndex] = useState<number>(0);

  /**
   * Filters the passed array of suggestions against the user input
   * @param event
   */
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target?.value);
    showHideList(event.target?.value, true);
  };

  /**
   * handleKeyDown to allow keyboard navigation
   * @param event
   */
  const handleKeyDown = (event: any) => {
    switch (event.key) {
      case 'ArrowDown':
        const index = activeItemIndex + 1;
        const newIndex = filteredList.length - 1 < index ? 0 : index;
        setActiveItemIndex(newIndex);
        break;
      case 'ArrowUp':
        const indexUp = activeItemIndex - 1;
        const newIndexUp = indexUp < 0 ? filteredList.length - 1 : indexUp;
        setActiveItemIndex(newIndexUp);
        break;
      case 'Enter':
        setActive(false);
        setValue(suggestions[activeItemIndex].code);
        showHideList(value, false);
        break;
    }
  };

  /**
   * depending on the passed value of hide show/hides list
   * @param value
   * @param hide
   */
  const showHideList = (value: string, show: boolean): void => {
    const filteredListValue = value ? filterSuggestions(suggestions, value) : suggestions;
    setActiveItemIndex(0);
    setFilteredList(filteredListValue);
    setShowList(show);
    setActive(show);
  };

  /**
   * handle "button" input click to convert it to an input
   * @param event
   */
  const handleClick = () => {
    setActive(true);
    setShowList(true);
  };

  /**
   * selects the passed item, comes from the list of suggestions
   * @param item
   */
  const handleItemClick = (item: Currency) => {
    setFilteredList([]);
    setValue(item.code);
    setActiveItemIndex(0);
    setShowList(false);
    onSelectCurrency && onSelectCurrency(item);
  };

  /**
   * Hides the list when the modal is clicked, ie: outside of the list
   */
  const handleModalClick = () => {
    showHideList(value, false);
  };

  /**
   * Select text on focus, better usability
   * @param event
   */
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  /**
   * Based on the user input filter the prop passed suggestion list
   * @param suggestions
   * @param value
   * @returns
   */
  const filterSuggestions = (suggestions: Currency[], value: string): Currency[] => {
    return suggestions.filter(
      (item: Currency) =>
        item.code.toLowerCase().indexOf(value.toLowerCase()) > -1 ||
        item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  };

  /**
   * Inner component to represent a filtered suggestion list
   * @returns
   */
  const AutocompleteList = () => {
    return (
      <List margin={0} borderRadius="md" overflow="auto" maxHeight="40vh">
        <ModalClick onModalClick={handleModalClick}></ModalClick>
        {filteredList.map((item: Currency, i: number) => (
          <ListItem
            active={i === activeItemIndex}
            key={item.code}
            onClick={() => handleItemClick(item)}>
            {item.code} - {item.name}
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <React.Fragment>
      <Flex direction="column">
        <div>
          <Input
            placeholder="EUR"
            onChange={handleChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            value={value}
            onClick={handleClick}
            active={active}></Input>
        </div>
        {showList && value && <AutocompleteList />}
      </Flex>
    </React.Fragment>
  );
};

export default AutoComplete;
