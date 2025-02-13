import { useState } from 'react'
import '../css/App.css'
import LoginSignUp from './LoginSignup.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home.jsx'


function App() {
  // const [count, setCount] = useState(1 )

  return (
    <BrowserRouter >
         <Routes >
            <Route path='/auth' element={<LoginSignUp />} />
            <Route path='/home' element={<Home />}/> 
         </Routes>
     </BrowserRouter> 
    )   
  
}

export default App
