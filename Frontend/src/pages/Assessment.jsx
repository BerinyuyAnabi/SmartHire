import "../css/Assessment.css";
import { useState, useEffect } from 'react';
import { preAssessmentData } from '../data/preAssessment';
import { useLocation } from "react-router-dom";

function Assessment() {
  const location = useLocation();
  const { formData, jobDetails } = location.state || {};
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(4 * 60 + 34); // 4 minutes 34 seconds in seconds
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Load saved answers from localStorage if available
  useEffect(() => {
    const savedAnswers = localStorage.getItem('assessmentAnswers');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
      setSelectedOption(JSON.parse(savedAnswers)[currentQuestionIndex] || null);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time as 00:04:34
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleAnswerChange = (e) => {
    const newAnswers = {
      ...answers,
      [currentQuestionIndex]: e.target.value
    };
    setAnswers(newAnswers);
    localStorage.setItem('assessmentAnswers', JSON.stringify(newAnswers));
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const newAnswers = {
      ...answers,
      [currentQuestionIndex]: option
    };
    setAnswers(newAnswers);
    localStorage.setItem('assessmentAnswers', JSON.stringify(newAnswers));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < preAssessmentData.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(answers[currentQuestionIndex + 1] || null);
        setIsAnimating(false);
      }, 300);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setSelectedOption(answers[currentQuestionIndex - 1] || null);
        setIsAnimating(false);
      }, 300);
    }
  };

  const calculateProgress = () => {
    return Math.round(((currentQuestionIndex + 1) / preAssessmentData.length) * 100);
  };

  const currentQuestion = preAssessmentData[currentQuestionIndex];
  const progressPercentage = calculateProgress();

  return (
    <div className="portal">
      {/* Header Section */}
      <div className="header-section">
        <h1>Pre-Assessment</h1>
        <p>Answer the following questions to help us better understand your qualifications</p>
        <div className="progress-container-assessment">
          <div className="progress-bar-assessment">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="progress-percentage">{progressPercentage}%</span>
          <button className="preview-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Preview
          </button>
        </div>
      </div>

      <div className="assessment-content">
        {/* Question Info Bar */}
        <div className="question-info">
          <p className="question-number">Question {currentQuestionIndex + 1} of {preAssessmentData.length}</p>
          <div className="timer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="clock-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="timer-countdown">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Text */}
        <div className={`question ${isAnimating ? 'fade-out' : 'fade-in'}`}>
          <p>{currentQuestion.question}</p>
        </div>

        {/* Answer Section */}
        <div className={`answer-section ${isAnimating ? 'fade-out' : 'fade-in'}`}>
          {currentQuestion.type === 'multiple-choice' ? (
            <div className="options-container">
              {currentQuestion.options.map((option, index) => (
                <div 
                  key={index}
                  className={`option ${selectedOption === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="input-container">
              <textarea
                value={answers[currentQuestionIndex] || ''}
                onChange={handleAnswerChange}
                placeholder="Type your answer here..."
                rows={6}
              />
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <button 
            className="nav-button-assessment previous-button"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Previous
          </button>
          <button 
            className="nav-button-assessment next-button"
            onClick={goToNextQuestion}
            disabled={currentQuestionIndex === preAssessmentData.length - 1}
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Assessment;