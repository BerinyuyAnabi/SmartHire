import "../css/Assessment.css";
import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from "react-router-dom";

function Assessment() {
  // Get assessment ID from URL params and navigation function
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { jobDetails, applicantId } = location.state || {};

  // State variables
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Load assessment questions from the server based on assessmentId
  useEffect(() => {
    // Only fetch if we have an assessment ID
    if (!assessmentId) {
      setError("No assessment ID provided. Please start the application process again.");
      setIsLoading(false);
      return;
    }

    const fetchAssessment = async () => {
      try {
        setIsLoading(true);
        console.log(`Fetching assessment with ID: ${assessmentId}`);
        
        // Attempt to fetch questions from the server
        const response = await fetch(`/api/public/assessments/${assessmentId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load assessment: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Raw data received:", data);
        
        // Check for questions array in different possible structures
        const questionsArray = data.questions || data || [];
        
        if (!questionsArray || !Array.isArray(questionsArray) || questionsArray.length === 0) {
          throw new Error("No questions found for this assessment");
        }
        
        console.log("Questions array before normalization:", questionsArray);
        
        // Normalize the question structure to match what the component expects
        const normalizedQuestions = questionsArray.map(q => ({
          id: q.id || `q_${Math.random().toString(36).substr(2, 9)}`,
          question: q.question_text || q.question || '', // First check for question_text (from API)
          options: q.options || [],
          type: q.question_type || q.type || 'multiple-choice'
        }));
        
        console.log(`Loaded ${normalizedQuestions.length} questions after normalization:`, normalizedQuestions);
        setQuestions(normalizedQuestions);
        
        // Check if we have saved answers
        const savedAnswerKey = `assessment_${assessmentId}_answers`;
        const savedAnswers = localStorage.getItem(savedAnswerKey);
        
        if (savedAnswers) {
          const parsedAnswers = JSON.parse(savedAnswers);
          setAnswers(parsedAnswers);
          setSelectedOption(parsedAnswers[0] || null);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading assessment:", error);
        
        // For development/demo: load sample questions if server fetch fails
        console.log("Loading sample questions for development/demo");
        
        // Sample questions based on the question_bank.py structure
        // Sample questions based on the question_bank.py structure
        const sampleQuestions = [
          {
            id: "prog_1",
            question: "What is the time complexity of binary search on a sorted array?", // Change questionText to question
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            type: "multiple-choice"
          },
          {
            id: "fe_1",
            question: "Which of the following is NOT a JavaScript framework or library?", // Change questionText to question
            options: ["React", "Angular", "Vue", "Servlet"],
            type: "multiple-choice"
          },
          {
            id: "be_1",
            question: "What does REST stand for in the context of API design?", // Change questionText to question
            options: [
              "Reactive State Transfer",
              "Representational State Transfer",
              "Request-Response State Technology",
              "Remote Endpoint Service Transactions"
            ],
            type: "multiple-choice"
          },
          {
            id: "db_1",
            question: "Which of the following is a NoSQL database?", // Change questionText to question
            options: ["MySQL", "PostgreSQL", "Oracle", "MongoDB"],
            type: "multiple-choice"
          },
          {
            id: "devops_1",
            question: "What is the main purpose of container technology like Docker?", // Change questionText to question
            options: [
              "To virtualize entire operating systems",
              "To package applications with their dependencies for consistent deployment",
              "To create backups of application data",
              "To optimize database queries"
            ],
            type: "multiple-choice"
          },
          {
            id: "code_1",
            question: "Review the following code snippet and explain what it does:\n\n```javascript\nfunction mystery(arr) {\n  return arr.reduce((a, b) => a + b, 0) / arr.length;\n}\n```", // Change questionText to question
            type: "text",
            placeholder: "Write your explanation here..."
          }
        ];        
        setQuestions(sampleQuestions);
        setIsLoading(false);
      }
    };

    fetchAssessment();
  }, [assessmentId]);

  // For debugging - log current question whenever it changes
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      console.log("Current question being displayed:", questions[currentQuestionIndex]);
    }
  }, [questions, currentQuestionIndex]);

  // Save answers to localStorage whenever they change
  useEffect(() => {
    if (assessmentId && Object.keys(answers).length > 0) {
      localStorage.setItem(`assessment_${assessmentId}_answers`, JSON.stringify(answers));
    }
  }, [answers, assessmentId]);

  // Timer effect
  useEffect(() => {
    if (isLoading || assessmentCompleted) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time expires
          handleSubmitAssessment();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading, assessmentCompleted]);

  // Format time as 00:30:00
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const handleTextAnswerChange = (e) => {
    const newAnswers = {
      ...answers,
      [currentQuestionIndex]: e.target.value
    };
    setAnswers(newAnswers);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    const newAnswers = {
      ...answers,
      [currentQuestionIndex]: option
    };
    setAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
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
    if (!questions.length) return 0;
    return Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  };

  const isLastQuestion = () => {
    return currentQuestionIndex === questions.length - 1;
  };

  const handleSubmitAssessment = async () => {
    if (submitting) return;
    
    setSubmitting(true);
    setErrorMessage(null);
    
    try {
      console.log("Original questions:", questions);
      
      // Format the answers correctly for the backend
      const answersArray = Object.entries(answers).map(([index, value]) => {
        const questionIndex = parseInt(index);
        const question = questions[questionIndex];
        
        // Extract the ID directly from the question object
        const questionId = question?.id;
        
        console.log(`Mapping answer at index ${index} to question ID ${questionId}`, question);
        
        if (!questionId) {
          console.error(`No question ID found for index ${index}`);
          throw new Error(`Question ID not found for question at index ${index}`);
        }
        
        return {
          question_id: questionId,
          answer: value
        };
      });
      
      console.log("Submitting assessment answers:", answersArray);
      
      // Submit answers to the server
      const response = await fetch(`/api/public/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          applicant_id: applicantId,
          answers: answersArray
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Check for the specific foreign key constraint error
        if (errorData.error && errorData.error.includes("foreign key constraint fails")) {
          setErrorMessage({
            type: "error",
            text: "There's a mismatch between your answers and the server's questions. Please refresh the page and try again."
          });
          console.error("Foreign key constraint error:", errorData.error);
        } else {
          setErrorMessage({
            type: "error",
            text: `Submission failed: ${errorData.error || response.statusText}`
          });
        }
        
        throw new Error(`Submission failed: ${errorData.error || response.statusText}`);
      }
      
      // Success path
      const result = await response.json();
      console.log("Assessment submission result:", result);
      
      // Show success message
      setErrorMessage({
        type: "success",
        text: "Assessment submitted successfully!"
      });
      
      // Clear saved answers after successful submission
      localStorage.removeItem(`assessment_${assessmentId}_answers`);
      
      // Mark assessment as completed
      setAssessmentCompleted(true);
      
      // Navigate to the completion page
      setTimeout(() => {
        navigate('/assessment-complete', { 
          state: { 
            assessmentId, 
            jobDetails,
            result
          } 
        });
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      
      // If we haven't already set a specific error message above
      if (!errorMessage) {
        setErrorMessage({
          type: "error",
          text: error.message || "There was a problem submitting your assessment. Please try again."
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="portal">
        <div className="assessment-loading">
          <div className="loading-spinner"></div>
          <h2>Loading Assessment...</h2>
          <p>Please wait while we prepare your questions</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="portal">
        <div className="assessment-error">
          <div className="error-icon">⚠️</div>
          <h2>Could Not Load Assessment</h2>
          <p>{error}</p>
          <button 
            className="nav-button-assessment"
            onClick={() => navigate('/jobs')}
          >
            Return to Jobs
          </button>
        </div>
      </div>
    );
  }

  // Assessment completed state
  if (assessmentCompleted) {
    return (
      <div className="portal">
        <div className="assessment-completed">
          <div className="success-icon">✓</div>
          <h2>Assessment Submitted</h2>
          <p>Thank you for completing the assessment!</p>
          <p>Redirecting to results page...</p>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Empty questions array
  if (!questions.length) {
    return (
      <div className="portal">
        <div className="assessment-error">
          <div className="error-icon">⚠️</div>
          <h2>No Questions Available</h2>
          <p>There are no questions available for this assessment.</p>
          <button 
            className="nav-button-assessment"
            onClick={() => navigate('/jobs')}
          >
            Return to Jobs
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = calculateProgress();

  // Get the question text - look for question, question_text, or questionText property
  const getQuestionText = (question) => {
    return question.question || question.question_text || '';
  };

  // Function to safely render question text - properly handle code blocks, etc.
  const renderQuestionText = (text) => {
    // If text contains code blocks indicated by ```
    if (text.includes('```')) {
      // Split by code blocks
      const parts = text.split(/```(?:javascript|js)?([\s\S]*?)```/);
      return parts.map((part, i) => {
        if (i % 2 === 1) {
          // This is code block content (odd indices)
          return (
            <pre key={i} className="code-block">
              <code>{part.trim()}</code>
            </pre>
          );
        } else {
          // This is regular text (even indices)
          return part.split('\n').map((line, j) => (
            <span key={`${i}-${j}`}>
              {line}
              <br />
            </span>
          ));
        }
      });
    } else {
      // No code blocks, just split by newlines
      return text.split('\n').map((line, i) => (
        <span key={i}>
          {line}
          <br />
        </span>
      ));
    }
  };

  return (
    <div className="portal">
      {/* Header Section */}
      <div className="header-section">
        <h1>Technical Assessment</h1>
        <p>
          {jobDetails?.jobName 
            ? `Assessment for ${jobDetails.jobName} position at ${jobDetails.company}` 
            : "Please answer all questions to the best of your ability"}
        </p>
        <div className="progress-container-assessment">
          <div className="progress-bar-assessment">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="progress-percentage">{progressPercentage}%</span>
        </div>
      </div>

      <div className="assessment-content">
        {/* Question Info Bar */}
        <div className="question-info">
          <p className="question-number">Question {currentQuestionIndex + 1} of {questions.length}</p>
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
          <h3 className="question-title">{getQuestionText(currentQuestion)}</h3>
          {currentQuestion.question_text_additional && 
            <div className="question-additional">
              {renderQuestionText(currentQuestion.question_text_additional)}
            </div>
          }
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
                onChange={handleTextAnswerChange}
                placeholder={currentQuestion.placeholder || "Type your answer here..."}
                rows={8}
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
          
          {isLastQuestion() ? (
            <button 
              className="nav-button-assessment next-button submit-button"
              onClick={handleSubmitAssessment}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
              {!submitting && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </button>
          ) : (
            <button 
              className="nav-button-assessment next-button"
              onClick={goToNextQuestion}
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          )}
        </div>
        
        {/* Question Navigation Dots */}
        <div className="question-navigation-dots">
          {questions.map((_, index) => (
            <div 
              key={index} 
              className={`
                question-dot 
                ${index === currentQuestionIndex ? 'active' : ''} 
                ${answers[index] !== undefined ? 'answered' : ''}
              `}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentQuestionIndex(index);
                  setSelectedOption(answers[index] || null);
                  setIsAnimating(false);
                }, 300);
              }}
              title={`Question ${index + 1}`}
            />
          ))}
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="error-message-container">
            <div className={`error-message ${errorMessage.type || 'error'}`}>
              {errorMessage.type === 'error' && (
                <svg className="error-message-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
              {errorMessage.type === 'success' && (
                <svg className="error-message-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              )}
              <span className="error-message-text">{errorMessage.text}</span>
              <button 
                className="error-message-close" 
                onClick={() => setErrorMessage(null)}
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Assessment;