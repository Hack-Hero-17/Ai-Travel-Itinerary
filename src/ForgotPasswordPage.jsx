import React from 'react';
import './LoginPage.css'; // Reuse same styling

function ForgotPasswordPage() {
  return (
    <div className='wrap'>
      <div className='form-box'>
        <form>
          <h1>RESET PASSWORD</h1>
          <div className='input-box'>
            <input className='user-input' type="email" placeholder='Enter your registered email' required />
          </div>
          <button type='submit'>SEND LINK</button>
          <p>Remembered your password? <a href="/">Login</a></p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
