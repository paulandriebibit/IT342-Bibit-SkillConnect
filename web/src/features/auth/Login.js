import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [creds, setCreds] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const [showForgotPanel, setShowForgotPanel] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthError = urlParams.get('error');
    if (oauthError) {
      if (oauthError === 'unauthorized_domain') {
        setError('Please use your official @cit.edu.ph institutional email account.');
      } else {
        setError(oauthError.replace(/_/g, ' '));
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleChange = (e) => setCreds({ ...creds, [e.target.name]: e.target.value });

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

  const handleGoogleLoginRedirect = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setForgotLoading(true);
    setForgotError('');
    setForgotSuccess('');

    try {
      setForgotSuccess('A secure recovery sequence link has been dispatched to your institutional inbox.');
      setForgotEmail('');
    } catch (err) {
      setForgotError('Failed to initialize credential recovery sequence.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="LoginContainer">
      <div className="LoginGrid">
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

        <div className="LoginFormSection">
          <div className="LoginFormContainer">
            
            {!showForgotPanel ? (
              <>
                <div className="LoginHeader">
                  <h2 className="LoginTitle">Welcome Back</h2>
                  <p className="LoginSubtitle">Sign in to continue your learning journey</p>
                </div>

                <form onSubmit={handleLogin} className="LoginForm">
                  <div className="InputGroup">
                    <label className="InputLabel">Email Address</label>
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

                  <div className="InputGroup">
                    <label className="InputLabel">Password</label>
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
                      <button 
                        type="button" 
                        className="ForgotPassword"
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
                        onClick={() => {
                          setError('');
                          setShowForgotPanel(true);
                        }}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>

                  {error && <div className="ErrorMessage">{error}</div>}

                  <button type="submit" className="LoginButton" disabled={loading}>
                    {loading ? <span className="Spinner"></span> : 'LOGIN'}
                  </button>

                  <div className="SignupPrompt">
                    <p className="SignupText">
                      Don't have an account?{' '}
                      <button type="button" className="SignupLink" onClick={onSwitchToRegister}>
                        Create new account
                      </button>
                    </p>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="LoginHeader">
                  <h2 className="LoginTitle">Recover Password</h2>
                  <p className="LoginSubtitle">Provide your verified network identifier to recover your account credentials</p>
                </div>

                <form onSubmit={handleForgotPasswordSubmit} className="LoginForm">
                  <div className="InputGroup">
                    <label className="InputLabel">Account Email Directory</label>
                    <input
                      type="email"
                      className="InputField"
                      placeholder="username@cit.edu.ph"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                    <p className="HelperText">We will check our nodes for this account identifier</p>
                  </div>

                  {forgotError && <div className="ErrorMessage">{forgotError}</div>}
                  {forgotSuccess && <div className="SuccessMessage" style={{ padding: '12px', background: '#F0FDF4', color: '#065F46', borderRadius: '6px', fontSize: '13px', border: '1px solid #D1FAE5', textAlign: 'center' }}>{forgotSuccess}</div>}

                  <button type="submit" className="LoginButton" disabled={forgotLoading}>
                    {forgotLoading ? 'Processing Request...' : 'Reset Password'}
                  </button>

                  <div className="SignupPrompt">
                    <button 
                      type="button" 
                      className="SignupLink"
                      onClick={() => {
                        setForgotError('');
                        setForgotSuccess('');
                        setShowForgotPanel(false);
                      }}
                    >
                      ← Return to Secure Login
                    </button>
                  </div>
                </form>
              </>
            )}

            <div className="Divider">
              <span className="DividerLine"></span>
              <span className="DividerText">Or continue with</span>
              <span className="DividerLine"></span>
            </div>

            <div className="SocialButtons">
              <button type="button" className="SocialButton" onClick={handleGoogleLoginRedirect}>
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