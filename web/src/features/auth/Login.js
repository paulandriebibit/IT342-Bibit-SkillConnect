// src/features/auth/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => setCreds({ ...creds, [e.target.name]: e.target.value });

 // Inside handleLogin function, update this part:
// src/features/auth/Login.js - Complete handleLogin Function Replacement
const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await axios.post('http://localhost:8080/api/v1/auth/login', creds);
    
    
    const userData = {
      id: response.data.id,
      firstname: response.data.firstname,
      lastname: response.data.lastname,
      email: response.data.email,
      role: response.data.role, 
      studentId: response.data.studentId,
      major: response.data.major,
      phone: response.data.phone || '',
      bio: response.data.bio || '',
      rememberMe
    };
    
    if (rememberMe) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('user', JSON.stringify(userData));
    }
    
    if (onLoginSuccess) onLoginSuccess(userData);
  } catch (err) {
    setError(err.response?.data?.message || "Invalid email or password");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="LoginContainer">
      <div className="LoginGrid">
        {/* Left Side - Green Branding Section */}
        <div className="LoginBrand">
          <div className="BrandLogo">
            <span className="BrandLogoIcon">🌿</span>
            <span className="BrandLogoText">SkillConnect</span>
          </div>
          <h1 className="BrandTitle">Exchange Skills,<br />Build Community</h1>
          <p className="BrandDescription">
            Join the CIT-U peer-to-peer learning platform where students help students grow together.
          </p>
          <div className="BrandStats">
            <div className="StatItem">
              <div className="StatNumber">500+</div>
              <div className="StatLabel">Active Students</div>
            </div>
            <div className="StatDivider"></div>
            <div className="StatItem">
              <div className="StatNumber">50+</div>
              <div className="StatLabel">Skills Offered</div>
            </div>
            <div className="StatDivider"></div>
            <div className="StatItem">
              <div className="StatNumber">200+</div>
              <div className="StatLabel">Swaps Completed</div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="LoginFormSection">
          <div className="LoginFormContainer">
            <div className="LoginHeader">
              <h2 className="LoginTitle">Welcome Back</h2>
              <p className="LoginSubtitle">Sign in to continue your learning journey</p>
            </div>

            <form onSubmit={handleLogin} className="LoginForm">
              {/* Email Field */}
              <div className="InputGroup">
                <label className="InputLabel">
                  <span className="InputIcon"></span>
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  className="InputField"
                  value={creds.email}
                  onChange={handleChange}
                  required
                />
                <p className="HelperText">Enter your CIT-U email address</p>
              </div>

              {/* Password Field */}
              <div className="InputGroup">
                <label className="InputLabel">
                  <span className="InputIcon"></span>
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  className="InputField"
                  value={creds.password}
                  onChange={handleChange}
                  required
                />
                <div className="PasswordOptions">
                  <label className="CheckboxLabel">
                    <input 
                      type="checkbox" 
                      className="CheckboxInput"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <a href="#" className="ForgotPassword">Forgot password?</a>
                </div>
              </div>

              {/* Error Message */}
              {error && <div className="ErrorMessage">{error}</div>}

              {/* Login Button */}
              <button 
                type="submit" 
                className="LoginButton"
                disabled={loading}
              >
                {loading ? <span className="Spinner"></span> : 'LOGIN'}
              </button>

              {/* Sign Up Link */}
              <div className="SignupPrompt">
                <p className="SignupText">
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    className="SignupLink"
                    onClick={onSwitchToRegister}
                  >
                    Create new account
                  </button>
                </p>
              </div>
            </form>

            {/* Social Login Options */}
            <div className="Divider">
              <span className="DividerLine"></span>
              <span className="DividerText">Or continue with</span>
              <span className="DividerLine"></span>
            </div>

            <div className="SocialButtons">
              <button className="SocialButton">
                <span className="SocialIcon">G</span>
                Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;