import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer-container'>
        <div className='footer-section'>
            <Link to={'/aboutus'}>About Us</Link>
        </div>
    </div>
  )
}

export default Footer