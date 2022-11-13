import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Header from "./pages/Header";
import Home from "./pages/Home";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
