import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AppointmentsPage from './pages/AppointmentsPage';
import HealthConcernPage from './pages/HealthConcernPage';
import HealthStatusPage from './pages/HealthStatusPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import LifestyleInsightsPage from './pages/LifestyleInsightsPage';
import WorkforcePage from './pages/WorkforcePage';
import JobPortalPage from './pages/JobPortalPage';
import PatientEducationPage from './pages/PatientEducationPage';
import AIHealthAssistantPage from './pages/AIHealthAssistantPage';
import SymptomCheckerPage from './pages/SymtomCheckerPage';
import SettingsPage from './pages/SettingsPage';
import ElderlyCarePage from './pages/workforce/ElderlyCarePage';
import LocalHealthcarePage from './pages/workforce/LocalHealthcarePage';
import GlobalHealthcarePage from './pages/workforce/GlobalHealthcarePage';
import EmergencyMedicalPage from './pages/workforce/EmergencyMedicalPage';
import SpecializedMedicalPage from './pages/workforce/SpecializedMedicalPage';
import MentalHealthPage from './pages/workforce/MentalHealthPage';
import RehabilitationPage from './pages/workforce/RehabilitationPage';
import MaternityCarePage from './pages/workforce/MaternityCarePage';
import PediatricCarePage from './pages/workforce/PediatricCarePage';
import HomeBasedCarePage from './pages/workforce/HomeBasedCarePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './styles/App.css';
import Feedback from './components/Feedback';
import AuthContext from './context/AuthContext';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('ssn'));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('ssn'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = () => setIsLoggedIn(true);
  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      <Router>
        <div className="page-layout">
          <Sidebar />
          <div className="main-content">
            <Routes key={isLoggedIn ? 'auth' : 'guest'}>
            <Route path="/" element={<AIHealthAssistantPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/health-status" element={<HealthStatusPage />} />
              <Route path="/health-concern" element={<HealthConcernPage />} />
              <Route path="/medical-records" element={<MedicalRecordsPage />} />
              <Route path="/lifestyle-insights" element={<LifestyleInsightsPage />} />
              <Route path="/workforce" element={<WorkforcePage />} />
              <Route path="/job-portal" element={<JobPortalPage />} />
              <Route path="/patient-education" element={<PatientEducationPage />} />
              <Route path="/ai-health-assistant" element={<AIHealthAssistantPage />} />
              <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/workforce/elderly-care" element={<ElderlyCarePage />} />
              <Route path="/workforce/local-healthcare" element={<LocalHealthcarePage />} />
              <Route path="/workforce/global-healthcare" element={<GlobalHealthcarePage />} />
              <Route path="/workforce/emergency-medical" element={<EmergencyMedicalPage />} />
              <Route path="/workforce/specialized-medical" element={<SpecializedMedicalPage />} />
              <Route path="/workforce/mental-health" element={<MentalHealthPage />} />
              <Route path="/workforce/rehabilitation" element={<RehabilitationPage />} />
              <Route path="/workforce/maternity-care" element={<MaternityCarePage />} />
              <Route path="/workforce/pediatric-care" element={<PediatricCarePage />} />
              <Route path="/workforce/home-based-care" element={<HomeBasedCarePage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;