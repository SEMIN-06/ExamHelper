import { useEffect, useRef, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import styled from "styled-components";
import { ToastContainer, Slide } from 'react-toastify';

import GlobalStyle from "./styles/global";

import Header from "./components/Header";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Project from './pages/Project';
import { RecoilRoot } from 'recoil';
import GlobalModal from './components/GlobalModal';

const RoutesWrapper = styled.div`
  margin-top: 38px;
  height: calc(100vh - 38px);
  overflow: auto;
`;

export default function App() {
  const scrollRef = useRef<HTMLDivElement>();
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = () => {
    setScrollTop(scrollRef.current.scrollTop);
  };

  return (
    <Router>
      <RecoilRoot>
        <GlobalStyle />
        <Header />
        <RoutesWrapper ref={scrollRef} onScroll={onScroll}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:projectId" element={<Project />} />
            <Route path="/project/:projectId/edit" element={<Create key="project/edit" stickyAble={scrollTop >= 50} />} />
            <Route path="/create" element={<Create key="create" stickyAble={scrollTop >= 50} />} />
          </Routes>
        </RoutesWrapper>
        <GlobalModal />
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover
          theme="dark"
          transition={Slide}
        />
      </RecoilRoot>
    </Router>
  );
}
