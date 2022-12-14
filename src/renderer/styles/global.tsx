import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.6/dist/web/static/pretendard-dynamic-subset.css");

  @font-face {
    font-family: 'SeoulNamsanC';
    font-weight: 300;
    font-style: normal;
    src: url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCLight.eot');
    src: url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCLight.eot?#iefix') format('embedded-opentype'),
        url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCLight.woff2') format('woff2'),
        url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCLight.woff') format('woff'),
        url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCLight.ttf') format("truetype");
    font-display: swap;
  }
  @font-face {
      font-family: 'SeoulNamsanC';
      font-weight: 500;
      font-style: normal;
      src: url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCMedium.eot');
      src: url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCMedium.eot?#iefix') format('embedded-opentype'),
          url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCMedium.woff2') format('woff2'),
          url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCMedium.woff') format('woff'),
          url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCMedium.ttf') format("truetype");
      font-display: swap;
  }
  @font-face {
      font-family: 'SeoulNamsanC';
      font-weight: 700;
      font-style: normal;
      src: url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCBold.eot');
      src: url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCBold.eot?#iefix') format('embedded-opentype'),
          url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCBold.woff2') format('woff2'),
          url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCBold.woff') format('woff'),
          url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCBold.ttf') format("truetype");
      font-display: swap;
  }
  @font-face {
      font-family: 'SeoulNamsanC';
      font-weight: 800;
      font-style: normal;
      src: url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCExtraBold.eot');
      src: url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCExtraBold.eot?#iefix') format('embedded-opentype'),
          url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCExtraBold.woff2') format('woff2'),
          url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCExtraBold.woff') format('woff'),
          url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCExtraBold.ttf') format("truetype");
      font-display: swap;
  }
  @font-face {
      font-family: 'SeoulNamsanC';
      font-weight: 900;
      font-style: normal;
      src: url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCBlack.eot');
      src: url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCBlack.eot?#iefix') format('embedded-opentype'),
          url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCBlack.woff2') format('woff2'),
          url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCBlack.woff') format('woff'),
          url('https://cdn.jsdelivr.net/gh/webfontworld/seoulnamsan/SeoulNamsanCBlack.ttf') format("truetype");
      font-display: swap;
  }

  * {
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
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
    font-weight: 400;

    background-color: #2C2C2C;
    overflow: hidden;
  }

  b {
    font-weight: 900 !important;

    i {
      font-weight: 900 !important;
    }

    span {
      font-weight: 900 !important;
    }
  }

  u {
    span {
      text-decoration: underline !important;
    }
  }

  .Toastify__toast-body {
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif !important;
    font-weight: 400;
  }

`;
