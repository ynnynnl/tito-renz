import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
          <img className='logo' src={assets.logo} alt="Tito Renz Logo" />
          <p>Your one-stop solution for delicious catering services. Explore our menu and enjoy the finest culinary experiences.</p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook Icon" />
            {/* Add other social icons here if needed */}
          </div>
        </div>
        
        <div className="footer-content-center">
          <h2>TITO RENZ</h2>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#delivery">Delivery</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>
        
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li><a href="tel:09158208403">0915 820 8403</a></li>
            <li><a href="mailto:titorenzcatering@gmail.com">titorenzcatering@gmail.com</a></li>
          </ul>
        </div>
      </div>
      
      <hr />
      <p className="footer-copyright">Copyright 2024 ©️ TitoRenz.com - All Rights Reserved.</p>
    </div>
  );
}

export default Footer;
