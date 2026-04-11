import React, { useState } from 'react';
import axios from 'axios';

const CreateSkill = () => {
    const [skill, setSkill] = useState({
        title: '',
        description: '',
        category: 'Programming' // Default value for the dropdown
    });
    const [msg, setMsg] = useState({ text: '', type: '' });

    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    const handleSubmit = async (e) => {
        e.preventDefault();
        const skillData = {
            ...skill,
            providerId: loggedInUser.id,
            providerName: loggedInUser.name
        };
        await axios.post('http://localhost:8080/api/v1/skills', skillData);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ color: '#0F172A', fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0' }}>Offer a Skill</h2>
                <p style={{ color: '#64748B', fontSize: '16px', margin: 0 }}>Share your expertise with the community and start swapping.</p>
            </div>

            <div style={formCardStyle}>
                {msg.text && (
                    <div style={{
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        backgroundColor: msg.type === 'success' ? '#D1FAE5' : '#FEE2E2',
                        color: msg.type === 'success' ? '#065F46' : '#991B1B',
                        textAlign: 'center',
                        fontWeight: '600'
                    }}>
                        {msg.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={inputGroup}>
                        <label style={labelStyle}>Skill Title</label>
                        <input
                            style={inputStyle}
                            placeholder="e.g. React Development or Calculus Tutoring"
                            value={skill.title}
                            onChange={e => setSkill({...skill, title: e.target.value})}
                            required
                        />
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}>Category</label>
                        <select
                            style={inputStyle}
                            value={skill.category}
                            onChange={e => setSkill({...skill, category: e.target.value})}
                        >
                            <option value="Programming">Programming</option>
                            <option value="Design">Design</option>
                            <option value="Academic">Academic</option>
                            <option value="Language">Language</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={inputGroup}>
                        <label style={labelStyle}>Description</label>
                        <textarea
                            style={{...inputStyle, height: '120px', resize: 'none'}}
                            placeholder="Briefly describe what you can teach and what you're looking for in return..."
                            value={skill.description}
                            onChange={e => setSkill({...skill, description: e.target.value})}
                            required
                        />
                    </div>

                    <button type="submit" style={submitBtnStyle}>
                        Post to Marketplace
                    </button>
                </form>
            </div>
        </div>
    );
};

const formCardStyle = {
    backgroundColor: '#FFFFFF',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
};

const formStyle = { display: 'flex', flexDirection: 'column', gap: '20px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelStyle = { fontSize: '14px', fontWeight: '600', color: '#334155' };
const inputStyle = {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #CBD5E1',
    fontSize: '15px',
    color: '#1E293B',
    outline: 'none',
    backgroundColor: '#F8FAFC'
};

const submitBtnStyle = {
    backgroundColor: '#0D9488',
    color: 'white',
    border: 'none',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '10px'
};

export default CreateSkill;