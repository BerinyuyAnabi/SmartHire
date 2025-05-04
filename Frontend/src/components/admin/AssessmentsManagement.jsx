// src/components/admin/AssessmentsManagement.js
import React, { useState, useEffect } from 'react';
import ModalPortal from '../common/ModalPortal';

function AssessmentsManagement() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  
  // Modal state
  const [showAssessmentForm, setShowAssessmentForm] = useState(false);
  const [showResponses, setShowResponses] = useState(false);
  const [currentAssessmentId, setCurrentAssessmentId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  useEffect(() => {
    fetchAssessments();
  }, []);
  
  const fetchAssessments = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/assessments', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch assessments');
      }
      
      const data = await response.json();
      setAssessments(data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
      setError('Failed to load assessments. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteAssessment = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/assessments/${assessmentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete assessment');
      }
      
      // Remove from local state
      setAssessments(prevAssessments => 
        prevAssessments.filter(assessment => assessment.id !== assessmentId)
      );
    } catch (error) {
      console.error('Error deleting assessment:', error);
      setError('Failed to delete assessment. Please try again.');
    }
  };
  
  // Modal handlers
  const handleAddNewAssessment = () => {
    setCurrentAssessmentId(null);
    setIsEditMode(false);
    setShowAssessmentForm(true);
  };
  
  const handleEditAssessment = (assessmentId) => {
    setCurrentAssessmentId(assessmentId);
    setIsEditMode(true);
    setShowAssessmentForm(true);
  };
  
  const handleViewResponses = (assessmentId) => {
    setCurrentAssessmentId(assessmentId);
    setShowResponses(true);
  };
  
  const handleFormClose = () => {
    setShowAssessmentForm(false);
    fetchAssessments(); // Refresh the list
  };
  
  const handleResponsesClose = () => {
    setShowResponses(false);
  };
  
  // Filter assessments based on search and filter criteria
  const filteredAssessments = assessments.filter(assessment => {
    // Search filter
    const matchesSearch = !search ? true : 
      assessment.question_text.toLowerCase().includes(search.toLowerCase());
    
    // Type filter
    const matchesType = filter === "All" ? true : assessment.question_type === filter;
    
    return matchesSearch && matchesType;
  });
  
  if (loading) return <div className="loading">Loading assessments...</div>;
  if (error) return <div className="error-message">{error}</div>;
  
  return (
    <div className="assessments-management">
      <div className="management-header">
        <h2>Pre-Assessment Management</h2>
        
        <div className="actions-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search assessments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <i className="fas fa-search search-icon"></i>
          </div>
          
          <button className="add-button" onClick={handleAddNewAssessment}>
            <i className="fas fa-plus-circle"></i> Add New Assessment
          </button>
        </div>
      </div>
      
      <div className="filter-options">
        <div className="filter-group">
          <label>Question Type:</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="multiple-choice">Multiple Choice</option>
            <option value="essay">Essay</option>
          </select>
        </div>
      </div>
      
      <div className="assessments-wrapper">
        {filteredAssessments.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-clipboard-check fa-2x"></i>
            <p>No assessments found. Create your first assessment!</p>
          </div>
        ) : (
          filteredAssessments.map(assessment => (
            <div key={assessment.id} className="assessment-card">
              <div className="assessment-header">
                <div className="assessment-type">
                  {assessment.question_type === 'multiple-choice' ? (
                    <i className="fas fa-tasks"></i>
                  ) : (
                    <i className="fas fa-pen"></i>
                  )}
                  <span>{assessment.question_type === 'multiple-choice' ? 'Multiple Choice' : 'Essay'}</span>
                </div>
                
                <div className="assessment-actions">
                  <button onClick={() => handleEditAssessment(assessment.id)} className="edit-button">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button onClick={() => deleteAssessment(assessment.id)} className="delete-button">
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
              
              <div className="assessment-content">
                <h3 className="question-text">{assessment.question_text}</h3>
                
                {assessment.question_type === 'multiple-choice' && assessment.options && (
                  <div className="options-preview">
                    {JSON.parse(assessment.options).map((option, index) => {
                      const isCorrect = JSON.parse(assessment.correct_answer).includes(option);
                      return (
                        <div key={index} className={`option ${isCorrect ? 'correct' : ''}`}>
                          <span className="option-marker">{String.fromCharCode(65 + index)}.</span>
                          <span className="option-text">{option}</span>
                          {isCorrect && <i className="fas fa-check"></i>}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {assessment.question_type === 'essay' && (
                  <div className="essay-preview">
                    <div className="essay-prompt">
                      <i className="fas fa-quote-left"></i>
                      <p>Free text response required</p>
                    </div>
                    {assessment.correct_answer && (
                      <div className="model-answer">
                        <h4>Model Answer (for reference):</h4>
                        <p>{assessment.correct_answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="assessment-footer">
                <button 
                  onClick={() => handleViewResponses(assessment.id)}
                  className="view-responses-button"
                >
                  <i className="fas fa-chart-bar"></i> View Responses
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Assessment Form Modal using ModalPortal */}
      <ModalPortal isOpen={showAssessmentForm}>
        <AssessmentFormModal
          onHide={handleFormClose}
          assessmentId={currentAssessmentId}
          isEdit={isEditMode}
        />
      </ModalPortal>
      
      {/* Assessment Responses Modal using ModalPortal */}
      <ModalPortal isOpen={showResponses}>
        <AssessmentResponsesModal
          onHide={handleResponsesClose}
          assessmentId={currentAssessmentId}
        />
      </ModalPortal>
    </div>
  );
}

// Assessment Form Modal Component
function AssessmentFormModal({ onHide, assessmentId, isEdit }) {
  const [loading, setLoading] = useState(assessmentId ? true : false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    question_text: '',
    question_type: 'multiple-choice',
    options: ['', '', '', ''],
    correct_answer: []
  });
  
  useEffect(() => {
    if (assessmentId && isEdit) {
      fetchAssessmentData();
    } else if (!assessmentId) {
      // Reset form for new assessment
      setFormData({
        question_text: '',
        question_type: 'multiple-choice',
        options: ['', '', '', ''],
        correct_answer: []
      });
      setError(null);
    }
  }, [assessmentId, isEdit]);
  
  const fetchAssessmentData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/assessments/${assessmentId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch assessment data');
      }
      
      const assessmentData = await response.json();
      
      // Convert options and correct_answer from string to array if needed
      let parsedOptions = assessmentData.options;
      let parsedCorrectAnswer = assessmentData.correct_answer;
      
      try {
        if (typeof assessmentData.options === 'string') {
          parsedOptions = JSON.parse(assessmentData.options);
        }
        
        if (typeof assessmentData.correct_answer === 'string' && assessmentData.question_type === 'multiple-choice') {
          parsedCorrectAnswer = JSON.parse(assessmentData.correct_answer);
        }
      } catch (e) {
        console.error('Error parsing JSON data', e);
      }
      
      setFormData({
        ...assessmentData,
        options: parsedOptions || ['', '', '', ''],
        correct_answer: parsedCorrectAnswer || []
      });
    } catch (error) {
      console.error('Error fetching assessment data:', error);
      setError('Failed to load assessment data for editing');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for question_type changes
    if (name === 'question_type') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        // Reset correct_answer when changing question type
        correct_answer: value === 'multiple-choice' ? [] : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleOptionChange = (index, value) => {
    setFormData(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = value;
      return {
        ...prev,
        options: newOptions
      };
    });
  };
  
  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };
  
  const removeOption = (index) => {
    setFormData(prev => {
      // Ensure we don't remove the correct answer
      const newOptions = [...prev.options];
      const removedOption = newOptions[index];
      newOptions.splice(index, 1);
      
      // Update correct_answer if the removed option was selected
      let newCorrectAnswer = [...prev.correct_answer];
      if (Array.isArray(newCorrectAnswer) && newCorrectAnswer.includes(removedOption)) {
        newCorrectAnswer = newCorrectAnswer.filter(opt => opt !== removedOption);
      }
      
      return {
        ...prev,
        options: newOptions,
        correct_answer: newCorrectAnswer
      };
    });
  };
  
  const handleCorrectAnswerChange = (option) => {
    setFormData(prev => {
      // For multiple-choice, toggle the selection
      if (prev.correct_answer.includes(option)) {
        return {
          ...prev,
          correct_answer: prev.correct_answer.filter(opt => opt !== option)
        };
      } else {
        return {
          ...prev,
          correct_answer: [...prev.correct_answer, option]
        };
      }
    });
  };
  
  const handleEssayAnswerChange = (value) => {
    setFormData(prev => ({
      ...prev,
      correct_answer: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Prepare data for API
      const payload = {
        ...formData,
        // Convert arrays to JSON strings for storage
        options: formData.question_type === 'multiple-choice' 
          ? JSON.stringify(formData.options.filter(opt => opt.trim()))
          : null,
        correct_answer: formData.question_type === 'multiple-choice'
          ? JSON.stringify(formData.correct_answer)
          : formData.correct_answer
      };
      
      const url = assessmentId ? `/api/assessments/${assessmentId}` : '/api/assessments';
      const method = assessmentId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to ${assessmentId ? 'update' : 'create'} assessment`);
      }
      
      onHide(); // Close modal and trigger refresh
    } catch (error) {
      console.error('Error saving assessment:', error);
      setError(`Failed to ${assessmentId ? 'update' : 'create'} assessment. Please try again.`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="modal-dialog assessment-form-modal">
      <div className="modal-content">
        <div className="modal-header custom-modal-header">
          <h2 className="modal-title">{isEdit ? 'Edit Assessment' : 'Create New Assessment'}</h2>
          <button type="button" className="btn-close" onClick={onHide} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body custom-modal-body">
        {error && <div className="error-message">{error}</div>}
        
        {loading ? (
          <div className="loading">Loading assessment data...</div>
        ) : (
          <form className="assessment-form">
            <div className="form-section">
              <div className="form-group">
                <label htmlFor="question_text">Question Text*</label>
                <textarea
                  id="question_text"
                  name="question_text"
                  value={formData.question_text}
                  onChange={handleChange}
                  required
                  placeholder="Enter your question here..."
                  rows="4"
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="question_type">Question Type</label>
                <select
                  id="question_type"
                  name="question_type"
                  value={formData.question_type}
                  onChange={handleChange}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="essay">Essay</option>
                </select>
              </div>
            </div>
            
            {formData.question_type === 'multiple-choice' ? (
              <div className="form-section">
                <h3>Answer Options</h3>
                
                {formData.options.map((option, index) => (
                  <div key={`option-${index}`} className="option-field">
                    <div className="option-input-group">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      
                      <div className="option-actions">
                        <label className="correct-answer-toggle">
                          <input
                            type="checkbox"
                            checked={formData.correct_answer.includes(option)}
                            onChange={() => handleCorrectAnswerChange(option)}
                            disabled={!option.trim()}
                          />
                          <span className="toggle-label">Correct</span>
                        </label>
                        
                        {formData.options.length > 2 && (
                          <button 
                            type="button" 
                            onClick={() => removeOption(index)}
                            className="remove-option-btn"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <button 
                  type="button" 
                  onClick={addOption}
                  className="add-option-btn"
                >
                  <i className="fas fa-plus-circle"></i> Add Option
                </button>
                
                {formData.correct_answer.length === 0 && formData.options.some(opt => opt.trim()) && (
                  <div className="validation-warning">
                    <i className="fas fa-exclamation-triangle"></i>
                    Please select at least one correct answer
                  </div>
                )}
              </div>
            ) : (
              <div className="form-section">
                <h3>Model Answer (Optional)</h3>
                <div className="form-group">
                  <textarea
                    id="essay_answer"
                    name="essay_answer"
                    value={formData.correct_answer || ''}
                    onChange={(e) => handleEssayAnswerChange(e.target.value)}
                    placeholder="Enter a model answer or grading criteria for reference (optional)..."
                    rows="6"
                  ></textarea>
                  <div className="hint">
                    <i className="fas fa-info-circle"></i>
                    This model answer is for reference only and won't be automatically used for grading.
                  </div>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
      
        <div className="modal-footer custom-modal-footer">
          <button type="button" onClick={onHide} className="cancel-button">
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSubmit} 
            className="submit-button" 
            disabled={
              loading || 
              !formData.question_text.trim() || 
              (formData.question_type === 'multiple-choice' && 
               (formData.options.filter(opt => opt.trim()).length < 2 || 
                formData.correct_answer.length === 0))
            }
          >
            {loading ? 'Saving...' : (isEdit ? 'Update Assessment' : 'Create Assessment')}
          </button>
        </div>
      </div>
    </div>
  );
}

// Assessment Responses Modal Component
function AssessmentResponsesModal({ onHide, assessmentId }) {
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalResponses: 0,
    correctCount: 0,
    incorrectCount: 0,
    correctPercentage: 0
  });
  
  useEffect(() => {
    if (assessmentId) {
      fetchData();
    }
  }, [assessmentId]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const [assessmentResponse, answersResponse] = await Promise.all([
        fetch(`/api/assessments/${assessmentId}`, { credentials: 'include' }),
        fetch(`/api/assessments/${assessmentId}/answers`, { credentials: 'include' })
      ]);
      
      if (!assessmentResponse.ok || !answersResponse.ok) {
        throw new Error('Failed to fetch assessment data');
      }
      
      const [assessmentData, answersData] = await Promise.all([
        assessmentResponse.json(),
        answersResponse.json()
      ]);
      
      setAssessment(assessmentData);
      setAnswers(answersData);
      
      // Calculate statistics
      if (answersData.length > 0) {
        const correctCount = answersData.filter(answer => answer.is_correct).length;
        setStats({
          totalResponses: answersData.length,
          correctCount,
          incorrectCount: answersData.length - correctCount,
          correctPercentage: Math.round((correctCount / answersData.length) * 100)
        });
      }
    } catch (error) {
      console.error('Error fetching assessment responses:', error);
      setError('Failed to load assessment responses');
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewApplicant = (applicantId) => {
    // Navigate to applicant detail page
    window.location.href = `/admin/applicants/${applicantId}`;
    onHide(); // Close the modal
  };
  
  return (
    <div className="modal-dialog assessment-responses-modal">
      <div className="modal-content">
        <div className="modal-header custom-modal-header">
          <h2 className="modal-title">Assessment Responses</h2>
          <button type="button" className="btn-close" onClick={onHide} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="modal-body custom-modal-body">
        {loading ? (
          <div className="loading">Loading assessment responses...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : !assessment ? (
          <div className="not-found">Assessment not found</div>
        ) : (
          <div className="assessment-responses-content">
            <div className="assessment-info">
              <div className="question-display">
                <div className="question-type-badge">
                  {assessment.question_type === 'multiple-choice' ? (
                    <><i className="fas fa-tasks"></i> Multiple Choice</>
                  ) : (
                    <><i className="fas fa-pen"></i> Essay</>
                  )}
                </div>
                <h3>{assessment.question_text}</h3>
                
                {assessment.question_type === 'multiple-choice' && assessment.options && (
                  <div className="options-display">
                    {JSON.parse(assessment.options).map((option, index) => {
                      const isCorrect = JSON.parse(assessment.correct_answer).includes(option);
                      return (
                        <div key={index} className={`option ${isCorrect ? 'correct' : ''}`}>
                          <span className="option-marker">{String.fromCharCode(65 + index)}.</span>
                          <span className="option-text">{option}</span>
                          {isCorrect && <i className="fas fa-check"></i>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              
              {assessment.question_type === 'multiple-choice' && (
                <div className="response-stats">
                  <h3>Response Statistics</h3>
                  
                  <div className="stats-grid">
                    <div className="stat-card total">
                      <span className="stat-value">{stats.totalResponses}</span>
                      <span className="stat-label">Total Responses</span>
                    </div>
                    
                    <div className="stat-card correct">
                      <span className="stat-value">{stats.correctCount}</span>
                      <span className="stat-label">Correct</span>
                    </div>
                    
                    <div className="stat-card incorrect">
                      <span className="stat-value">{stats.incorrectCount}</span>
                      <span className="stat-label">Incorrect</span>
                    </div>
                    
                    <div className="stat-card percentage">
                      <span className="stat-value">{stats.correctPercentage}%</span>
                      <span className="stat-label">Correct Rate</span>
                    </div>
                  </div>
                  
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar"
                      style={{ width: `${stats.correctPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="responses-list-container">
              <h3>Individual Responses</h3>
              
              {answers.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-inbox fa-2x"></i>
                  <p>No responses yet for this assessment</p>
                </div>
              ) : (
                <div className="responses-list">
                  {answers.map((answer) => (
                    <div 
                      key={answer.id} 
                      className={`response-item ${assessment.question_type === 'multiple-choice' ? 
                        (answer.is_correct ? 'correct' : 'incorrect') : ''}`}
                    >
                      <div className="response-header">
                        <div 
                          className="applicant-info"
                          onClick={() => handleViewApplicant(answer.applicant_id)}
                        >
                          <i className="fas fa-user-circle"></i>
                          <span>{answer.applicant?.full_name || `Applicant #${answer.applicant_id}`}</span>
                        </div>
                        
                        {assessment.question_type === 'multiple-choice' && (
                          <div className="response-status">
                            {answer.is_correct ? (
                              <span className="correct-badge">
                                <i className="fas fa-check-circle"></i> Correct
                              </span>
                            ) : (
                              <span className="incorrect-badge">
                                <i className="fas fa-times-circle"></i> Incorrect
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="response-content">
                        <h4>Response:</h4>
                        {assessment.question_type === 'multiple-choice' ? (
                          <div className="selected-option">
                            {answer.answer}
                          </div>
                        ) : (
                          <div className="essay-response">
                            <p>{answer.answer}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="response-footer">
                        <button 
                          onClick={() => handleViewApplicant(answer.applicant_id)}
                          className="view-applicant-btn"
                        >
                          <i className="fas fa-user"></i> View Applicant Profile
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
        <div className="modal-footer custom-modal-footer">
          <button className="back-button" onClick={onHide}>
            <i className="fas fa-arrow-left"></i> Back to Assessments
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssessmentsManagement;