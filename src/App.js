import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import SignUp from "../src/components/SignUp/SignUp.jsx";
import Homepage from './components/HomePage/Homepage.jsx';
import Login from './components/Login/Login.jsx';

const App = () => {
  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/signUp' element={<SignUp/>}/>
        <Route path='/' element={<Homepage/>}/>  
        <Route path='/loginpage' element={<Login/>}/>        
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App


{/* <BrowserRouter>
      {/* <Header/> */}
      <Routes>
        {/* <Route path='/' element={<Ashwani/>}/> */}
        {/* <Route path='/signUp' element={<signUp/>}/> */}
        {/* <Route path='/createcustomer' element={<Createcustomer/>}/>
        <Route path='/customerlist' element={<CustomerList/>}/>
        <Route path="/customerdetails" element={<Customerdetails/>}/>
        <Route path="/browsepopup" element={<Browsepopup/>}/> */}
        
      </Routes>
      // </BrowserRouter> */}
