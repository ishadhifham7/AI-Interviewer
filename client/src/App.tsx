import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Double check these paths
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

interface PrivateRouteProps {
  children: React.ReactNode;
}

// A simple wrapper to protect routes
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="bg-[#09090b] min-h-screen flex items-center justify-center text-white p-10 font-sans">
        <div className="animate-pulse text-gray-400 uppercase tracking-widest text-sm">
          Loading AI Mentor...
        </div>
      </div>
    );
  }
  
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Protected Routes */}
          <Route 
            path="/interview" 
            element={
              <PrivateRoute>
                <div className="min-h-screen bg-[#09090b] text-white p-10 font-sans">
                  <h1 className="text-2xl font-bold tracking-tight">Interview Dashboard</h1>
                  <p className="text-gray-400 mt-2">Your AI mentor is ready.</p>
                </div>
              </PrivateRoute>
            } 
          />

          {/* Default Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;