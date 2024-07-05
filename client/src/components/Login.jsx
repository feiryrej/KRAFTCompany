import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css'; // Import your custom styles

const Login = () => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:3000/auth/adminlogin', values)
        .then(result => {
            if(result.data.loginStatus) {
                navigate('/dashboard');
            } else {
                setError(result.data.Error);
            }
        })
        .catch(err => {
            console.error('Login error:', err);
            setError('Failed to login. Please try again.'); // Generic error message for network failures
        });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <h3>Enter your credentials</h3>
                {error && <p className="error-message">{error}</p>} {/* Display error message if exists */}
                <form className="login-form" onSubmit={handleSubmit}>
                    <input type="email" name="email" autoComplete="off" placeholder="Email" value={values.email} onChange={(e) => setValues({...values, email: e.target.value})} />
                    <input type="password" name="password" placeholder="Password" value={values.password} onChange={(e) => setValues({...values, password: e.target.value})} />
                    <button type="submit">LOGIN</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
