import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Home from '../Home/Home';
import Details from '../Details/Details';

function Nav() {
  return (
    
      <Routes>
        
        
        <Route path='/' element={<Home/>}/>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/details" element={<Details/>}/>
      </Routes>
    
  );
}

export default Nav;
