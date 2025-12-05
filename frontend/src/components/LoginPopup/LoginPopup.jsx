import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken } = useContext(StoreContext);
  
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false); // Track checkbox state

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onCheckboxChange = () => {
    setAgreedToTerms(prev => !prev); // Toggle checkbox state
  };

  const onLogin = async (event) => {
    event.preventDefault();
    if (!agreedToTerms) {
      alert("You must agree to the terms and conditions.");
      return;
    }

    const newUrl = currState === "Login" ? `${url}/api/user/login` : `${url}/api/user/register`;

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setShowLogin(false);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && 
            <input 
              name='name' 
              onChange={onChangeHandler} 
              value={data.name} 
              type="text" 
              placeholder='Your Name' 
              required 
            />
          }
          <input 
            name='email' 
            onChange={onChangeHandler} 
            value={data.email} 
            type="email" 
            placeholder='Your Email' 
            required 
          />
          <input 
            name='password' 
            onChange={onChangeHandler} 
            value={data.password} 
            type="password" 
            placeholder='Password' 
            required 
          />
        </div>
        <button type='submit'>{currState === "Sign Up" ? "Create Account" : "Login"}</button>
        <div className="login-popup-condition">
          <input 
            type="checkbox" 
            checked={agreedToTerms} 
            onChange={onCheckboxChange} 
            required 
          />
          <p>By continuing, I agree to the terms of use and privacy policy.</p>
        </div>
        {currState === "Login"
          ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  );
};

export default LoginPopup;
