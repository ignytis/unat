import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './Homepage';

import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
    </Router>
  );
}
