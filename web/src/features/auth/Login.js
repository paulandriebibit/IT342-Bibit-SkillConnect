import React, { useState } from 'react';
import axios from 'axios';
import { AuthStyle as styles } from './AuthStyle';

const Login = ({ onLoginSuccess }) => { // This matches the prop in your App.js
    const [creds, setCreds] = useState({ email: '', password: '' });
    const [msg, setMsg] = useState('');

    const handleChange = (e) => setCreds({ ...creds, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setMsg(''); // Clear previous errors

        try {
            const response = await axios.post('http://localhost:8080/api/v1/auth/login', creds);

            // 1. Save specific user info for the "Your Skill" logic
            localStorage.setItem('user', JSON.stringify(response.data));

            // 2. Alert the user
            alert("Login successful!");

            // 3. THE KEY: Trigger the function in App.js to flip the isLoggedIn state
            if (onLoginSuccess) {
                onLoginSuccess();
            }
        } catch (err) {
            setMsg("Invalid credentials. Please try again.");
            console.error(err);
        }
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Sign In</h2>
            <p style={styles.subtitle}>Enter your CIT-U credentials to continue</p>
            <form onSubmit={handleLogin} style={styles.form}>
                <label style={styles.label}>Email Address</label>
                <input
                    name="email"
                    type="email"
                    placeholder="n.sur@cit.edu"
                    onChange={handleChange}
                    style={styles.input}
                    required
                />

                <label style={styles.label}>Password</label>
                <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    style={styles.input}
                    required
                />

                <button type="submit" style={styles.primaryBtn}>Login</button>
            </form>
            {msg && <p style={{ color: 'red', fontSize: '12px', marginTop: '10px', textAlign: 'center' }}>{msg}</p>}
        </div>
    );
};

export default Login;