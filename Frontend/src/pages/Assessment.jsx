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
          questionText: q.question_text || q.question || '', // Store original property
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
        const sampleQuestions = [
          {
            id: "prog_1",
            questionText: "What is the time complexity of binary search on a sorted array?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            type: "multiple-choice"
          },
          {
            id: "fe_1",
            questionText: "Which of the following is NOT a JavaScript framework or library?",
            options: ["React", "Angular", "Vue", "Servlet"],
            type: "multiple-choice"
          },
          {
            id: "be_1",
            questionText: "What does REST stand for in the context of API design?",
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
            questionText: "Which of the following is a NoSQL database?",
            options: ["MySQL", "PostgreSQL", "Oracle", "MongoDB"],
            type: "multiple-choice"
          },
          {
            id: "devops_1",
            questionText: "What is the main purpose of container technology like Docker?",
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
            questionText: "Review the following code snippet and explain what it does:\n\n```javascript\nfunction mystery(arr) {\n  return arr.reduce((a, b) => a + b, 0) / arr.length;\n}\n```",
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
    
    // Convert answers object to array format for submission
    const answersArray = Object.entries(answers).map(([index, value]) => {
      const questionId = questions[parseInt(index)]?.id || `question_${index}`;
      return {
        question_id: questionId,
        answer: value
      };
    });
    
    try {
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
        throw new Error(`Submission failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("Assessment submission result:", result);
      
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
      }, 1000);
      
    } catch (error) {
      console.error("Error submitting assessment:", error);
      alert("There was a problem submitting your assessment. Please try again.");
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
          <button 
            className="preview-btn"
            onClick={() => alert("Question Navigator: This feature will be available in a future update.")}
          >
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
          <p className="question-number">Question {currentQuestionIndex + 1} of {questions.length}</p>
          <div className="timer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="clock-icon">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="timer-countdown">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Text - FIXED HERE */}
        <div className={`question ${isAnimating ? 'fade-out' : 'fade-in'}`}>
          <p dangerouslySetInnerHTML={{ __html: currentQuestion.questionText.replace(/\n/g, '<br/>') }}></p>
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
              className="nav-button-assessment submit-button"
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
      </div>
    </div>
  );
}

export default Assessment;