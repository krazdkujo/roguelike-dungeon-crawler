/**
 * Roguelike Dungeon Crawler - Main Application Component
 * 
 * Root React component that handles:
 * - Authentication state initialization
 * - Route configuration (public and protected)
 * - Loading states and navigation
 * 
 * @component
 */

import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/stores/hooks'
import { initializeAuth } from '@/stores/authSlice'

// Components
import Layout from '@/components/ui/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

// Pages
import LoginPage from '@/components/auth/LoginPage'
import RegisterPage from '@/components/auth/RegisterPage'
import DashboardPage from '@/components/dashboard/DashboardPage'
import CharacterCreation from '@/components/character/CharacterCreation'
import CharacterSelect from '@/components/character/CharacterSelect'
import TownPage from '@/components/town/TownPage'
import DungeonPage from '@/components/dungeon/DungeonPage'
import CombatPage from '@/components/combat/CombatPage'

function App() {
  const dispatch = useAppDispatch()
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">
          <div className="pixel-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
        } />
        
        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="characters">
            <Route index element={<CharacterSelect />} />
            <Route path="create" element={<CharacterCreation />} />
          </Route>
          <Route path="town" element={<TownPage />} />
          <Route path="dungeon/:instanceId" element={<DungeonPage />} />
          <Route path="combat/:combatId" element={<CombatPage />} />
        </Route>

        {/* Catch all redirect */}
        <Route path="*" element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        } />
      </Routes>
    </div>
  )
}

export default App