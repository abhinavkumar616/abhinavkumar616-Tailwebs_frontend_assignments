import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from "axios";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const postData = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!username || !email || !password || !mobile) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/users/register`, {
        username,
        email,
        mobile,
        password
      });

      console.log("response----", response.data);

      // Check if the response status is 201 (successful registration)
      if (response.status === 201) {
        // Capture the session ID from the response
        const { sessionId } = response.data;

        // Check if sessionId is available
        if (sessionId) {
          // Store the session ID in a cookie
          Cookies.set('connect.sid', sessionId);

          // Navigate to the homepage
          navigate('/');
        } else {
          // If sessionId is not available, handle as needed
          console.error('Session ID is missing. Redirecting to register page.');
          navigate('/signUp');
        }
      } else {
        // If the response status is not 201, handle as needed
        console.error('Registration failed. Redirecting to register page.');
        navigate('/signUp');
      }
    } catch (error) {
      // Handle specific errors based on Axios response
      if (error.response && error.response.status === 409) {
        console.error('Username already exists.');
        setError("Username already exists. Please choose a different username."); // Set custom error message for duplicate username
      } else {
        console.error('Error occurred:', error);
        setError("An unexpected error occurred. Please try again later."); // Set generic error message for other errors
      }
    }
  }

  return (
    <div className='container'>
      <div className='form-center'>
        <form className='login-form'>
          <h1>Welcome!</h1>
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <div className="mb-3">
            <label htmlFor="exampleInputUsername" className="form-label">Username</label>
            <input type="text" className="form-control" id="exampleInputUsername" name="username" onChange={(e) => setUsername(e.target.value)} placeholder='Username' autoComplete="new-username" />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail" className="form-label">Email address</label>
            <input type="email" className="form-control" id="exampleInputEmail" name="email" onChange={(e) => setEmail(e.target.value)} placeholder='Email Address' autoComplete="new-email" />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputContactNo" className="form-label">Contact No</label>
            <input type="text" className="form-control" id="exampleInputContactNo" name="mobile" onChange={(e) => setMobile(e.target.value)} placeholder='Contact No' autoComplete="new-contact" />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword" className="form-label">Password</label>
            <input type="password" className="form-control" id="exampleInputPassword" name="password" onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' autoComplete="new-password" />
          </div>
          <button type="button" onClick={postData} className="btn btn-primary w-100 mb-3">Register</button>
          <button type="button" onClick={() => navigate('/loginpage')} className="btn btn-secondary w-100">Already have an account? Login</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
