import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  @import url(https://cdn.jsdelivr.net/gh/theeluwin/NotoSansKR-Hestia@master/stylesheets/NotoSansKR-Hestia.css);

  * {
    font-family: 'Noto Sans Korean';
    font-weight: 400;

    margin: 0;
    padding: 0;
  }

  *::-webkit-scrollbar {
    width: 10px;
  }

  *::-webkit-scrollbar-thumb {
    background: #1d1d1d;
    background-clip: padding-box;
    border: 1px solid transparent;
    border-radius: 10px;
  }

  *::-webkit-scrollbar-track {
    background: transparent;
  }

  ::selection {
    background: #5e5e5e;
  }

  body {
    background-color: #2C2C2C;
    overflow: hidden;
  }

`;
