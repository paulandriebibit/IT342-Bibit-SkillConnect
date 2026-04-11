import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SkillCatalog = () => {
    const [skills, setSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Fixed: named properly

    // Get real user data from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    const currentUserId = loggedInUser ? loggedInUser.id : null;

    useEffect(() => {
        axios.get('http://localhost:8080/api/v1/skills')
            .then(res => {
                setSkills(res.data);
                setIsLoading(false); // Fixed: matches state
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    const handleRequestSwap = async (skill) => {
        if (!currentUserId) {
            alert("Please login first!");
            return;
        }

        if (skill.providerId === currentUserId) {
            alert("You cannot request a swap for your own skill!");
            return;
        }

        try {
            const bookingRequest = {
                skillId: skill.id,
                skillTitle: skill.title,
                providerId: skill.providerId,
                providerName: skill.providerName || 'Student',
                requesterId: currentUserId,
                requesterName: loggedInUser.name || "Peer"
            };

            await axios.post('http://localhost:8080/api/v1/bookings', bookingRequest);
            alert(`Request for "${skill.title}" sent successfully!`);
        } catch (err) {
            alert("Failed to send request.");
        }
    };

    if (isLoading) return <div style={{ textAlign: 'center', padding: '50px', color: '#64748B' }}>Loading skills...</div>;

    return (
        <div>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ color: '#0F172A', fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0' }}>Peer Skill Exchange</h2>
                <p style={{ color: '#64748B', fontSize: '16px', margin: 0 }}>Discover and swap skills with your fellow CIT-U students.</p>
            </div>

            <div style={gridStyle}>
                {skills.map(skill => {
                    // Logic: Compare skill owner to logged-in user
                    const isOwnSkill = skill.providerId === currentUserId;

                    return (
                        <div key={skill.id} style={cardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={categoryTagStyle}>{skill.category || 'General'}</span>
                                <div style={{ color: '#94A3B8', cursor: 'pointer' }}>•••</div>
                            </div>

                            <h3 style={skillTitleStyle}>{skill.title}</h3>
                            <p style={descriptionStyle}>{skill.description}</p>

                            <div style={footerStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={avatarCircle}>{skill.providerName ? skill.providerName.charAt(0) : 'U'}</div>
                                    <span style={{ fontSize: '13px', color: '#475569', fontWeight: '500' }}>{skill.providerName || 'Student'}</span>
                                </div>

                                <button
                                    style={{
                                        ...requestBtnStyle,
                                        backgroundColor: isOwnSkill ? '#CBD5E1' : '#2563EB',
                                        cursor: isOwnSkill ? 'not-allowed' : 'pointer'
                                    }}
                                    onClick={() => handleRequestSwap(skill)}
                                    disabled={isOwnSkill}
                                >
                                    {isOwnSkill ? 'Your Skill' : 'Request Swap'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Styles (Unaltered) ---
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' };
const cardStyle = { backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' };
const categoryTagStyle = { backgroundColor: '#EFF6FF', color: '#2563EB', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '700' };
const skillTitleStyle = { color: '#1E293B', fontSize: '18px', fontWeight: '700', margin: '16px 0 8px 0' };
const descriptionStyle = { color: '#64748B', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px 0', flex: 1 };
const footerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #F1F5F9' };
const avatarCircle = { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#CBD5E1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' };
const requestBtnStyle = { color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600' };

export default SkillCatalog;