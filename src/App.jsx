import './App.css'
import NavBar from './components/NavBar'
import Apply from "./pages/Apply"
import Home from "./pages/Home"
import Assessment from "./pages/Assessment"
import Admin from "./pages/Admin"
import JobPosting from "./pages/JobPosting"
import JobDescription from "./pages/JobDescription"
import {Routes, Route} from "react-router-dom";
import ApplicantDetails from "./components/ApplicantDetails"
function App() {
  

  return (
    <>
    <NavBar/>
    <main className="main-content">
    <Routes>
    <Route path='/' element = {<Home />}/>
    <Route path='/apply' element = {<JobPosting />}/>
    <Route path='/assessment' element = {<Assessment />}/>
    <Route path = '/admin' element = {<Admin/>}/>
    {/* <Route path = '/applicant-details' element = {<ApplicantDetails/>}/> */}
    <Route path = '/job-description' element = {<JobDescription/>}/>
    <Route path="/applicant/:id" element={<ApplicantDetails />} />
    </Routes>
    </main>
    </>
  )
}

export default App
