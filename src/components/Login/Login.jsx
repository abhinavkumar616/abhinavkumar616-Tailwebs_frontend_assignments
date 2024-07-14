import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from "axios";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const postData = async (e) => {
        e.preventDefault();

        // Basic form validation
        if (!username || !password) {
            setError("Please fill in all fields.");
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/users/login`, {
                username,
                password
            });

            console.log("response----", response.data);

            // Check if the response status is 200 (successful login)
            if (response.status === 200) {
                // Capture the session ID from the response
                const { sessionId } = response.data;

                console.log("sessionId------", sessionId);

                // Check if sessionId is available
                if (sessionId) {
                    // Store the session ID in a cookie
                    Cookies.set('connect.sid', sessionId);

                    // Navigate to the homepage
                    navigate('/');
                } else {
                    // If sessionId is not available, handle as needed
                    console.error('Session ID is missing. Redirecting to Login Page.');
                    setError("Login failed. Please try again."); // Set custom error message
                }
            } else {
                // Handle other HTTP statuses if needed
                console.error(`Login failed with status ${response.status}.`);
                setError("Login failed. Please try again later."); // Set generic error message for other errors
            }
        } catch (error) {
            // Handle specific errors based on Axios response
            if (error.response && error.response.status === 401) {
                console.error('Invalid username or password.');
                setError("Wrong username or password. Please try again."); // Set custom error message for wrong credentials
            } else {
                console.error('Error occurred:', error);
                setError("An unexpected error occurred. Please try again later."); // Set custom error message for unexpected errors
            }
        }
    }

    return (
        <>
            <div className='container'>
                <div className='form-center'>
                    <form className='login-form'>
                        <div className='input-tags'>
                            <h1>Welcome!</h1>
                            {error && <div className="alert alert-danger" role="alert">{error}</div>}
                            <div className="mb-3">
                                <label htmlFor="exampleInputUsername" className="form-label">Username</label>
                                <input type="text" className="form-control" id="exampleInputUsername" name="username" onChange={(e) => setUsername(e.target.value)} placeholder='Username' autoComplete="new-username" required />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="exampleInputPassword" className="form-label">Password</label>
                                <input type="password" className="form-control" id="exampleInputPassword" name="password" onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' autoComplete="new-password" required />
                            </div>
                            <button type="button" onClick={postData} className="btn btn-primary w-100 mb-3">Submit</button>
                            <button type="button" onClick={() => navigate('/signUp')} className="btn btn-secondary w-100">Register here?</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
