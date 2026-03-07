import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [creds, setCreds] = useState({ email: '', password: '' });
    const [msg, setMsg] = useState('');

    const handleChange = (e) => setCreds({ ...creds, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/v1/auth/login', creds);
            setMsg(res.data); // Should show "Login successful"
        } catch (err) {
            setMsg("Error: " + (err.response?.data || "Invalid credentials"));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3>Sign In</h3>
            <form onSubmit={handleLogin}>
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br/><br/>
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br/><br/>
                <button type="submit">Login</button>
            </form>
            <p style={{ color: msg.includes('Error') ? 'red' : 'blue' }}>{msg}</p>
        </div>
    );
};
export default Login;