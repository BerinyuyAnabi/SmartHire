import React, { useState, useEffect } from "react";
import SearchTab from "../components/SearchTab";
import { useNavigate } from "react-router-dom";

function ApplyPage({ job, onBack }) {
  const navigate = useNavigate();
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

  // Add useEffect to inject Bootstrap CDN link
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
    
    return () => {
      // Optional: Remove the link when component unmounts
      // const link = document.getElementById('bootstrap-cdn');
      // if (link) document.head.removeChild(link);
    };
  }, []);

  // Country codes data
  const [countryCodes, setCountryCodes] = useState([
    { code: "+1", country: "US" },
    { code: "+44", country: "UK" },
    { code: "+91", country: "IN" },
    { code: "+233", country: "GH" }
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

  return (
    <div className="smart-hire-container">
      <SearchTab />
      <main className="job-board">
        <h2 onClick={onBack} style={{ cursor: "pointer" }}>
          Job Postings
        </h2>

        <div className="card shadow-sm rounded p-4 bg-white">
          <div className="mb-4">
            <h3 className="fs-4 m-0">{job.jobName}</h3>
            <h4 className="text-secondary fs-6 fw-normal m-0">{job.company}</h4>
          </div>

          <p className="fw-medium fs-5 mb-3">General Information</p>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-medium small">First Name</label>
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

                <div className="mb-3">
                  <label className="form-label fw-medium small">Last Name</label>
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

                <div className="mb-3">
                  <label className="form-label fw-medium small">Gender</label>
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
                      <label className="form-check-label small" htmlFor="genderMale">
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
                      <label className="form-check-label small" htmlFor="genderFemale">
                        Female
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-medium small">Email Address</label>
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

                <div className="mb-3">
                  <label className="form-label fw-medium small">Mobile Number</label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      style={{ width: "100px", flex: "0 0 auto" }}
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

            <div className="mt-4">
              <p className="fw-medium fs-5 mb-2">Documents</p>
              <p className="text-secondary small mb-3">
                Upload 1 supported PDF or Word. Max 100MB
              </p>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-medium small">CV*</label>
                  <input
                    type="file"
                    className="form-control"
                    name="cv"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label fw-medium small">Cover Letter*</label>
                  <input
                    type="file"
                    className="form-control"
                    name="coverLetter"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button 
                type="button" 
                className="btn btn-dark rounded-pill px-4" 
                onClick={handleContinue}
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default ApplyPage;
