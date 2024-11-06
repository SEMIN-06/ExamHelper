import styled from 'styled-components';
import { Text } from './CommonStyles';

export const EditableText = styled(Text)`
  .editable {
    display: inline-block;
    white-space: nowrap;
    padding: 0 2px;
    margin: 0 2px;
    border-radius: 3px;
    background: ${(props) =>
      props.isDarkMode
        ? 'rgba(128, 128, 128, 0.1)'
        : 'rgba(128, 128, 128, 0.4)'};
    transition: all 0.2s;
    position: relative;

    &:focus {
      outline: none;
      background: ${(props) =>
        props.isDarkMode
          ? 'rgba(128, 128, 128, 0.2)'
          : 'rgba(128, 128, 128, 0.5)'};
    }

    &[data-ctrl]:before {
      position: absolute;
      background: rgb(0, 0, 0);
      border-radius: 5px;
      content: '';
      visibility: hidden;
      color: white;
    }

    &[data-ctrl]:focus:before {
      content: attr(data-ctrl);
      visibility: visible;
    }

    &[data-hover]:before {
      content: attr(data-hover);
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      background: ${(props) => (props.isDarkMode ? '#404040' : '#37352F')};
      color: ${(props) => (props.isDarkMode ? '#E0E0E0' : '#FFFFFF')};
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s;
      z-index: 1;
    }

    &[data-hover]:hover:before {
      content: attr(data-hover);
      opacity: 1;
      visibility: visible;
    }
  }
`;
