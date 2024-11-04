import { useEffect, useRef, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer, Slide } from 'react-toastify';
import { RecoilRoot } from 'recoil';

import GlobalStyle from './styles/global';

import GlobalModal from './components/GlobalModal';
import Header from './components/Header';
import Home from './pages/Home';
import Create from './pages/Create';
import Project from './pages/Project';
import Learn from './pages/Learn';
import Print from './pages/Print';

const RoutesWrapper = styled.div`
  margin-top: 38px;
  height: calc(100vh - 38px);
  overflow: auto;
`;

export default function App() {
  return (
    <Router>
      <RecoilRoot>
        <GlobalStyle />
        <Header />
        <RoutesWrapper id="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:projectId" element={<Project />} />
            <Route
              path="/project/:projectId/edit"
              element={<Create key="project/edit" />}
            />
            <Route path="/project/:projectId/learn" element={<Learn />} />
            <Route path="/project/:projectId/print" element={<Print />} />
            <Route path="/create" element={<Create key="create" />} />
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
