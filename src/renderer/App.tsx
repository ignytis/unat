import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import Homepage from './Homepage';
import ProjectLayout from './project/ProjectLayout';
import Dashboard from './project/content/Dashboard';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import Brokers from './project/content/Brokers';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/project/dashboard"
          element={
            <ProjectLayout activePage="dashboard">
              <Dashboard />
            </ProjectLayout>
          }
        />
        <Route
          path="/project/brokers"
          element={
            <ProjectLayout activePage="brokers">
              <Brokers />
            </ProjectLayout>
          }
        />
      </Routes>
    </Router>
  );
}
