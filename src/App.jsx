import './App.css'
import NavBar from './components/NavBar'
import Apply from "./pages/Apply"
import Home from "./pages/Home"
import Portal from "./pages/Portal"
import Admin from "./pages/Admin"
import JobPosting from "./pages/JobPosting"
import JobDescription from "./pages/JobDescription"
import {Routes, Route} from "react-router-dom";
function App() {
  

  return (
    <>
    <NavBar/>
    <main className="main-content">
    <Routes>
    <Route path='/' element = {<Home />}/>
    <Route path='/apply' element = {<JobPosting />}/>
    <Route path='/portal' element = {<Portal />}/>
    <Route path = '/admin' element = {<Admin/>}/>
    {/* <Route path = '/hr-view' element = {<Apply/>}/> */}
    <Route path = '/job-description' element = {<JobDescription/>}/>
    </Routes>
    </main>
    </>
  )
}

export default App
