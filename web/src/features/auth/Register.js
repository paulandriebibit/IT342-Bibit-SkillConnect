// src/features/auth/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Theme.css';
import '../../styles/Register.css';

const Register = ({ onSwitchToLogin }) => {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    major: 'CCS'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!agreeTerms) {
      setError("Please agree to the Terms of Service");
      return;
    }
    
    if (user.password !== user.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (user.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:8080/api/v1/auth/register', {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: user.password,
        studentId: user.studentId,
        major: user.major
      });
      
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        if (onSwitchToLogin) onSwitchToLogin();
      }, 2000);
    } catch (err) {
      setError(err.response?.data || "Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="RegisterContainer">
      <div className="RegisterGrid">
        {/* Left Side - Green Branding Section */}
        <div className="RegisterBrand">
          <div className="BrandLogo">
            <span className="BrandLogoIcon">🌿</span>
            <span className="BrandLogoText">SkillConnect</span>
          </div>
          <h1 className="BrandTitle">Join the<br />Learning Community</h1>
          <p className="BrandDescription">
            Start your skill exchange journey today. Connect, learn, and grow with fellow CIT-U students.
          </p>
          <div className="FeatureList">
            <div className="FeatureItem">
              <span className="FeatureCheck">✓</span>
              <span>Learn from peers</span>
            </div>
            <div className="FeatureItem">
              <span className="FeatureCheck">✓</span>
              <span>Share your expertise</span>
            </div>
            <div className="FeatureItem">
              <span className="FeatureCheck">✓</span>
              <span>Build your network</span>
            </div>
            <div className="FeatureItem">
              <span className="FeatureCheck">✓</span>
              <span>Earn recognition</span>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="RegisterFormSection">
          <div className="RegisterFormContainer">
            <div className="RegisterHeader">
              <h2 className="RegisterTitle">Create Account</h2>
              <p className="RegisterSubtitle">Join the peer-to-peer exchange community</p>
            </div>

            {error && <div className="ErrorMessage">{error}</div>}
            {success && <div className="SuccessMessage">{success}</div>}

            <form onSubmit={handleSubmit} className="RegisterForm">
              {/* Name Fields - Two Columns */}
              <div className="FormRow">
                <div className="InputGroup">
                  <label className="InputLabel">
                    <span className="InputIcon"></span>
                    First Name
                  </label>
                  <input
                    name="firstname"
                    type="text"
                    className="InputField"
                    value={user.firstname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="InputGroup">
                  <label className="InputLabel">
                    <span className="InputIcon"></span>
                    Last Name
                  </label>
                  <input
                    name="lastname"
                    type="text"
                    className="InputField"
                    value={user.lastname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

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
                  value={user.email}
                  onChange={handleChange}
                  required
                />
                <p className="HelperText">Use your CIT-U email address</p>
              </div>

              {/* Student ID and Major */}
              <div className="FormRow">
                <div className="InputGroup">
                  <label className="InputLabel">
                    <span className="InputIcon"></span>
                    Student ID
                  </label>
                  <input
                    name="studentId"
                    type="text"
                    className="InputField"
                    value={user.studentId}
                    onChange={handleChange}
                  />
                </div>
                <div className="InputGroup">
                  <label className="InputLabel">
                    <span className="InputIcon"></span>
                    Department
                  </label>
                  <select
                    name="major"
                    className="SelectField"
                    value={user.major}
                    onChange={handleChange}
                  >
                    <option value="CCS">Computer Studies</option>
                    <option value="CEA">Engineering & Architecture</option>
                    <option value="CASE">Arts, Sciences & Education</option>
                    <option value="CBA">Business & Accountancy</option>
                  </select>
                </div>
              </div>

              {/* Password Fields */}
              <div className="InputGroup">
                <label className="InputLabel">
                  <span className="InputIcon"></span>
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  className="InputField"
                  placeholder="Create a strong password"
                  value={user.password}
                  onChange={handleChange}
                  required
                />
                <p className="HelperText">Minimum 6 characters</p>
              </div>

              <div className="InputGroup">
                <label className="InputLabel">
                  <span className="InputIcon"></span>
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  className="InputField"
                  placeholder="Confirm your password"
                  value={user.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Terms and Conditions */}
              <div className="TermsSection">
                <input
                  type="checkbox"
                  className="TermsCheckbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  required
                />
                <label className="TermsLabel">
                  I agree to the <a href="#" className="TermsLink">Terms of Service</a> and <a href="#" className="TermsLink">Privacy Policy</a>
                </label>
              </div>

              {/* Register Button */}
              <button 
                type="submit" 
                className="RegisterButton"
                disabled={loading}
              >
                {loading ? <span className="Spinner"></span> : 'CREATE ACCOUNT'}
              </button>

              {/* Login Link */}
              <div className="LoginPrompt">
                <p className="LoginText">
                  Already have an account?{' '}
                  <button 
                    type="button"
                    className="LoginLink"
                    onClick={onSwitchToLogin}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;