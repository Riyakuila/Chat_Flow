import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import About from './pages/About'
import Contact from './pages/Contact'
import ChatPage from './pages/ChatPage'
import { useAuthStore } from './store/useAuthStore'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { useThemeStore } from './store/useThemeStore'
import Logout from './pages/Logout'



const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({onlineUsers});

  useEffect(() => {
    checkAuth();
  }, [checkAuth])

  console.log({authUser})

  if (isCheckingAuth && !authUser) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={authUser ? <ChatPage /> : <HomePage />} />
          <Route path="/login" element={authUser ? <Navigate to='/chat' /> : <LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/dashboard' element={authUser ? <Dashboard /> : <Navigate to='/login' />} />
          <Route path='/chat' element={authUser ? <ChatPage /> : <Navigate to='/login' />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/logout' element={authUser ? <Logout /> : <Navigate to='/' />} />
        </Routes>
      </main>

      <Footer />
      <Toaster position="top-center" />
    </div>
  )
}

export default App
