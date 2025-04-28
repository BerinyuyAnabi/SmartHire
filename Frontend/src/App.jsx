import './App.css'
import NavBar from './components/NavBar'
import Home from "./pages/Home"
import Assessment from "./pages/Assessment"
import Admin from "./pages/Admin"
import JobPosting from "./pages/JobPosting"
import Features from "./pages/Features"
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Routes, Route, Navigate } from "react-router-dom";
import ApplicantDetails from "./components/ApplicantDetails"

function App() {
    return (
    <>
    <NavBar/>
    <main className="main-content">
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/job-posting' element={
        <ProtectedRoute>
          <JobPosting />
        </ProtectedRoute>
      }/>
      <Route path='/assessment' element={
        <ProtectedRoute>
          <Assessment />
        </ProtectedRoute>
      }/>
      <Route path='/admin' element={
        <ProtectedRoute>
          <Admin/>
        </ProtectedRoute>
      }/>
      <Route path='/features' element={<Features/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/applicant/:id" element={
        <ProtectedRoute>
          <ApplicantDetails />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </main>
    </>
  )
}

export default App