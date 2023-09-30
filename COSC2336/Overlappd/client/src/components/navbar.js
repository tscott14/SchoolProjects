import React from "react";
 
import "bootstrap/dist/css/bootstrap.css";
import logo from './img/OverlappdLogo.svg';
 
import { NavLink, Link, useNavigate } from "react-router-dom";

import { useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';



// Here, we display our Navbar
const Navbar = () => {
    //setup for logout
    let dispatch = useDispatch()
    let navigate = useNavigate()
    const user = localStorage.getItem('overlappdToken')
        ? localStorage.getItem('overlappdUser')
        :null
    const logoff = async() => {
        await dispatch(logout())
        navigate('/login')
    }
    const clickEvent = () => {
        logoff()
    }
  return (
      <nav className='nav'>
        <NavLink className="navbar-brand" to="/">
            <img style={{"width" : 50 + '%'}} src={logo}></img>
        </NavLink>
        <ul>
            {/* (will show homescreen and logout only if user is logged in and show login and signup only if user is not logged in) */}
            {user ? (
                    <><li>
                        <Link to="/homescreen">Home Screen</Link> {/*Temporary Link to homescreen. Example of how to route to new page: Must import Link from react, and add a to= property that describes the route being sent, which App.js will handle*/}
                    </li><li>
                        <button className='button' onClick={clickEvent}>{/*Logout of account and redirect*/}
                            Logout
                        </button>
                    </li></> 
            ) : (

                    <><li>
                        <Link to="/login">Login</Link>
                        </li><li>
                        <Link to="/signup">Sign up</Link>
                    </li></>
                    
            )}
        </ul>

      </nav>
  )
}

export default Navbar