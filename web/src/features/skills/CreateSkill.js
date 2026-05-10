import React, { useState } from 'react';
import axios from 'axios';
import './CreateSkill.css'; 

const CreateSkill = () => {
  const [skill, setSkill] = useState({
    title: '',
    description: '',
    category: 'Programming'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const loggedInUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!skill.title.trim()) {
      setError('Please enter a skill title');
      return;
    }
    
    if (!skill.description.trim()) {
      setError('Please enter a description');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const skillData = {
      ...skill,
      providerId: loggedInUser?.id,
      providerName: loggedInUser?.firstname + ' ' + (loggedInUser?.lastname || '')
    };
    
    try {
      await axios.post('http://localhost:8080/api/v1/skills', skillData);
      setSuccess(true);
      setSkill({ title: '', description: '', category: 'Programming' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to create skill. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSkill({ ...skill, [e.target.name]: e.target.value });
  };

  return (
    <div className="CreateSkillContainer">
      <div className="CreateSkillHeader">
        <h1 className="CreateSkillTitle">Offer a Skill</h1>
        <p className="CreateSkillSubtitle">Share your expertise with the community</p>
      </div>

      <div className="FormCard">
        {success && (
          <div className="SuccessMessage">
            ✓ Skill posted successfully! It will appear in the marketplace.
          </div>
        )}
        
        {error && (
          <div className="ErrorMessage">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="SkillForm">
          <div className="FormGroup">
            <label className="FormLabel">
              <span className="FormLabelIcon"></span>
              Skill Title *
            </label>
            <input
              type="text"
              name="title"
              className="FormInput"
              placeholder="e.g., React Development, Calculus Tutoring, Graphic Design"
              value={skill.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="FormGroup">
            <label className="FormLabel">
              <span className="FormLabelIcon"></span>
              Category *
            </label>
            <select
              name="category"
              className="FormSelect"
              value={skill.category}
              onChange={handleChange}
              required
            >
              <option value="Programming"> Programming</option>
              <option value="Design"> Design</option>
              <option value="Academic"> Academic</option>
              <option value="Language"> Language</option>
              <option value="Other"> Other</option>
            </select>
          </div>

          <div className="FormGroup">
            <label className="FormLabel">
              <span className="FormLabelIcon"></span>
              Description *
            </label>
            <textarea
              name="description"
              className="FormTextarea"
              placeholder="Briefly describe what you can teach and what you're looking for in return..."
              value={skill.description}
              onChange={handleChange}
              required
            />
            <p className="HelperText">Be specific about your skill and what you'd like to learn in exchange</p>
          </div>

          <button 
            type="submit" 
            className="SubmitButton"
            disabled={loading}
          >
            {loading ? <span className="Spinner"></span> : 'Post to Marketplace'}
          </button>
        </form>

        {/* Live Preview */}
        {skill.title && (
          <div className="PreviewSection">
            <h4 className="PreviewTitle">Preview</h4>
            <div className="PreviewCard">
              <span className="PreviewCategory">{skill.category}</span>
              <h3 className="PreviewTitle">{skill.title}</h3>
              <p className="PreviewDescription">{skill.description || 'Your description will appear here...'}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSkill;