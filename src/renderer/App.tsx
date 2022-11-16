import { useEffect, useRef, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import styled from "styled-components";
import { fireStore } from "../firebase";
import GlobalStyle from "./styles/global";

import Header from "./components/Header";
import Home from "./pages/Home";
import Create from "./pages/Create";
import { ToastContainer, Slide } from 'react-toastify';

const RoutesWrapper = styled.div`
  margin-top: 38px;
  height: calc(100vh - 38px);
  overflow: auto;
`;

export default function App() {
  const scrollRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = () => {
    setScrollTop(scrollRef.current.scrollTop);
  };

  useEffect(() => {
    console.log(fireStore);
    console.log(fireStore.app.name);
  }, []);

  return (
    <Router>
      <GlobalStyle />
      <Header />
      <RoutesWrapper ref={scrollRef} onScroll={onScroll}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create stickyAble={scrollTop >= 50} />} />
        </Routes>
      </RoutesWrapper>
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
    </Router>
  );
}
