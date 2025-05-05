import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import EntryDetail from './pages/EntryDetail';
import InteractiveSession from './components/InteractiveSession';
import MoodTrendPage from './pages/MoodTrendPage';
import LoaderOverlay from './components/LoaderOverlay';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef6f9] to-[#f3e8ff] relative">
      {loading && <LoaderOverlay />}
      
      <Routes>
        <Route path="/" element={<LandingPage setLoading={setLoading} />} />
        <Route path="/auth" element={<AuthPage setLoading={setLoading} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard setLoading={setLoading} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interactive"
          element={
            <ProtectedRoute>
              <InteractiveSession setLoading={setLoading} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/entry/:id"
          element={
            <ProtectedRoute>
              <EntryDetail setLoading={setLoading} />
            </ProtectedRoute>
          }
        />


<Route
  path="/mood-trend"
  element={
    <ProtectedRoute>
      <MoodTrendPage />
    </ProtectedRoute>
  }
/>

      </Routes>
    </div>
  );
}

export default App;
