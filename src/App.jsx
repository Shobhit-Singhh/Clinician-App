import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Assessments from "./pages/Assessments";
import Patients from "./pages/Patients.jsx";
import Settings from "./pages/Settings";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="Assessments" element={<Assessments />} />
          <Route path="Patients" element={<Patients />} />
          <Route path="Settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};


export default App
