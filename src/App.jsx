import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'

// Components
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import YouTubeCover from './pages/YouTubeCover'
import History from './pages/History'
import TaskDetail from './pages/TaskDetail'
import Layout from './components/Layout'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const handleLoginSuccess = async (tokenResponse) => {
    console.log("Login Success:", tokenResponse);

    // Fetch user info using the access token
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`
        }
      });
      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to fetch user info", e);
    }
  }

  const handleLogout = () => {
    googleLogout()
    setUser(null)
    localStorage.removeItem('user')
  }

  if (loading) return <div className="loading-screen">Starting...</div>

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />

        <Route path="/" element={
          user ? (
            <Layout user={user} onLogout={handleLogout}>
              <Dashboard user={user} />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />

        <Route path="/youtube-cover" element={
          user ? (
            <Layout user={user} onLogout={handleLogout}>
              <YouTubeCover />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />

        <Route path="/history" element={
          user ? (
            <Layout user={user} onLogout={handleLogout}>
              <History />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />

        <Route path="/history/detail" element={
          user ? (
            <Layout user={user} onLogout={handleLogout}>
              <TaskDetail />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />

        <Route path="/settings" element={
          user ? (
            <Layout user={user} onLogout={handleLogout}>
              <div style={{ textAlign: 'center', marginTop: 50, color: '#94a3b8' }}>Ajustes (Próximamente)</div>
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
