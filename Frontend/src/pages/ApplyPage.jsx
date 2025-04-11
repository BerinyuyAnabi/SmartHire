import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ApplyPage({ job, onBack }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    countryCode: "+1",
    phone: "",
    cv: null,
    coverLetter: null,
  });

  // Add useEffect to inject Bootstrap CDN link and custom styles
  useEffect(() => {
    // Check if the link is already in the document
    if (!document.getElementById('bootstrap-cdn')) {
      const link = document.createElement('link');
      link.id = 'bootstrap-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
      link.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
    
    // Add custom CSS variables
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --primary: #006d6d;
        --primary-light: #01a0a0;
        --primary-dark: #004e4e;
        --accent: #FFCA35;
        --white: #ffffff;
        --off-white: #f8f9fa;
        --gray-100: #f0f2f5;
        --gray-200: #e9ecef;
        --gray-300: #dee2e6;
        --gray-400: #ced4da;
        --gray-500: #adb5bd;
        --gray-600: #6c757d;
        --gray-700: #495057;
        --gray-800: #343a40;
        --gray-900: #212529;
        --black: #000000;
        --body-bg: #f5f7f9;
        --text-color: #333333;
        --shadow-sm: 0 2px 4px rgba(0,0,0,0.05);
        --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
        --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
        --hover-shadow: 0 10px 25px rgba(0, 0, 0, 0.07);
        --transition: all 0.3s ease;
        --border-radius: 8px;
        --border-radius-lg: 12px;
        --border-radius-xl: 16px;
      }
      
      body {
        background-color: var(--body-bg);
        color: var(--text-color);
        font-family: 'Inter', sans-serif;
      }
      
      .apply-page-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 2rem 1rem;
      }
      
      .apply-header {
        background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%);
        padding: 3.5rem 2.5rem 2.5rem;
        border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
        position: relative;
        color: var(--white);
        overflow: hidden;
        box-shadow: var(--shadow-md);
      }
      
      .apply-header-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 20%), 
                          radial-gradient(circle at 80% 30%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 20%),
                          url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="10" cy="10" r="2" fill="rgba(255,255,255,0.08)"/></svg>');
        background-size: 100% 100%, 100% 100%, 20px 20px;
        opacity: 0.8;
        z-index: 0;
      }
      
      .apply-header-content {
        position: relative;
        z-index: 1;
      }
      
      .apply-title {
        font-size: 2.6rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
        letter-spacing: -0.02em;
        text-shadow: 0 2px 4px rgba(0,0,0,0.15);
      }
      
      .apply-subtitle {
        font-size: 1.25rem;
        opacity: 0.9;
        font-weight: 300;
        letter-spacing: 0.01em;
      }
      
      .apply-form-card {
        background: var(--white);
        border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
        box-shadow: var(--shadow-lg);
        border: 1px solid var(--gray-200);
        transition: var(--transition);
        overflow: hidden;
        margin-bottom: 2rem;
      }
      
      .apply-form-content {
        padding: 2.75rem;
      }
      
      .section-title {
        color: var(--primary);
        font-weight: 700;
        font-size: 1.5rem;
        margin-bottom: 1.75rem;
        padding-bottom: 0.875rem;
        border-bottom: 2px solid var(--gray-200);
        position: relative;
      }
      
      .section-title:after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 60px;
        height: 2px;
        background-color: var(--primary);
      }
      
      .form-label {
        color: var(--gray-800);
        font-weight: 600;
        font-size: 0.95rem;
        margin-bottom: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .form-control {
        border: 1px solid var(--gray-300);
        padding: 0.875rem 1.125rem;
        border-radius: var(--border-radius);
        font-size: 1rem;
        transition: var(--transition);
        background-color: var(--white);
        box-shadow: var(--shadow-sm);
      }
      
      .form-control:focus {
        box-shadow: 0 0 0 3px rgba(1, 160, 160, 0.15);
        border-color: var(--primary-light);
      }
      
      .form-select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23495057' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 1rem center;
        padding-right: 2.5rem;
        appearance: none;
        box-shadow: var(--shadow-sm);
      }
      
      .radio-group {
        display: flex;
        gap: 1.5rem;
        margin-top: 0.5rem;
      }
      
      .radio-item {
        position: relative;
        display: flex;
        align-items: center;
      }
      
      .radio-custom {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        border: 1px solid var(--gray-300);
        border-radius: var(--border-radius);
        cursor: pointer;
        transition: var(--transition);
        font-weight: 500;
        color: var(--gray-700);
        background-color: var(--white);
        min-width: 120px;
        text-align: center;
        box-shadow: var(--shadow-sm);
      }
      
      .radio-check-icon {
        margin-right: 0.5rem;
        color: var(--primary);
        opacity: 0;
        transition: var(--transition);
        transform: scale(0);
      }
      
      .radio-custom:hover {
        border-color: var(--primary-light);
      }
      
      .radio-item input[type="radio"] {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
      }
      
      .radio-item input[type="radio"]:checked + .radio-custom {
        border-color: var(--primary);
        background-color: rgba(1, 160, 160, 0.05);
        color: var(--primary);
        box-shadow: 0 0 0 1px var(--primary);
      }
      
      .radio-item input[type="radio"]:checked + .radio-custom .radio-check-icon {
        opacity: 1;
        transform: scale(1);
      }
      
      .clear-radio {
        color: var(--gray-600);
        font-size: 0.875rem;
        font-weight: normal;
        cursor: pointer;
        transition: var(--transition);
        display: flex;
        align-items: center;
      }
      
      .clear-radio:hover {
        color: var(--primary);
      }
      
      .clear-radio svg {
        margin-right: 0.25rem;
      }
      
      .file-upload-wrapper {
        border: 2px dashed var(--gray-300);
        padding: 2rem 1.5rem;
        border-radius: var(--border-radius);
        text-align: center;
        transition: var(--transition);
        cursor: pointer;
        height: 180px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--off-white);
        overflow: hidden;
        position: relative;
      }
      
      .file-upload-wrapper:hover {
        border-color: var(--primary-light);
        background-color: rgba(1, 160, 160, 0.03);
      }
      
      .file-upload-wrapper input[type="file"] {
        opacity: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        cursor: pointer;
      }
      
      .file-upload-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--gray-600);
      }
      
      .file-upload-icon {
        margin-bottom: 1.25rem;
        color: var(--primary);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 64px;
        height: 64px;
        background-color: rgba(1, 160, 160, 0.1);
        border-radius: 50%;
        transition: var(--transition);
      }
      
      .file-upload-wrapper:hover .file-upload-icon {
        transform: translateY(-5px);
        background-color: rgba(1, 160, 160, 0.15);
      }
      
      .file-upload-label strong {
        color: var(--gray-800);
        margin-bottom: 0.5rem;
        font-size: 1.1rem;
      }
      
      .file-upload-label.has-file {
        color: var(--primary);
      }
      
      .file-upload-label.has-file .file-upload-icon {
        background-color: rgba(1, 160, 160, 0.15);
      }
     
      .file-upload-check {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background-color: var(--primary);
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(0);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      
      .file-upload-wrapper.has-file .file-upload-check {
        transform: scale(1);
      }
      
      .file-name {
        font-weight: 500;
        color: var(--primary);
        background-color: rgba(1, 160, 160, 0.08);
        padding: 0.25rem 0.75rem;
        border-radius: 100px;
        margin-top: 0.5rem;
        font-size: 0.875rem;
        max-width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .action-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 2.5rem;
        padding-top: 1.75rem;
        border-top: 1px solid var(--gray-200);
      }
      
      .btn-back {
        background-color: var(--gray-100);
        color: var(--gray-700);
        border: 1px solid var(--gray-300);
        border-radius: 50px;
        padding: 0.875rem 2rem;
        font-size: 0.95rem;
        font-weight: 600;
        transition: var(--transition);
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .btn-back:hover {
        background-color: var(--gray-200);
        transform: translateX(-2px);
        box-shadow: var(--shadow-sm);
      }
      
      .btn-continue {
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        color: var(--white);
        border: none;
        border-radius: 50px;
        padding: 0.875rem 2.5rem;
        font-size: 0.95rem;
        font-weight: 600;
        transition: var(--transition);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: relative;
        overflow: hidden;
        z-index: 1;
      }
      
      .btn-continue:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
        z-index: -1;
        opacity: 0;
        transition: var(--transition);
      }
      
      .btn-continue:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }
      
      .btn-continue:hover:before {
        opacity: 1;
      }
      
      .btn-continue:active {
        transform: translateY(0);
      }
      
      .job-info-bar {
        background-color: var(--gray-100);
        border-bottom: 1px solid var(--gray-200);
        padding: 1.25rem 2.75rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .job-info-title {
        font-weight: 600;
        color: var(--gray-800);
        font-size: 1.2rem;
        margin-bottom: 0.25rem;
      }
      
      .job-info-company {
        color: var(--primary);
        font-weight: 500;
        display: flex;
        align-items: center;
      }
      
      .job-info-company-logo {
        width: 24px;
        height: 24px;
        margin-right: 0.5rem;
        border-radius: 4px;
        background-color: var(--primary-light);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 0.75rem;
      }
      
      .job-info-stats {
        display: flex;
        gap: 1.5rem;
        color: var(--gray-600);
        font-size: 0.9rem;
      }
      
      .job-info-stat {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        background-color: var(--white);
        padding: 0.5rem 0.875rem;
        border-radius: 100px;
        border: 1px solid var(--gray-200);
        font-weight: 500;
      }
      
      .job-info-stat svg {
        color: var(--primary-light);
      }
      
      .progress-container {
        padding: 0.875rem 2.75rem;
        background-color: var(--white);
        border-bottom: 1px solid var(--gray-200);
        display: flex;
        align-items: center;
      }
      
      .progress-label {
        color: var(--gray-700);
        font-weight: 600;
        font-size: 0.9rem;
        margin-right: 1rem;
        width: 120px;
      }
      
      .progress-bar-container {
        flex: 1;
        height: 6px;
        background-color: var(--gray-200);
        border-radius: 3px;
        overflow: hidden;
      }
      
      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
        width: 50%;
        transition: width 0.3s ease;
      }
      
      .progress-text {
        color: var(--gray-600);
        font-size: 0.85rem;
        font-weight: 500;
        margin-left: 1rem;
        white-space: nowrap;
      }
      
      /* Skeleton Loading Styles */
      .skeleton {
        background: linear-gradient(
          90deg,
          var(--gray-200) 25%,
          var(--off-white) 37%,
          var(--gray-200) 63%
        );
        background-size: 400% 100%;
        animation: skeleton-loading 1.4s ease infinite;
      }
      
      @keyframes skeleton-loading {
        0% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0 50%;
        }
      }
      
      .skeleton-text {
        height: 12px;
        margin-bottom: 8px;
        border-radius: 4px;
      }
      
      .skeleton-title {
        height: 24px;
        margin-bottom: 12px;
        border-radius: 4px;
        width: 40%;
      }
      
      .skeleton-input {
        height: 48px;
        border-radius: 8px;
        margin-bottom: 16px;
      }
      
      .skeleton-button {
        height: 48px;
        width: 150px;
        border-radius: 30px;
      }
      
      .skeleton-file {
        height: 160px;
        border-radius: 8px;
        margin-bottom: 16px;
      }
      
      /* Animation Classes */
      .fade-in {
        animation: fadeIn 0.8s ease forwards;
      }
      
      .fade-in-up {
        animation: fadeInUp 0.8s ease forwards;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .fade-in-right {
        animation: fadeInRight 0.6s ease forwards;
      }
      
      @keyframes fadeInRight {
        from {
          opacity: 0;
          transform: translateX(-20px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      
      /* Responsive Styles */
      @media (max-width: 768px) {
        .apply-header {
          padding: 2rem 1.5rem 1.5rem;
        }
        
        .apply-title {
          font-size: 1.8rem;
        }
        
        .apply-subtitle {
          font-size: 1rem;
        }
        
        .apply-form-content {
          padding: 1.5rem;
        }
        
        .job-info-bar {
          padding: 1rem 1.5rem;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
        }
        
        .progress-container {
          padding: 0.75rem 1.5rem;
          flex-direction: column;
          align-items: flex-start;
        }
        
        .progress-label {
          margin-bottom: 0.5rem;
          margin-right: 0;
          width: auto;
        }
        
        .progress-text {
          margin-left: 0;
          margin-top: 0.5rem;
        }
        
        .radio-group {
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .action-buttons {
          flex-direction: column-reverse;
          gap: 1rem;
        }
        
        .btn-back, .btn-continue {
          width: 100%;
          justify-content: center;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Country codes data
  const [countryCodes, setCountryCodes] = useState([
    { code: "+1", country: "US" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "IN" },
    { code: "+233", country: "GH" },
    { code: "+61", country: "AU" },
    { code: "+49", country: "DE" },
    { code: "+86", country: "CN" },
    { code: "+33", country: "FR" },
    { code: "+81", country: "JP" }
  ]);

  // Fetch country codes from API
  useEffect(() => {
    // This function would fetch country codes from an API
    const fetchCountryCodes = async () => {
      try {
        // Replace with your actual API endpoint
        // const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd');
        // const data = await response.json();
        
        // Process the data to get country codes
        // const codes = data.map(country => ({
        //   code: country.idd.root + (country.idd.suffixes?.[0] || ""),
        //   country: country.name.common
        // })).filter(item => item.code);
        
        // setCountryCodes(codes);
        
        // For now, we'll use the hardcoded values above
        // This comment shows how to implement it with an API
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };
    
    // Uncomment this when you're ready to use the API
    // fetchCountryCodes();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Application submitted!");
    onBack();
  };

  const handleContinue = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    try {
      navigate('/assessment', { 
        state: { 
          formData: formData, 
          jobDetails: job 
        } 
      });
    } catch(error) {
      console.error("Navigation error:", error);
    }
  };

  // SVG icons
  const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  );

  const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  );
  
  const ContinueIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
  
  const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
    </svg>
  );
  
  const SalaryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="apply-form-card fade-in">
      <div className="job-info-bar">
        <div className="skeleton-text skeleton" style={{width: '60%'}}></div>
      </div>
      
      <div className="apply-form-content">
        <div className="skeleton-title skeleton mb-4"></div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '30%'}}></div>
            <div className="skeleton-input skeleton"></div>
          </div>
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '30%'}}></div>
            <div className="skeleton-input skeleton"></div>
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '25%'}}></div>
            <div className="d-flex gap-4">
              <div className="skeleton-text skeleton" style={{width: '15%'}}></div>
              <div className="skeleton-text skeleton" style={{width: '15%'}}></div>
            </div>
          </div>
        </div>
        
        <div className="skeleton-title skeleton mb-4 mt-5"></div>
        
        <div className="row">
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '30%'}}></div>
            <div className="skeleton-input skeleton"></div>
          </div>
          <div className="col-md-6">
            <div className="skeleton-text skeleton" style={{width: '30%'}}></div>
            <div className="skeleton-input skeleton"></div>
          </div>
        </div>
        
        <div className="skeleton-title skeleton mb-4 mt-5"></div>
        <div className="skeleton-text skeleton" style={{width: '70%'}}></div>
        
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="skeleton-file skeleton"></div>
          </div>
          <div className="col-md-6">
            <div className="skeleton-file skeleton"></div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between mt-5 pt-4" style={{borderTop: '1px solid var(--gray-200)'}}>
          <div className="skeleton-button skeleton"></div>
          <div className="skeleton-button skeleton"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="apply-page-container">
      <div className="apply-header fade-in">
        <div className="apply-header-bg"></div>
        <div className="apply-header-content">
          <h1 className="apply-title">Application Portal</h1>
          <p className="apply-subtitle">Take your next career step with us</p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="apply-form-card fade-in-up">
          <div className="job-info-bar">
            <div>
              <h3 className="job-info-title">{job.jobName}</h3>
              <h4 className="job-info-company">{job.company}</h4>
            </div>
            <div className="job-info-stats">
              <div className="job-info-stat">
                <LocationIcon /> {job.location || "Remote"}
              </div>
              <div className="job-info-stat">
                <SalaryIcon /> {job.salary || "Competitive"}
              </div>
            </div>
          </div>
          
          <div className="progress-bar-container">
            <div className="progress-bar"></div>
          </div>

          <div className="apply-form-content">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <h4 className="section-title">
                  <span>Personal Information</span>
                </h4>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-md-6">
                    <label className="form-label">Gender</label>
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="genderMale"
                          value="male"
                          checked={formData.gender === "male"}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="genderMale">
                          Male
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="gender"
                          id="genderFemale"
                          value="female"
                          checked={formData.gender === "female"}
                          onChange={handleChange}
                        />
                        <label className="form-check-label" htmlFor="genderFemale">
                          Female
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <h4 className="section-title">
                  <span>Contact Information</span>
                </h4>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Mobile Number</label>
                    <div className="input-group">
                      <select
                        className="form-select"
                        style={{ width: "120px", flex: "0 0 auto", borderRadius: "8px 0 0 8px" }}
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                      >
                        {countryCodes.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.code} ({item.country})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        className="form-control"
                        style={{ borderRadius: "0 8px 8px 0" }}
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="section-title">
                  <span>Documents</span>
                </h4>
                <p className="text-secondary mb-4">
                  Please upload your professional documents in PDF or Word format (max 100MB each)
                </p>

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="position-relative file-upload-wrapper">
                      <input
                        type="file"
                        name="cv"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                        required
                      />
                      <div className={`file-upload-label ${formData.cv ? 'has-file' : ''}`}>
                        <UploadIcon />
                        <strong>Upload CV / Resume</strong>
                        <span>{formData.cv ? formData.cv.name : "PDF or Word document"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="position-relative file-upload-wrapper">
                      <input
                        type="file"
                        name="coverLetter"
                        accept=".pdf,.doc,.docx"
                        onChange={handleChange}
                      />
                      <div className={`file-upload-label ${formData.coverLetter ? 'has-file' : ''}`}>
                        <UploadIcon />
                        <strong>Upload Cover Letter</strong>
                        <span>{formData.coverLetter ? formData.coverLetter.name : "PDF or Word document (optional)"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button 
                  type="button" 
                  className="btn btn-back" 
                  onClick={onBack}
                >
                  <BackIcon /> Back to Jobs
                </button>
                <button 
                  type="button" 
                  className="btn btn-continue" 
                  onClick={handleContinue}
                >
                  Continue to Assessment <ContinueIcon />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApplyPage;