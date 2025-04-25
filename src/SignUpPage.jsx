import React from 'react';
import './LoginPage.css'; // Reuse same styling

function SignUpPage() {
  return (
    <div className='wrap'>
      <div className='form-box'>
        <form>
          <h1>REGISTER</h1>
          <div className='input-box'>
            <input className='user-input' type="text" placeholder='username' required />
          </div>
          <div className='input-box'>
            <input className='user-input' type="email" placeholder='email' required />
          </div>
          <div className='input-box'>
            <input className='user-input' type="password" placeholder='password' required />
          </div>
          <button type='submit'>SIGN UP</button>
          <p>Already have an account? <a href="/">Login</a></p>
        </form>
      </div>
    </div>
  );
}

export default SignUpPage;
