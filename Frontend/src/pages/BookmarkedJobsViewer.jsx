import React, { useState, useEffect } from 'react';

function BookmarkedJobsViewer() {
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/public/jobs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();
        setAllJobs(data);
        
        // Get bookmarked job IDs from localStorage
        const bookmarkedIds = JSON.parse(localStorage.getItem('bookmarkedJobs') || '[]');
        
        // Filter to get only bookmarked jobs
        const bookmarked = data.filter(job => bookmarkedIds.includes(job.id));
        setBookmarkedJobs(bookmarked);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, []);

  // Helper function to safely stringify objects for display
  const formatObject = (obj) => {
    try {
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return "Error formatting object: " + e.message;
    }
  };

  if (loading) {
    return <div>Loading bookmarked jobs...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '14px' }}>
      <h1>Bookmarked Jobs Data Viewer</h1>
      
      {bookmarkedJobs.length === 0 ? (
        <div>
          <p>No bookmarked jobs found. Please bookmark some jobs first.</p>
          
          <h2>All Available Jobs</h2>
          <p>Total jobs: {allJobs.length}</p>
          
          {allJobs.length > 0 && (
            <div>
              <h3>First Job Sample</h3>
              <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', background: '#f5f5f5', whiteSpace: 'pre-wrap' }}>
                {formatObject(allJobs[0])}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p>Found {bookmarkedJobs.length} bookmarked jobs.</p>
          
          {bookmarkedJobs.map((job, index) => (
            <div key={job.id} style={{ marginBottom: '30px' }}>
              <h2>Job #{index + 1}: {job.job_name || job.jobName}</h2>
              
              <div style={{ marginBottom: '10px' }}>
                <h3>Raw job object format:</h3>
                <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', background: '#f5f5f5', whiteSpace: 'pre-wrap' }}>
                  {formatObject(job)}
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <h3>Responsibilities Array:</h3>
                <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', background: '#f5f5f5' }}>
                  <strong>Type:</strong> {Array.isArray(job.responsibilities) ? 'Array' : typeof job.responsibilities}<br />
                  <strong>Length:</strong> {Array.isArray(job.responsibilities) ? job.responsibilities.length : 'N/A'}<br />
                  <strong>First Item Type:</strong> {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? typeof job.responsibilities[0] : 'N/A'}<br />
                  <strong>First Item:</strong> {Array.isArray(job.responsibilities) && job.responsibilities.length > 0 ? formatObject(job.responsibilities[0]) : 'N/A'}
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <h3>Qualifications Array:</h3>
                <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', background: '#f5f5f5' }}>
                  <strong>Type:</strong> {Array.isArray(job.qualifications) ? 'Array' : typeof job.qualifications}<br />
                  <strong>Length:</strong> {Array.isArray(job.qualifications) ? job.qualifications.length : 'N/A'}<br />
                  <strong>First Item Type:</strong> {Array.isArray(job.qualifications) && job.qualifications.length > 0 ? typeof job.qualifications[0] : 'N/A'}<br />
                  <strong>First Item:</strong> {Array.isArray(job.qualifications) && job.qualifications.length > 0 ? formatObject(job.qualifications[0]) : 'N/A'}
                </div>
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <h3>Offers Array:</h3>
                <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', background: '#f5f5f5' }}>
                  <strong>Type:</strong> {Array.isArray(job.offers) ? 'Array' : typeof job.offers}<br />
                  <strong>Length:</strong> {Array.isArray(job.offers) ? job.offers.length : 'N/A'}<br />
                  <strong>First Item Type:</strong> {Array.isArray(job.offers) && job.offers.length > 0 ? typeof job.offers[0] : 'N/A'}<br />
                  <strong>First Item:</strong> {Array.isArray(job.offers) && job.offers.length > 0 ? formatObject(job.offers[0]) : 'N/A'}
                </div>
              </div>
              
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookmarkedJobsViewer;