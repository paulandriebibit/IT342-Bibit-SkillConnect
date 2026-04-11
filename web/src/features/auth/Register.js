import React, { useState } from 'react';
import axios from 'axios';
import { AuthStyle as styles } from './AuthStyle';

const Register = () => {
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        major: 'CEA' // Defaulting to an SDD-compliant department
    });
    const [msg, setMsg] = useState('');

    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/v1/auth/register', user);
            setMsg("Registration Successful! Please log in.");
        } catch (err) {
            setMsg("Error: Registration failed. Email may already exist.");
        }
    };

    return (
        <div style={styles.card}>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>Join the peer-to-peer exchange community</p>

            <form onSubmit={handleSubmit} style={styles.form}>
                {/* Fixed Name Row - No Overlapping */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <input name="firstname" placeholder="First Name" onChange={handleChange}
                           style={{ ...styles.input, flex: 1, marginBottom: 0 }} required />
                    <input name="lastname" placeholder="Last Name" onChange={handleChange}
                           style={{ ...styles.input, flex: 1, marginBottom: 0 }} required />
                </div>

                <label style={styles.label}>University Email</label>
                <input name="email" type="email" placeholder="n.sur@cit.edu"
                       onChange={handleChange} style={styles.input} required />

                <label style={styles.label}>Department / Major</label>
                <select name="major" onChange={handleChange} style={styles.input}>
                    <option value="CEA">College of Engineering & Architecture</option>
                    <option value="CCS">College of Computer Studies</option>
                    <option value="CASE">College of Arts, Sciences & Education</option>
                    <option value="CBA">College of Business & Accountancy</option>
                </select>

                <label style={styles.label}>Password</label>
                <input name="password" type="password" placeholder="••••••••"
                       onChange={handleChange} style={styles.input} required />

                <button type="submit" style={{ ...styles.primaryBtn, backgroundColor: '#108981' }}>
                    Register Account
                </button>
            </form>
            {msg && <p style={{ color: '#108981', fontSize: '12px', marginTop: '10px' }}>{msg}</p>}
        </div>
    );
};

export default Register;