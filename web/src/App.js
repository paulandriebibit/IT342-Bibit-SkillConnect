import React, { useState, useEffect } from 'react';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import SkillCatalog from './features/catalog/SkillCatalog';
import CreateSkill from './features/skills/CreateSkill';
import BookingDashboard from './features/bookings/BookingDashboard';


function App() {
    // Persistent login state
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        return localStorage.getItem('isLoggedIn') === 'true';
    });

    const [isLoginView, setIsLoginView] = useState(true);
    const [activeTab, setActiveTab] = useState('marketplace');

    const handleLoginSuccess = () => {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <div className="App">
            {!isLoggedIn ? (
                /* --- YOUR LOGIN/REGISTER DESIGN (KEPT AS IS) --- */
                <div style={{ padding: '50px 20px', textAlign: 'center' }}>
                    <h1 style={{ color: '#2563EB', fontSize: '32px', marginBottom: '30px' }}>SkillConnect</h1>
                    <div style={{ display: 'inline-block', textAlign: 'left' }}>
                        {isLoginView ? (
                            <Login onLoginSuccess={handleLoginSuccess} />
                        ) : (
                            <Register />
                        )}

                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <p style={{ fontSize: '14px', color: '#64748B' }}>
                                {isLoginView ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    onClick={() => setIsLoginView(!isLoginView)}
                                    style={{ background: 'none', border: 'none', color: '#2563EB', fontWeight: 'bold', cursor: 'pointer', marginLeft: '5px' }}
                                >
                                    {isLoginView ? "Register here" : "Login here"}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                /* --- UPDATED STUDENT PORTAL (SDD ALIGNED) --- */
                <div style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
                    {/* Navigation Bar */}
                    <nav style={navStyles.navbar}>
                        <div style={navStyles.logo}>SkillConnect</div>
                        <div style={navStyles.links}>
                            <button
                                onClick={() => setActiveTab('marketplace')}
                                style={{...navStyles.link, borderBottom: activeTab === 'marketplace' ? '3px solid white' : 'none'}}
                            >
                                Marketplace
                            </button>
                            <button
                                onClick={() => setActiveTab('offer')}
                                style={{...navStyles.link, borderBottom: activeTab === 'offer' ? '3px solid white' : 'none'}}
                            >
                                Offer Skill
                            </button>
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                style={{...navStyles.link, borderBottom: activeTab === 'dashboard' ? '2px solid white' : 'none'}}
                            >
                                My Bookings
                            </button>
                            <button onClick={handleLogout} style={navStyles.logoutBtn}>Logout</button>
                        </div>
                    </nav>

                    {/* Centered Main Content Area */}
                    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                        {activeTab === 'marketplace' && <SkillCatalog />}
                        {activeTab === 'offer' && <CreateSkill />}
                        {activeTab === 'dashboard' && <BookingDashboard />}
                    </main>
                </div>
            )}
        </div>
    );
}

// Styles consistent with SDD Color Palette
const navStyles = {
    navbar: {
        backgroundColor: '#2563EB',
        padding: '0 60px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
    },
    logo: { fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' },
    links: { display: 'flex', gap: '30px', height: '100%', alignItems: 'center' },
    link: {
        background: 'none',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontSize: '15px',
        fontWeight: '600',
        padding: '24px 0',
        transition: 'all 0.2s ease'
    },
    logoutBtn: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        border: '1px solid white',
        color: 'white',
        padding: '8px 18px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold'
    }
};

export default App;