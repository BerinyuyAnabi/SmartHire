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

import {Routes, Route} from "react-router-dom";
import ApplicantDetails from "./components/ApplicantDetails"

function App() {

  return (
    <>
    <NavBar/>
    <main className="main-content">
    <Routes>
    <Route path='/' element = {<Home />}/>
    <Route path='/job-posting' element = {<JobPosting />}/>
    <Route path='/assessment' element = {<Assessment />}/>
    <Route path = '/admin' element = {<Admin/>}/>
    <Route path = '/features' element = {<Features/>}/>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
    <Route path="/applicant/:id" element={<ApplicantDetails />} />
    </Routes>
    </main>
    </>
  )
}

export default App
