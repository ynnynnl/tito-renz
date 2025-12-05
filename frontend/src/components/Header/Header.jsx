import React from 'react';
import './Header.css';

const Header = () => {
  // You may want to implement a function for the button click
  const handleClick = () => {
    // Logic for viewing the menu
  };

  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order your favorite food here</h2>
        <p>Choose from a diverse menu featuring various delicious options.</p>  
        <button onClick={handleClick}>View Menu</button>
      </div>
    </div>
  );
}

export default Header;
