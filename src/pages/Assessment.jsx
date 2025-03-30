import "../css/Assessment.css";
import { useState, useEffect } from 'react';
import { preAssessmentData } from '../data/preAssessment'; 

function Assessment() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(4 * 60 + 34); // 4 minutes 34 seconds in seconds
  const [selectedOption, setSelectedOption] = useState(null);

  // Load saved answers from localStorage if available
  useEffect(() => {
    const savedAnswers = localStorage.getItem('assessmentAnswers');
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
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
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(answers[currentQuestionIndex + 1] || null);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedOption(answers[currentQuestionIndex - 1] || null);
    }
  };

  const calculateProgress = () => {
    return Math.round(((currentQuestionIndex + 1) / preAssessmentData.length) * 100);
  };

  const currentQuestion = preAssessmentData[currentQuestionIndex];

  return (
    <div className="portal">
      <div className="header-section">
        <h1>Pre Assessment</h1>
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <span className="progress-percentage">{calculateProgress()}%</span>
          <button className="preview-btn">Preview</button>
        </div>
      </div>

      <div className="question-info">
        <p>Question {currentQuestionIndex + 1} of {preAssessmentData.length}</p>
        <div className="timer">
          <span className="clock-icon">⏰</span> Time: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="question">
        <p>{currentQuestion.question}</p>
      </div>

      <div className="answer-section">
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
              placeholder="Type your answer..."
              rows={5}
            />
          </div>
        )}
      </div>

      <div className="navigation-buttons">
        <button 
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          &larr; Previous
        </button>
        <button 
          onClick={goToNextQuestion}
          disabled={currentQuestionIndex === preAssessmentData.length - 1}
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );
}

export default Assessment;