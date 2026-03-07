import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    // Note: 'firstname' and 'lastname' are now all lowercase to match your Java file
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: ''
    });
    const [msg, setMsg] = useState('');

    const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8080/api/v1/auth/register', user);
            setMsg(res.data);
        } catch (err) {
            setMsg("Error: " + (err.response?.data || "Connection failed"));
        }
    };

    return (
        <div style={{ padding: '10px' }}>
            <h3>Register</h3>
            <form onSubmit={handleSubmit}>
                <input name="firstname" placeholder="First Name" onChange={handleChange} required /><br/><br/>
                <input name="lastname" placeholder="Last Name" onChange={handleChange} required /><br/><br/>
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required /><br/><br/>
                <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br/><br/>
                <button type="submit">Register Account</button>
            </form>
            <p style={{ color: 'green' }}>{msg}</p>
        </div>
    );
};
export default Register;