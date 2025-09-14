// Wrapper for root route to redirect based on auth
import { Navigate, useNavigate } from 'react-router-dom';

import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import SignUp from './components/SignUp'
import Home from './components/Home'
import Submit from './context/SubmitProvider'
import SubmitProvider from './context/SubmitProvider'
import axios from 'axios'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute'
import NotFound from './components/NotFound';
import Settings from './components/Settings';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = unknown
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5001/info", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Not authenticated");
        await res.json();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5001/info", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");
        await res.json();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);


  return (
    <Router>
      <Navbar setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated}/>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Home />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} loading={loading}>
              <Settings setIsAuthenticated={setIsAuthenticated} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : (
              <PublicRoute>
                <SubmitProvider setIsAuthenticated={setIsAuthenticated}>
                  <Login />
                </SubmitProvider>
              </PublicRoute>
            )
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : (
              <PublicRoute>
                <SubmitProvider>
                  <SignUp />
                </SubmitProvider>
              </PublicRoute>
            )
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App
