import './App.css'
import NavBar from './components/NavBar'
import Home from "./pages/Home"
import Assessment from "./pages/Assessment"
import Admin from "./pages/Admin"
import BookmarkedJobsViewer from "./pages/BookmarkedJobsViewer"
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
      {/* Public routes */}
      <Route path='/' element={<Home />}/>
      <Route path='/features' element={<Features/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      {/* Protected routes */}
      <Route path='/job-posting' element={
 
          <JobPosting />
    
      }/>
      <Route path='/assessment' element={
       
          <Assessment />
    
      }/>
      <Route path='/admin/*' element={<Admin />} />

      <Route path="/applicant/:id" element={
      
          <ApplicantDetails />
    
      } />

      <Route path="/debug/bookmarked-jobs" element={<BookmarkedJobsViewer/>} />

      {/* Protected routes
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
        <ProtectedRoute requireAdmin={true}>
          <Admin/>
        </ProtectedRoute>
      }/>
      <Route path="/applicant/:id" element={
        <ProtectedRoute>
          <ApplicantDetails />
        </ProtectedRoute>
      } /> */}
      
      {/* Fallback route - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </main>
    </>
  )
}

export default App