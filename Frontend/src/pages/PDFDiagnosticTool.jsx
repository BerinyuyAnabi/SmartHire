import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Diagnostic Tool Component to monitor PDF processing
const PDFDiagnosticTool = ({ job, onBack }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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
  
  // Diagnostic state
  const [diagnosticLogs, setDiagnosticLogs] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [fileDetails, setFileDetails] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const logsEndRef = useRef(null);

  // Add log entry
  const addLog = (message, type = "info") => {
    const timestamp = new Date().toLocaleTimeString();
    setDiagnosticLogs(prev => [...prev, { message, timestamp, type }]);
  };

  // Scroll to bottom of logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [diagnosticLogs]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "cv" && files && files[0]) {
      const file = files[0];
      setFileDetails({
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        lastModified: new Date(file.lastModified).toLocaleString()
      });
      addLog(`CV file selected: ${file.name} (${file.type}, ${(file.size / 1024 / 1024).toFixed(2)} MB)`, "info");
    }
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Clear logs
  const clearLogs = () => {
    setDiagnosticLogs([]);
    setApiResponse(null);
    setNetworkError(null);
  };

  // Test PDF processing
  const testPDFProcessing = async (e) => {
    e.preventDefault();
    
    if (!formData.cv) {
      addLog("No CV/Resume file selected. Please select a file first.", "error");
      return;
    }

    setSubmitting(true);
    clearLogs();
    addLog("Starting PDF diagnostic test...", "info");

    try {
      // Create a FormData object
      const formDataToSubmit = new FormData();
      
      // Add minimal required fields
      formDataToSubmit.append('firstName', formData.firstName || "Test");
      formDataToSubmit.append('lastName', formData.lastName || "User");
      formDataToSubmit.append('email', formData.email || "test@example.com");
      formDataToSubmit.append('phone', formData.phone || "1234567890");

      // Add CV file - this is the key for the screening
      formDataToSubmit.append('resume', formData.cv);
      
      addLog(`Preparing to send file: ${formData.cv.name}`, "info");
      addLog(`File type: ${formData.cv.type}`, "info");
      addLog(`File size: ${(formData.cv.size / 1024 / 1024).toFixed(2)} MB`, "info");
      
      // Send request timing
      const startTime = performance.now();
      addLog("Sending request to server...", "info");
      
      // Call the screening endpoint
      const response = await fetch(`/api/public/jobs/${job?.id || 1}/apply-with-screening`, {
        method: 'POST',
        body: formDataToSubmit
      });
      
      const endTime = performance.now();
      addLog(`Request completed in ${(endTime - startTime).toFixed(0)}ms`, "info");
      
      // Parse the response
      const result = await response.json();
      setApiResponse(result);
      
      // Log response details
      addLog(`Server response status: ${response.status} ${response.statusText}`, response.ok ? "success" : "error");
      
      if (result.success) {
        addLog("Server reported success in processing your PDF", "success");
      } else {
        addLog("Server reported issues processing your PDF", "warning");
      }
      
      // Check for specific error details
      if (result.error || result.error_details) {
        addLog(`Error: ${result.error || result.error_details}`, "error");
      }
      
      // Check for skills analysis
      if (result.analysis && result.analysis.skills_analysis) {
        const skills = result.analysis.skills_analysis;
        addLog(`Skills analysis: Matched ${skills.match_count} skills (${skills.match_percentage}%)`, "success");
        
        if (skills.matched_skills && skills.matched_skills.length > 0) {
          addLog(`Matched skills: ${skills.matched_skills.join(", ")}`, "info");
        } else {
          addLog("No skills were matched in your PDF", "warning");
        }
      } else {
        addLog("No skills analysis was returned", "warning");
      }
      
    } catch (error) {
      console.error("Diagnostic test error:", error);
      setNetworkError(error.toString());
      addLog(`Network error: ${error.toString()}`, "error");
    } finally {
      setSubmitting(false);
      addLog("Diagnostic test completed", "info");
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      <h1>PDF Processing Diagnostic Tool</h1>
      <p className="text-muted">This tool helps identify issues with PDF processing in your application</p>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Upload Your CV/Resume</h5>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">First Name (optional for test)</label>
                <input
                  type="text"
                  className="form-control"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Last Name (optional for test)</label>
                <input
                  type="text"
                  className="form-control"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Email (optional for test)</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Phone (optional for test)</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Upload CV/Resume (Required) <span className="text-danger">*</span></label>
            <input
              type="file"
              className="form-control"
              name="cv"
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
            />
            <div className="form-text">Upload the PDF file that's causing issues</div>
          </div>

          <button 
            className="btn btn-primary" 
            onClick={testPDFProcessing}
            disabled={submitting || !formData.cv}
          >
            {submitting ? 'Testing PDF Processing...' : 'Test PDF Processing'}
          </button>
        </div>
      </div>
      
      {fileDetails && (
        <div className="card mb-4">
          <div className="card-header">
            File Details
          </div>
          <div className="card-body">
            <table className="table table-sm">
              <tbody>
                <tr>
                  <th scope="row">File Name</th>
                  <td>{fileDetails.name}</td>
                </tr>
                <tr>
                  <th scope="row">File Type</th>
                  <td>{fileDetails.type}</td>
                </tr>
                <tr>
                  <th scope="row">File Size</th>
                  <td>{fileDetails.size}</td>
                </tr>
                <tr>
                  <th scope="row">Last Modified</th>
                  <td>{fileDetails.lastModified}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>Diagnostic Logs</span>
          <button className="btn btn-sm btn-outline-secondary" onClick={clearLogs}>Clear Logs</button>
        </div>
        <div className="card-body p-0">
          <div 
            className="diagnostic-logs" 
            style={{ 
              height: "300px", 
              overflowY: "auto", 
              backgroundColor: "#f8f9fa", 
              padding: "10px", 
              fontFamily: "monospace"
            }}
          >
            {diagnosticLogs.length === 0 ? (
              <p className="text-muted p-3">No logs yet. Upload a file and test PDF processing.</p>
            ) : (
              diagnosticLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={`log-entry ${log.type}`}
                  style={{
                    padding: "4px 8px",
                    borderBottom: "1px solid #e9ecef",
                    color: log.type === "error" ? "#dc3545" : 
                          log.type === "warning" ? "#fd7e14" :
                          log.type === "success" ? "#198754" : "#212529"
                  }}
                >
                  <span style={{ color: "#6c757d", marginRight: "10px" }}>[{log.timestamp}]</span>
                  {log.message}
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
      
      {apiResponse && (
        <div className="card mb-4">
          <div className="card-header">
            API Response
          </div>
          <div className="card-body">
            <pre style={{ 
              backgroundColor: "#f8f9fa", 
              padding: "15px", 
              borderRadius: "5px",
              maxHeight: "300px",
              overflow: "auto"
            }}>
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      {networkError && (
        <div className="alert alert-danger">
          <strong>Network Error:</strong> {networkError}
        </div>
      )}
      
      <div className="card mb-4">
        <div className="card-header">
          Troubleshooting Tips
        </div>
        <div className="card-body">
          <h5>If PDF processing fails, check:</h5>
          <ol>
            <li>
              <strong>File type:</strong> Ensure your PDF is actually a valid PDF format. Sometimes files are renamed with .pdf extension but aren't actually PDFs.
            </li>
            <li>
              <strong>PDF libraries:</strong> Check that the server has the necessary PDF libraries installed (pdfplumber, PyPDF2, or pdftotext as shown in paste-2.txt).
            </li>
            <li>
              <strong>PDF content:</strong> Some PDFs may be image-based or have security restrictions that prevent text extraction.
            </li>
            <li>
              <strong>File size:</strong> Very large PDFs may timeout during processing.
            </li>
            <li>
              <strong>Server logs:</strong> The most detailed information about failures will be in your server logs.
            </li>
          </ol>
          
          <h5 className="mt-4">Common issues with React frontend:</h5>
          <ul>
            <li>
              <strong>Navigation issues:</strong> If you're being redirected to the job list, check the redirect logic in your ScreeningResultsModal component.
            </li>
            <li>
              <strong>Missing assessment ID:</strong> Make sure your server response includes assessment_id for proper redirection.
            </li>
            <li>
              <strong>Error handling:</strong> Improve error handling in your React components to prevent automatic redirection on failure.
            </li>
          </ul>
        </div>
      </div>
      
      <div className="d-flex justify-content-between mt-4">
        <button className="btn btn-secondary" onClick={onBack}>
          Back to Jobs
        </button>
      </div>
    </div>
  );
};

export default PDFDiagnosticTool;