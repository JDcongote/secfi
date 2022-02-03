import {RefObject, useEffect, useRef} from 'react';
import React from 'react';

/**
 * Detects wether the body is clicked to hide selects or dialogs
 * @param {onModalClick: () => void}
 * @returns
 */
const ModalClick: React.FC<{onModalClick: () => void}> = ({onModalClick}) => {
  const useOutsideAlerter = (ref: RefObject<HTMLDivElement>) => {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent): any {
        if (ref.current && !ref.current.contains(event.target as Node) && onModalClick) {
          // allow possible events to run before firing the modal one.
          setTimeout(() => {
            onModalClick();
          }, 100);
        }
        return true;
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
  };
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef);
  return <div ref={wrapperRef}></div>;
};

export default ModalClick;
