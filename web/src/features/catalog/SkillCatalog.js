// src/features/catalog/SkillCatalog.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/SkillCatalog.css';  // ← Fixed: goes up 2 levels to src, then into styles



const SkillCatalog = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // FIX: Better user data retrieval
  const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    const loggedInUser = storedUser ? JSON.parse(storedUser) : null;
  const currentUserId = loggedInUser?.id;  // Make sure this is getting the ID
  
  // Debug: Log to console to verify
  console.log('Logged in user:', loggedInUser);
  console.log('Current user ID:', currentUserId);


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

 const handleRequestSwap = async (skill) => {
  if (!currentUserId) {
    alert("Please login first!");
    console.log('No user ID found. User data:', loggedInUser);
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
      requesterName: `${loggedInUser?.firstname || ''} ${loggedInUser?.lastname || ''}`.trim() || 'Student',
      status: "PENDING"
    };

    console.log('Sending booking request:', bookingRequest);
    console.log('Requester ID being sent:', currentUserId);
    console.log('Provider ID:', skill.providerId);

    const response = await axios.post('http://localhost:8080/api/v1/bookings', bookingRequest);
    console.log('Booking response:', response.data);
    
    alert(`Request for "${skill.title}" sent successfully!`);
  } catch (err) {
    console.error('Error details:', err.response?.data || err.message);
    alert("Failed to send request. Please try again.");
  }
};

  const categories = ['all', 'Programming', 'Design', 'Academic', 'Language', 'Other'];
  
  const filteredSkills = skills.filter(skill => {
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
          <p className="CatalogSubtitle">Discover and swap skills with fellow CIT-U students</p>
        </div>
        <div className="StatsBadge">
          <span className="StatsNumber">{skills.length}</span>
          <span className="StatsLabel">Skills Available</span>
        </div>
      </div>

      <div className="FilterBar">
        <div className="SearchContainer">
          <span className="SearchIcon">🔍</span>
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

      {filteredSkills.length === 0 ? (
        <div className="EmptyState">
          <span className="EmptyIcon">🌿</span>
          <h3 className="EmptyTitle">No skills found</h3>
          <p className="EmptyText">Try adjusting your search or be the first to offer a skill!</p>
          <button className="EmptyBtn">Offer a Skill</button>
        </div>
      ) : (
        <div className="SkillsGrid">
          {filteredSkills.map(skill => {
            const isOwnSkill = skill.providerId === currentUserId;
            return (
              <div key={skill.id} className="SkillCard">
                <div className="CardHeader">
                  <span className="CategoryTag">{skill.category || 'General'}</span>
                  {isOwnSkill && <span className="OwnSkillBadge">Your Skill</span>}
                </div>
                
                <h3 className="SkillTitle">{skill.title}</h3>
                <p className="SkillDescription">
                  {skill.description || 'No description provided'}
                </p>
                
                <div className="CardFooter">
                  <div className="ProviderInfo">
                    <div className="ProviderAvatar">
                      {skill.providerName ? skill.providerName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="ProviderName">{skill.providerName || 'Student'}</span>
                  </div>
                  
                  <button
                    className="RequestBtn"
                    style={{
                      backgroundColor: isOwnSkill ? '#CBD5E1' : '#0F766E',
                      color: isOwnSkill ? '#64748B' : 'white',
                      cursor: isOwnSkill ? 'not-allowed' : 'pointer'
                    }}
                    onClick={() => handleRequestSwap(skill)}
                    disabled={isOwnSkill}
                  >
                    {isOwnSkill ? 'Your Skill' : 'Request Swap →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SkillCatalog;