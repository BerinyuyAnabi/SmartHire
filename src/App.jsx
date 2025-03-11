import './App.css'
import NavBar from './components/NavBar'
import Apply from "./pages/Apply"
import Home from "./pages/Home"
import Portal from "./pages/Portal"
import Admin from "./pages/Admin"
import {Routes, Route} from "react-router-dom";
function App() {
  

  return (
    <>
    <NavBar/>
    <main className="main-content">
    <Routes>
    <Route path='/' element = {<Home />}/>
    <Route path='/apply' element = {<Apply />}/>
    <Route path='/portal' element = {<Portal />}/>
    <Route path = '/admin' element = {<Admin/>}/>
    </Routes>
    </main>
    </>
  )
}

export default App
