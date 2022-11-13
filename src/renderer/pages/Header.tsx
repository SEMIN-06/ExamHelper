import { Link } from 'react-router-dom';

import exitIcon from "../../../assets/svgs/x.svg";
import sizeIcon from "../../../assets/svgs/copy.svg";
import miniIcon from "../../../assets/svgs/mini.svg";
import menuIcon from "../../../assets/svgs/down.svg";

const Header = () => {
  return (
    <div className="headerContainer">
      <div className="title">Exam Helper</div>
      <div className="createButton undrag">만들기</div>

      <div className="exitButton undrag" onClick={() => {window.electron.ipcRenderer.sendMessage('windowControl', ['exit']);}}>
        <img src={exitIcon} />
      </div>

      <div className="sizeButton undrag" onClick={() => {window.electron.ipcRenderer.sendMessage('windowControl', ['size']);}}>
        <img src={sizeIcon} />
      </div>

      <div className="miniButton undrag" onClick={() => {window.electron.ipcRenderer.sendMessage('windowControl', ['mini']);}}>
        <img src={miniIcon} />
      </div>

      <div className="menuButton undrag" onClick={() => {window.electron.ipcRenderer.sendMessage('windowControl', ['menu']);}}>
        <img src={menuIcon} />
      </div>
    </div>
  );
};

export default Header;
