import styled from "styled-components";
import { Link } from 'react-router-dom';

import exitIcon from "../../../assets/svgs/x.svg";
import sizeIcon from "../../../assets/svgs/size.svg";
import miniIcon from "../../../assets/svgs/mini.svg";
import menuIcon from "../../../assets/svgs/down.svg";

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 38px;
  background: #1E1E1E;

  display: flex;
  vertical-align: middle;
  align-items: center;

  -webkit-app-region: drag;
  -ms-user-select: none;
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
`;

const Title = styled(Link)`
  font-weight: 900;
  font-size: 20px;
  color: #FFFFFF;
  line-height: 38px;
  margin-left: 8px;
  text-decoration: none;
  -webkit-app-region: none;
`;

const CreateButton = styled(Link)`
  width: 85px;
  height: 23px;

  background: #4255FF;
  border-radius: 5px;

  font-weight: 500;
  font-size: 13px;
  text-decoration: none;
  line-height: 23px;
  text-align: center;
  color: #FFFFFF;
  margin-left: 8px;

  cursor: pointer;

  -webkit-app-region: none;

  &:hover {
    background: #364aff;
  };

  &:active {
    background: #1f35fc;
  }
`;

const ControlWrapper = styled.div`
  position: fixed;
  right: 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  -webkit-app-region: none;
`;

const ControlButton = styled.div<{type: string}>`
  display: flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  float: right;

  width: 59px;
  height: 38px;

  background: #1E1E1E;

  &:hover {
    background: ${props => (props.type == "exit") ? "#EE1515" : "#252525"};
  }

  ${props => (props.type == "menu") && "border-left: 1px solid #252525;"};
`;

const Header = () => {
  return (
    <>
      <HeaderWrapper>
        <Title to="/">Exam Helper</Title>
        <CreateButton to="/create">새로 만들기</CreateButton>

        <ControlWrapper>
          <ControlButton type="menu" className="menuButton undrag" onClick={() => {window.electron.ipcRenderer.sendMessage('windowControl', ['menu']);}}>
            <img src={menuIcon} width={"12px"} />
          </ControlButton>

          <ControlButton type="mini" className="miniButton undrag" onClick={() => {window.electron.ipcRenderer.sendMessage('windowControl', ['mini']);}}>
            <img src={miniIcon} width={"12px"} />
          </ControlButton>

          <ControlButton type="size" className="sizeButton undrag" onClick={() => {window.electron.ipcRenderer.sendMessage('windowControl', ['size']);}}>
            <img src={sizeIcon} width={"12px"} />
          </ControlButton>

          <ControlButton type="exit" className="exitButton undrag" onClick={() => {window.electron.ipcRenderer.sendMessage('windowControl', ['exit']);}}>
            <img src={exitIcon} width={"12px"} />
          </ControlButton>
        </ControlWrapper>
      </HeaderWrapper>
    </>
  );
};

export default Header;
