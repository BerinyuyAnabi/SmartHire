// src/components/assessment/CSAssessmentWithCustomStyle.js
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function CSAssessmentWithCustomStyle() {
  const { assessmentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get jobDetails from location state or set defaults
  const jobDetails = location.state?.jobDetails || {
    jobName: "Software Engineering Position",
    company: "Tech Company"
  };
  
  // Get applicantId from location state or localStorage
  const applicantId = location.state?.applicantId || localStorage.getItem('applicantId');
  
  const [assessment, setAssessment] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);

  // Load assessment data
  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/public/assessments/${assessmentId}`);
        
        if (!response.ok) {
          throw new Error('Failed to load assessment');
        }
        
        const data = await response.json();
        setAssessment(data);
        
        // Initialize empty answers for all questions
        const initialAnswers = {};
        if (data.questions) {
          data.questions.forEach(question => {
            initialAnswers[question.id] = '';
          });
        }
        setAnswers(initialAnswers);
        
      } catch (error) {
        console.error('Error loading assessment:', error);
        setError('Failed to load the assessment. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssessment();
  }, [assessmentId]);

  // Timer countdown
  useEffect(() => {
    if (!loading && assessment && !showResult) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            submitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [loading, assessment, showResult]);

  // Format the time remaining as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Submit assessment answers
  const submitAssessment = async () => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      if (!applicantId) {
        setError('Unable to identify applicant. Please return to the application form.');
        setSubmitting(false);
        return;
      }
      
      const response = await fetch(`/api/public/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicant_id: applicantId,
          answers: answers
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }
      
      const data = await response.json();
      setResult(data);
      setShowResult(true);
      
    } catch (error) {
      console.error('Error submitting assessment:', error);
      setError('Failed to submit your assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle complete assessment button
  const handleCompleteAssessment = () => {
    if (window.confirm('Are you sure you want to submit your assessment? You cannot change your answers after submission.')) {
      submitAssessment();
    }
  };

  // SVG Icons
  const ClockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );

  const PrevIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );

  const NextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );

  // Render loading state
  if (loading) {
    return (
      <div className="apply-page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading assessment...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="apply-page-container">
        <div className="error-message text-center py-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#f44336', marginBottom: '1rem'}}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3 style={{color: '#333', marginBottom: '1rem'}}>Error</h3>
          <p style={{color: '#666', marginBottom: '1.5rem'}}>{error}</p>
          <button onClick={() => window.history.back()} className="btn btn-back">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render result page
  if (showResult) {
    return (
      <div className="apply-page-container">
        <div className="apply-header fade-in">
          <div className="apply-header-bg"></div>
          <div className="apply-header-content">
            <h1 className="apply-title">Assessment Complete</h1>
            <p className="apply-subtitle">Thank you for completing the technical assessment</p>
          </div>
        </div>
        
        <div className="apply-form-card fade-in-up">
          <div className="job-info-bar">
            <div>
              <h3 className="job-info-title">{jobDetails.jobName}</h3>
              <h4 className="job-info-company">{jobDetails.company}</h4>
            </div>
          </div>
          
          <div className="apply-form-content text-center py-4">
            <div className={`result-score-circle ${result.score >= 70 ? 'good-score' : 'low-score'}`}>
              <div className="score-value">{Math.round(result.score)}%</div>
              <div className="score-label">Score</div>
            </div>
            
            <div className="score-details mt-3">
              <p>You answered {result.correct_count} out of {result.total_questions} questions correctly.</p>
            </div>
            
            <div className="result-message mt-4 mb-4">
              <div className="alert" style={{backgroundColor: 'var(--gray-100)', padding: '1.5rem', borderRadius: 'var(--border-radius)', color: 'var(--gray-800)'}}>
                <p className="mb-2" style={{fontSize: '1.1rem'}}>Thank you for completing the technical assessment.</p>
                <p style={{marginBottom: 0}}>Our team will review your application and contact you regarding next steps.</p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/')} 
              className="btn btn-continue mt-3"
              style={{paddingLeft: '3rem', paddingRight: '3rem'}}
            >
              Return to Job Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get current question
  const currentQuestion = assessment?.questions[currentQuestionIndex];

  // Render assessment
  return (
    <div className="apply-page-container">
      <div className="apply-header fade-in">
        <div className="apply-header-bg"></div>
        <div className="apply-header-content">
          <h1 className="apply-title">Technical Assessment</h1>
          <p className="apply-subtitle">Showcase your technical knowledge</p>
        </div>
      </div>
      
      <div className="apply-form-card fade-in-up">
        <div className="job-info-bar">
          <div>
            <h3 className="job-info-title">{jobDetails.jobName}</h3>
            <h4 className="job-info-company">{jobDetails.company}</h4>
          </div>
          
          <div className="assessment-timer">
            <ClockIcon />
            <span className={timeRemaining < 60 ? 'text-danger' : ''}>
              Time Remaining: {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        
        <div className="progress-container">
          <div className="progress-label">
            Question {currentQuestionIndex + 1} of {assessment.questions.length}
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar" 
              style={{width: `${(currentQuestionIndex + 1) / assessment.questions.length * 100}%`}}
            ></div>
          </div>
          <div className="progress-text">
            {Math.round(((currentQuestionIndex + 1) / assessment.questions.length) * 100)}% Complete
          </div>
        </div>
        
        <div className="apply-form-content">
          <div className="question-card">
            <h3 className="question-title">{currentQuestion.question}</h3>
            
            <div className="options-list">
              {currentQuestion.options.map((option, index) => (
                <div 
                  key={index}
                  className={`option-item ${answers[currentQuestion.id] === option ? 'selected' : ''}`}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                >
                  <div className="option-marker">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="option-text">
                    {option}
                  </div>
                  {answers[currentQuestion.id] === option && (
                    <div className="option-selected">
                      <CheckIcon />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="question-nav-dots">
            {assessment.questions.map((_, index) => (
              <div 
                key={index}
                className={`nav-dot ${index === currentQuestionIndex ? 'active' : ''} ${answers[assessment.questions[index].id] ? 'answered' : ''}`}
                onClick={() => setCurrentQuestionIndex(index)}
              ></div>
            ))}
          </div>
          
          <div className="action-buttons">
            <button 
              type="button" 
              className="btn btn-back" 
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <PrevIcon /> Previous
            </button>
            
            {currentQuestionIndex < assessment.questions.length - 1 ? (
              <button 
                type="button" 
                className="btn btn-continue" 
                onClick={handleNextQuestion}
              >
                Next <NextIcon />
              </button>
            ) : (
              <button 
                type="button" 
                className="btn btn-continue" 
                onClick={handleCompleteAssessment}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Complete Assessment'} {!submitting && <CheckIcon />}
              </button>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        /* Additional styles for the assessment */
        .assessment-timer {
          display: flex;
          align-items: center;
          background-color: var(--white);
          padding: 0.625rem 1rem;
          border-radius: 50px;
          color: var(--gray-800);
          font-weight: 500;
          font-size: 0.9rem;
          border: 1px solid var(--gray-200);
        }
        
        .assessment-timer svg {
          margin-right: 0.5rem;
          color: var(--primary);
        }
        
        .question-card {
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow-sm);
          padding: 1.75rem;
          margin-bottom: 2rem;
          border: 1px solid var(--gray-200);
        }
        
        .question-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gray-900);
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        
        .options-list {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        
        .option-item {
          display: flex;
          align-items: center;
          padding: 1rem 1.25rem;
          background-color: var(--off-white);
          border: 1px solid var(--gray-200);
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .option-item:hover {
          background-color: var(--gray-100);
          transform: translateY(-2px);
          box-shadow: var(--shadow-sm);
        }
        
        .option-item.selected {
          background-color: rgba(1, 160, 160, 0.08);
          border-color: var(--primary);
        }
        
        .option-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background-color: var(--white);
          border-radius: 50%;
          margin-right: 1rem;
          font-weight: 600;
          color: var(--gray-700);
          border: 1px solid var(--gray-300);
          transition: var(--transition);
        }
        
        .option-item.selected .option-marker {
          background-color: var(--primary);
          color: var(--white);
          border-color: var(--primary);
        }
        
        .option-text {
          flex: 1;
          font-size: 1rem;
          color: var(--gray-800);
        }
        
        .option-selected {
          color: var(--primary);
          margin-left: 0.875rem;
        }
        
        .question-nav-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }
        
        .nav-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--gray-300);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .nav-dot.active {
          background-color: var(--primary);
          transform: scale(1.2);
        }
        
        .nav-dot.answered {
          background-color: var(--primary-light);
        }
        
        .result-score-circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          border-width: 6px;
          border-style: solid;
        }
        
        .good-score {
          border-color: var(--primary);
          background-color: rgba(1, 160, 160, 0.08);
        }
        
        .low-score {
          border-color: #f44336;
          background-color: rgba(244, 67, 54, 0.08);
        }
        
        .score-value {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.25rem;
        }
        
        .good-score .score-value {
          color: var(--primary);
        }
        
        .low-score .score-value {
          color: #f44336;
        }
        
        .score-label {
          font-size: 1rem;
          color: var(--gray-600);
          font-weight: 500;
        }
        
        @media (max-width: 768px) {
          .job-info-bar {
            flex-direction: column;
            gap: 1rem;
          }
          
          .assessment-timer {
            align-self: flex-start;
          }
          
          .option-item {
            padding: 0.875rem 1rem;
          }
          
          .option-marker {
            width: 28px;
            height: 28px;
            margin-right: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}

export default CSAssessmentWithCustomStyle;