import React from "react";
import './App.css'

 import { Route, Routes } from "react-router-dom";
 

import Navbar from "./components/navbar";
import Scheduler from "./components/scheduler";


import Signup from './components/Signup'
import Login from './components/Login'
import Homescreen from "./components/Homescreen";
import SchedulerHome from "./components/schedulerHome";
import Footer from "./components/Footer";
import AboutUs from "./components/AboutUs";

 
const App = () => {
 return (
   <div>
     <Navbar />
     <Routes>
       <Route exact path="/" element={<Login />} />
       <Route path="/scheduler" element={<Scheduler />} />
       <Route path="/login" element={<Login />}/>
       <Route path="/signup" element={<Signup />}/>
       <Route path="/homescreen" element={<Homescreen />}/>
       <Route path="/schedulerhome" element={<SchedulerHome />}/>  
       <Route path="/aboutus" element={<AboutUs/>} />    
     </Routes>
     <Footer />
   </div>
 );
};
 
export default App;