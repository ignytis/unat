import { MemoryRouter as Router, Routes, Route, } from 'react-router-dom';

import Homepage from './Homepage';
import ProjectLayout from './project/ProjectLayout';
import Dashboard from './project/Dashboard';

import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/project/dashboard"
          element={
            <ProjectLayout>
              <Dashboard />
            </ProjectLayout>
          }
        />
      </Routes>
    </Router>
  );
}
