import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  // Set to 'true' so Login is the first thing they see
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="App" style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>SkillConnect</h1>

      {/* Container for the active form */}
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', display: 'inline-block', minWidth: '300px' }}>
        {isLoginView ? <Login /> : <Register />}

        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '14px' }}>
            {isLoginView ? "Don't have an account?" : "Already have an account?"}
            <button
                onClick={() => setIsLoginView(!isLoginView)}
                style={{ background: 'none', border: 'none', color: 'blue', textDecoration: 'underline', cursor: 'pointer', marginLeft: '5px' }}
            >
              {isLoginView ? "Register here" : "Login here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;