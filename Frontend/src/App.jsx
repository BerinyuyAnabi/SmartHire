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
import { AuthProvider } from './context/AuthContext';

import {Routes, Route} from "react-router-dom";
import ApplicantDetails from "./components/ApplicantDetails"

function App() {

  return (
    <AuthProvider>
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
          <Route element={<ProtectedRoute />}>
            <Route path='/job-posting' element={<JobPosting />}/>
            <Route path='/assessment' element={<Assessment />}/>
            <Route path='/admin' element={<Admin/>}/>
            <Route path="/applicant/:id" element={<ApplicantDetails />} />
          </Route>
        </Routes>
      </main>
    </AuthProvider>
  )
}

export default App
