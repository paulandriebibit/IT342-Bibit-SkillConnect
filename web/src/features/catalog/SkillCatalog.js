import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SkillCatalog.css';

const SkillCatalog = ({ onStartChat }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeCatalogMode, setActiveCatalogMode] = useState('all-postings');

  const [skillForm, setSkillForm] = useState({
    title: '',
    description: '',
    category: 'Programming'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [targetedSkill, setTargetedSkill] = useState(null);
  const [selectedOfferedSkillId, setSelectedOfferedSkillId] = useState('');
  const [confirmedOfferedSkillTitle, setConfirmedOfferedSkillTitle] = useState('');

  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
  const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = loggedInUser?.id;

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/v1/skills');
      setSkills(res.data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoading(false);
    }
  };

  const myOfferedSkills = skills.filter(skill => skill.providerId === currentUserId);

  const handleFormChange = (e) => {
    setSkillForm({ ...skillForm, [e.target.name]: e.target.value });
  };

  const handleCreateSkillSubmit = async (e) => {
    e.preventDefault();
    
    if (!skillForm.title.trim()) {
      setFormError('Please enter a skill title');
      return;
    }
    
    if (!skillForm.description.trim()) {
      setFormError('Please enter a description');
      return;
    }
    
    setFormLoading(true);
    setFormError('');
    
    const skillData = {
      ...skillForm,
      providerId: loggedInUser?.id,
      providerName: loggedInUser?.firstname + ' ' + (loggedInUser?.lastname || '')
    };
    
    try {
      await axios.post('http://localhost:8080/api/v1/skills', skillData);
      setFormSuccess(true);
      setSkillForm({ title: '', description: '', category: 'Programming' });
      fetchSkills();
      setTimeout(() => setFormSuccess(false), 3000);
    } catch (err) {
      setFormError('Failed to publish your skill offer to the marketplace');
    } finally {
      setFormLoading(false);
    }
  };

  const openSwapModal = async (skill) => {
    if (!currentUserId) {
      alert("Please login first!");
      return;
    }
    if (skill.providerId === currentUserId) {
      alert("You cannot request a swap for your own skill!");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/api/v1/users/${skill.providerId}`);
      const fullProviderData = res.data;
      
      setTargetedSkill({
        ...skill,
        providerBio: fullProviderData.bio,
        providerMajor: fullProviderData.major,
        providerStudentId: fullProviderData.studentId
      });
      
      setSelectedOfferedSkillId('');
      setShowSwapModal(true);
    } catch (err) {
      console.error('Error fetching provider details:', err);
      setTargetedSkill(skill);
      setSelectedOfferedSkillId('');
      setShowSwapModal(true);
    }
  };

  const handleExecuteSwapRequest = async (e) => {
    e.preventDefault();

    if (!selectedOfferedSkillId) {
      alert("Please select one of your skills to offer in exchange.");
      return;
    }

    const chosenSkill = myOfferedSkills.find(s => String(s.id) === String(selectedOfferedSkillId));
    if (chosenSkill) {
      setConfirmedOfferedSkillTitle(chosenSkill.title);
    }

    try {
      const bookingRequest = {
        skillId: targetedSkill.id,
        skillTitle: targetedSkill.title,
        providerId: targetedSkill.providerId,
        providerName: targetedSkill.providerName || 'Student',
        requesterId: currentUserId,
        requesterName: `${loggedInUser?.firstname || ''} ${loggedInUser?.lastname || ''}`.trim() || 'Student',
        status: "PENDING"
      };

      await axios.post('http://localhost:8080/api/v1/bookings', bookingRequest);
      
      setShowSwapModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error details:', err.response?.data || err.message);
      alert("Failed to send request. Please try again.");
    }
  };

  const categories = ['all', 'Programming', 'Design', 'Academic', 'Language', 'Other'];
  
  const baseFilteredSkills = activeCatalogMode === 'my-postings' ? myOfferedSkills : skills;

  const filteredSkills = baseFilteredSkills.filter(skill => {
    const matchesSearch = skill.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          skill.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="SkillCatalogContainer">
        <div className="SkillsGrid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="SkeletonCard">
              <div className="SkeletonLine" style={{ width: '60%' }}></div>
              <div className="SkeletonLine" style={{ width: '80%' }}></div>
              <div className="SkeletonLine" style={{ width: '40%' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="SkillCatalogContainer">
      <div className="CatalogHeader">
        <div>
          <h1 className="CatalogTitle">Skill Marketplace</h1>
          <p className="CatalogSubtitle">Discover, manage, and swap skills with fellow CIT-U students</p>
        </div>
        <div className="StatsBadge">
          <span className="StatsNumber">{skills.length}</span>
          <span className="StatsLabel">Skills Available</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'white', padding: '8px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <button 
          className={`TabButton ${activeCatalogMode === 'all-postings' ? 'Active' : ''}`}
          style={{ background: activeCatalogMode === 'all-postings' ? '#238B7A' : 'transparent', color: activeCatalogMode === 'all-postings' ? 'white' : '#64748B', border: 'none', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s' }}
          onClick={() => setActiveCatalogMode('all-postings')}
        >
          All Postings
        </button>
        <button 
          className={`TabButton ${activeCatalogMode === 'my-postings' ? 'Active' : ''}`}
          style={{ background: activeCatalogMode === 'my-postings' ? '#238B7A' : 'transparent', color: activeCatalogMode === 'my-postings' ? 'white' : '#64748B', border: 'none', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s' }}
          onClick={() => setActiveCatalogMode('my-postings')}
        >
          My Offers ({myOfferedSkills.length})
        </button>
        <button 
          className={`TabButton ${activeCatalogMode === 'create-posting' ? 'Active' : ''}`}
          style={{ background: activeCatalogMode === 'create-posting' ? '#238B7A' : 'transparent', color: activeCatalogMode === 'create-posting' ? 'white' : '#64748B', border: 'none', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', borderRadius: '8px', transition: 'all 0.2s' }}
          onClick={() => setActiveCatalogMode('create-posting')}
        >
          + Offer New Skill
        </button>
      </div>

      {activeCatalogMode !== 'create-posting' ? (
        <>
          <div className="FilterBar">
            <div className="SearchContainer">
              <input
                type="text"
                className="SearchInput"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="CategoryFilters">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`CategoryBtn ${selectedCategory === cat ? 'Active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="SkillsGrid">
            {filteredSkills.map(skill => {
              const isOwnSkill = skill.providerId === currentUserId;
              const isAdmin = loggedInUser?.role === 'ADMIN';
              const isButtonDisabled = isOwnSkill || isAdmin;

              return (
                <div key={skill.id} className="SkillCard">
                  <div className="CardHeader">
                    <span className="CategoryTag">{skill.category || 'General'}</span>
                    {isOwnSkill && <span className="OwnSkillBadge">Your Skill</span>}
                    {isAdmin && <span className="OwnSkillBadge" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>Admin View</span>}
                  </div>

                  <h3 className="SkillTitle">{skill.title}</h3>
                  <p className="SkillDescription">{skill.description}</p>

                  <div className="CardFooter">
                    <div className="ProviderInfo">
                      <span className="ProviderName">{skill.providerName || 'Student'}</span>
                    </div>

                    <button
                      className="RequestBtn"
                      style={{
                        backgroundColor: isButtonDisabled ? '#CBD5E1' : '#238B7A',
                        color: isButtonDisabled ? '#64748B' : 'white',
                        cursor: isButtonDisabled ? 'not-allowed' : 'pointer'
                      }}
                      onClick={() => openSwapModal(skill)}
                      disabled={isButtonDisabled}
                    >
                      {isAdmin ? 'Read Only Mode' : isOwnSkill ? 'Your Skill' : 'Request Swap →'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}>
          <form onSubmit={handleCreateSkillSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {formSuccess && <div style={{ padding: '12px', background: '#D1FAE5', color: '#10B981', borderRadius: '10px', fontSize: '14px', textAlign: 'center' }}>Skill posted successfully! Returning to postings matrix...</div>}
            {formError && <div style={{ padding: '12px', background: '#FEF2F2', color: '#EF4444', borderRadius: '10px', fontSize: '14px', textAlign: 'center' }}>{formError}</div>}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Skill Title *</label>
              <input
                type="text"
                name="title"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #E2E8F0', fontSize: '14px', outline: 'none' }}
                placeholder="What skill can you offer? (e.g., ReactJS Basics, UI Design, Physics 1 Tutoring)"
                value={skillForm.title}
                onChange={handleFormChange}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Category *</label>
              <select
                name="category"
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '2px solid #E2E8F0', fontSize: '14px', outline: 'none', background: 'white' }}
                value={skillForm.category}
                onChange={handleFormChange}
              >
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Academic">Academic</option>
                <option value="Language">Language</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Description *</label>
              <textarea
                name="description"
                style={{ width: '100%', minHeight: '120px', padding: '12px 16px', borderRadius: '12px', border: '2px solid #E2E8F0', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                placeholder="Describe what you can teach and what you are looking for in exchange..."
                value={skillForm.description}
                onChange={handleFormChange}
                required
              />
            </div>

            <button 
              type="submit" 
              style={{ width: '100%', background: '#238B7A', color: 'white', border: 'none', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.3s' }}
              disabled={formLoading}
            >
              {formLoading ? 'Publishing Offer...' : 'Post to Marketplace'}
            </button>
          </form>
        </div>
      )}

      {showSwapModal && (
        <div className="modal-overlay" onClick={() => setShowSwapModal(false)}>
          <div className="logout-modal" style={{ maxWidth: '520px', width: '95%' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title" style={{ color: '#238B7A', marginBottom: '4px' }}>Confirm Skill Swap</h3>
            <p className="modal-message" style={{ marginBottom: '16px' }}>
              You are requesting to trade with <strong>{targetedSkill?.providerName}</strong> for their skill: <strong>"{targetedSkill?.title}"</strong>.
            </p>

            <div style={{ background: '#F0FDF4', padding: '14px', borderRadius: '8px', border: '1px solid #DCFCE7', textAlign: 'left', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                Provider Profile & Credentials
              </span>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                {targetedSkill?.providerName}
              </div>
              <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px', fontWeight: '500' }}>
                Course/Major: {targetedSkill?.providerMajor || 'Not Specified'}
              </div>
              <div style={{ fontSize: '13px', color: '#334155', marginTop: '8px', background: '#FFFFFF', padding: '8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                {targetedSkill?.providerBio || '"No biography overview provided by user."'}
              </div>
            </div>

            <form onSubmit={handleExecuteSwapRequest} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'left' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Your Requester Profile
                </span>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                  {loggedInUser?.firstname} {loggedInUser?.lastname}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  ID: {loggedInUser?.studentId} | Dept: {loggedInUser?.major}
                </div>
              </div>

              <div style={{ textAlign: 'left' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '8px' }}>
                  Select Which of Your Skills to Offer in Return *
                </label>
                
                {myOfferedSkills.length === 0 ? (
                  <div style={{ padding: '12px', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: '8px', color: '#DC2626', fontSize: '13px' }}>
                    You have not published any active skill postings yet. Use the tab above to list at least one skill before initiating a swap handshake.
                  </div>
                ) : (
                  <select
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #E2E8F0', background: 'white', fontSize: '14px', outline: 'none' }}
                    value={selectedOfferedSkillId}
                    onChange={(e) => setSelectedOfferedSkillId(e.target.value)}
                    required
                  >
                    <option value="">-- Choose one of your active posts --</option>
                    {myOfferedSkills.map(mySkill => (
                      <option key={mySkill.id} value={mySkill.id}>
                        [{mySkill.category}] {mySkill.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="modal-buttons" style={{ marginTop: '10px' }}>
                <button type="button" className="modal-btn cancel" onClick={() => setShowSwapModal(false)}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="modal-btn confirm"
                  style={{ backgroundColor: myOfferedSkills.length === 0 ? '#CBD5E1' : '#238B7A', cursor: myOfferedSkills.length === 0 ? 'not-allowed' : 'pointer' }}
                  disabled={myOfferedSkills.length === 0}
                >
                  Submit Swap Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="logout-modal" style={{ maxWidth: '460px', width: '95%', textAlign: 'center', padding: '36px 24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <span style={{ fontSize: '32px', color: '#16A34A', lineHeight: '1' }}>✓</span>
            </div>
            
            <h3 className="modal-title" style={{ color: '#1E293B', fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>
              Swap Request Submitted
            </h3>
            
            <p className="modal-message" style={{ color: '#64748B', fontSize: '14px', lineHeight: '1.5', marginBottom: '24px' }}>
              Your offer has been logged into the ledger system. A notification sequence has been forwarded to <strong>{targetedSkill?.providerName}</strong> for manual authorization.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'left', marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px dashed #E2E8F0', paddingBottom: '8px' }}>
                <span style={{ color: '#64748B', fontWeight: '500' }}>Target Skill:</span>
                <span style={{ color: '#1E293B', fontWeight: '600' }}>"{targetedSkill?.title}"</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '4px' }}>
                <span style={{ color: '#64748B', fontWeight: '500' }}>Your Offer:</span>
                <span style={{ color: '#238B7A', fontWeight: '600' }}>"{confirmedOfferedSkillTitle}"</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button 
                type="button" 
                className="modal-btn cancel" 
                style={{ width: '50%', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                onClick={() => setShowSuccessModal(false)}
              >
                Marketplace
              </button>
              <button 
                type="button" 
                className="modal-btn confirm" 
                style={{ background: '#238B7A', color: 'white', width: '50%', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                onClick={() => {
                  setShowSuccessModal(false);
                  onStartChat({ id: targetedSkill.providerId, name: targetedSkill.providerName });
                }}
              >
                💬 Open Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillCatalog;