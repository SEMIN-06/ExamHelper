import styled from 'styled-components';

export const PrintWrapper = styled.div<{
  zoomLevel: number;
  isDarkMode: boolean;
}>`
  display: flex;
  justify-content: center;
  padding: 2rem;
  background-color: #2c2c2c;
  min-height: 100vh;
  zoom: ${(props) => props.zoomLevel}%;
`;

export const Page = styled.div<{ isDarkMode: boolean }>`
  width: 21cm;
  min-height: 29.7cm;
  background-color: ${(props) => (props.isDarkMode ? '#1e1e1e' : '#ffffff')};
  color: ${(props) => (props.isDarkMode ? '#d9d9d9' : '#2D2D2D')};
  padding: 2rem 2rem;
  border-radius: 8px;
  box-shadow: ${(props) =>
    props.isDarkMode
      ? '0 0 0 1px rgba(255,255,255,0.1)'
      : 'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px'};

  @media print {
    padding: 0.5cm;
    border-radius: 0;
    box-shadow: none;
  }
`;

export const Text = styled.div<{ isDarkMode: boolean }>`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
    sans-serif;
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 1.5rem;

  .subject {
    font-weight: 600;
    font-size: 1.1em;
    margin-bottom: 0.5rem;
    color: ${(props) => (props.isDarkMode ? '#E0E0E0' : '#2D2D2D')};
  }

  .meaning {
    color: ${(props) => (props.isDarkMode ? '#E0E0E0' : '#2D2D2D')};
    font-size: 0.95em;
  }

  .content {
    margin-top: 0.5rem;
    padding-left: 1rem;
    border-left: 2px solid
      ${(props) => (props.isDarkMode ? '#404040' : '#D1D1D1')};
  }

  img {
    max-width: 100%;
    border-radius: 4px;
    margin: 1rem 0;
  }

  .line-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${(props) => (props.isDarkMode ? '#404040' : '#D1D1D1')};
    color: ${(props) => (props.isDarkMode ? '#B4B4B4' : '#4A4A4A')};
    font-size: 12px;
    margin-right: 8px;
    font-weight: 500;
  }

  .highlight {
    background-color: ${(props) => (props.isDarkMode ? '#FFD54F' : '#FFE082')};
    color: ${(props) => (props.isDarkMode ? '#2C2C2C' : '#2D2D2D')};
    padding: 1px 3px;
    border-radius: 5px;
  }
`;

export const Controls = styled.div<{ isDarkMode: boolean }>`
  position: fixed;
  top: 10%;
  right: 5%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: ${(props) => (props.isDarkMode ? '#2D2D2D' : '#ffffff')};
  padding: 1rem;
  border-radius: 8px;
  box-shadow: ${(props) =>
    props.isDarkMode
      ? '0 0 0 1px rgba(255,255,255,0.1)'
      : 'rgba(15, 15, 15, 0.1) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 2px 4px'};

  button {
    padding: 8px 12px;
    border: none;
    border-radius: 4px;
    background: ${(props) => (props.isDarkMode ? '#404040' : '#F0F0F0')};
    color: ${(props) => (props.isDarkMode ? '#E0E0E0' : '#37352F')};
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    width: 120px;
    text-align: left;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
      background: ${(props) => (props.isDarkMode ? '#505050' : '#E8E8E8')};
    }

    &.primary {
      background: #2e8aff;
      color: white;
      &:hover {
        background: #1a7aff;
      }
    }
  }
`;

export const PageTitle = styled.h1<{ isDarkMode: boolean }>`
  color: ${(props) => (props.isDarkMode ? '#E0E0E0' : '#2D2D2D')};
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;
