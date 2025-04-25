import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { Plane } from 'lucide-react';
import { Link } from 'react-router-dom'; 

function LoginPage() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    setPosition({ x: clientX, y: clientY });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className='wrap'>
      <div className='cursor-follow' style={{ left: `${position.x - 15}px`, top: `${position.y - 15}px` }}>
        <Plane className='plane' />
      </div>
      <div className='form-box'>
        <form>
          <h1>LOGIN</h1>
          <div className='input-box'>
            <FaUserAlt className='icon' />
            <input className='user-input' type="text" placeholder='username' required />
          </div>
          <div className='input-box'>
            <RiLockPasswordFill className='icon' />
            <input className='user-input' type="password" placeholder='password' required />
          </div>
          <div className='rem-for'>
            <label>
              <input type="checkbox" />Remember me
            </label>
            <Link to="/forgot-password">Forget Password</Link>
          </div>
          <button type='submit'>SUBMIT</button>
          <div>
            <p>Don't have an account? <Link to="/signup">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;