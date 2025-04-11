import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../css/Features.css"; // We'll create this CSS file next

function Features() {
  const [isLoading, setIsLoading] = useState(true);

  // Add useEffect to inject Bootstrap CDN link and handle loading state
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

    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="features-page">
      {/* Hero Banner */}
      <div className="container-fluid features-hero">
        <div className="container">
          <div className="row align-items-center">
            {isLoading ? (
              <div className="col-12 text-center">
                <div className="skeleton-hero-title"></div>
                <div className="skeleton-hero-subtitle"></div>
              </div>
            ) : (
              <div className="col-12 text-center fade-in">
                <h1 className="features-hero-title">Advanced <span className="highlight">Features</span> for Modern Recruiting</h1>
                <p className="features-hero-subtitle">Discover the tools that transform your hiring process</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="container main-features-section">
        <div className="row">
          <div className="col-12 text-center mb-5">
            {isLoading ? (
              <div className="skeleton-section-title mx-auto"></div>
            ) : (
              <h2 className="section-title fade-in">How Our AI Works for You</h2>
            )}
         
          </div>
        </div>

        {/* Feature #1 */}
        <div className="row align-items-center feature-row">
          {isLoading ? (
            <>
              <div className="col-lg-6">
                <div className="skeleton-feature-content"></div>
              </div>
              <div className="col-lg-6">
                <div className="skeleton-feature-image"></div>
              </div>
            </>
          ) : (
            <>
              <div className="col-lg-6 order-lg-1 order-2">
                <div className="feature-content fade-in-right">
                  <div className="feature-icon-large">
                    <i className="fas fa-brain"></i>
                  </div>
                  <h3 className="feature-title-large">AI-Powered Talent Matching</h3>
                  <p className="feature-text-large">Our proprietary algorithms analyze thousands of data points to match candidates with positions at unprecedented accuracy rates. By going beyond keywords to understand skill relationships, experience relevance, and potential for growth, we identify the best candidates even when their resumes don't perfectly match standard requirements.</p>
                  <ul className="feature-list">
                    <li><i className="fas fa-check-circle"></i> 93% higher quality matches than traditional methods</li>
                    <li><i className="fas fa-check-circle"></i> Identifies high-potential candidates others miss</li>
                    <li><i className="fas fa-check-circle"></i> Reduces bias in the screening process</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 order-lg-2 order-1">
                <div className="feature-image-container fade-in-left">
                  <img src="static/images/AI.png" alt="AI Talent Matching" className="feature-image" />
                  <div className="feature-image-overlay"></div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Feature #2 */}
        <div className="row align-items-center feature-row">
          {isLoading ? (
            <>
              <div className="col-lg-6">
                <div className="skeleton-feature-image"></div>
              </div>
              <div className="col-lg-6">
                <div className="skeleton-feature-content"></div>
              </div>
            </>
          ) : (
            <>
              <div className="col-lg-6">
                <div className="feature-image-container fade-in-right">
                  <img src="static/images/Screening.png" alt="Automated Screening" className="feature-image" />
                  <div className="feature-image-overlay"></div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="feature-content fade-in-left">
                  <div className="feature-icon-large">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h3 className="feature-title-large">Automated Screening & Insights</h3>
                  <p className="feature-text-large">Save hundreds of hours with intelligent resume parsing and candidate evaluation. Our system automatically extracts, categorizes, and analyzes candidate information, providing you with clear insights and comparable metrics across your talent pool.</p>
                  <ul className="feature-list">
                    <li><i className="fas fa-check-circle"></i> 85% reduction in screening time</li>
                    <li><i className="fas fa-check-circle"></i> Standardized assessment across all applicants</li>
                    <li><i className="fas fa-check-circle"></i> Real-time analytics and candidate comparisons</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Feature #3 */}
        <div className="row align-items-center feature-row">
          {isLoading ? (
            <>
              <div className="col-lg-6">
                <div className="skeleton-feature-content"></div>
              </div>
              <div className="col-lg-6">
                <div className="skeleton-feature-image"></div>
              </div>
            </>
          ) : (
            <>
              <div className="col-lg-6 order-lg-1 order-2">
                <div className="feature-content fade-in-right">
                  <div className="feature-icon-large">
                    <i className="fas fa-rocket"></i>
                  </div>
                  <h3 className="feature-title-large">Seamless & Efficient Hiring</h3>
                  <p className="feature-text-large">Transform your entire recruitment pipeline with our end-to-end solution. From job posting to onboarding, our platform streamlines every aspect of the hiring process, creating a cohesive experience for both employers and candidates.</p>
                  <ul className="feature-list">
                    <li><i className="fas fa-check-circle"></i> 62% decrease in time-to-hire</li>
                    <li><i className="fas fa-check-circle"></i> Improved candidate experience and engagement</li>
                    <li><i className="fas fa-check-circle"></i> Simplified collaboration for hiring teams</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-6 order-lg-2 order-1">
                <div className="feature-image-container fade-in-left">
                  <img src="static/images/Hiring.png" alt="Efficient Hiring Process" className="feature-image" />
                  <div className="feature-image-overlay"></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Additional Features Grid */}
      <div className="container-fluid additional-features-section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              {isLoading ? (
                <div className="skeleton-section-title mx-auto"></div>
              ) : (
                <h2 className="section-title fade-in">More Powerful Tools</h2>
              )}
              
            </div>
          </div>

          <div className="row">
            {isLoading ? (
              <>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="skeleton-mini-feature"></div>
                </div>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="skeleton-mini-feature"></div>
                </div>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="skeleton-mini-feature"></div>
                </div>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="skeleton-mini-feature"></div>
                </div>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="skeleton-mini-feature"></div>
                </div>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="skeleton-mini-feature"></div>
                </div>
              </>
            ) : (
              <>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="mini-feature-card fade-in-up">
                    <div className="mini-feature-icon">
                      <i className="fas fa-search"></i>
                    </div>
                    <h4 className="mini-feature-title">Smart Search</h4>
                    <p className="mini-feature-text">Find the right candidates with semantic search that understands concepts, not just keywords.</p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="mini-feature-card fade-in-up" style={{animationDelay: "0.1s"}}>
                    <div className="mini-feature-icon">
                      <i className="fas fa-comments"></i>
                    </div>
                    <h4 className="mini-feature-title">AI Interview Assistant</h4>
                    <p className="mini-feature-text">Generate tailored interview questions based on job requirements and candidate profiles.</p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="mini-feature-card fade-in-up" style={{animationDelay: "0.2s"}}>
                    <div className="mini-feature-icon">
                      <i className="fas fa-chart-pie"></i>
                    </div>
                    <h4 className="mini-feature-title">Analytics Dashboard</h4>
                    <p className="mini-feature-text">Get real-time insights into your hiring process with comprehensive reports and visualizations.</p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="mini-feature-card fade-in-up" style={{animationDelay: "0.3s"}}>
                    <div className="mini-feature-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <h4 className="mini-feature-title">Team Collaboration</h4>
                    <p className="mini-feature-text">Seamlessly collaborate with your hiring team through shared notes, ratings, and feedback.</p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="mini-feature-card fade-in-up" style={{animationDelay: "0.4s"}}>
                    <div className="mini-feature-icon">
                      <i className="fas fa-robot"></i>
                    </div>
                    <h4 className="mini-feature-title">Skill Assessment</h4>
                    <p className="mini-feature-text">Automatically evaluate candidate skills with customizable assessment tools.</p>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="mini-feature-card fade-in-up" style={{animationDelay: "0.5s"}}>
                    <div className="mini-feature-icon">
                      <i className="fas fa-calendar-alt"></i>
                    </div>
                    <h4 className="mini-feature-title">Smart Scheduling</h4>
                    <p className="mini-feature-text">Automate interview scheduling with AI-powered calendar integration.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Integration Ecosystem */}
      <div className="container integration-section">
        <div className="row">
          <div className="col-12 text-center mb-5">
            {isLoading ? (
              <div className="skeleton-section-title mx-auto"></div>
            ) : (
              <h2 className="section-title fade-in">Seamless Integrations</h2>
            )}
            
          </div>
        </div>

        <div className="row justify-content-center">
          {isLoading ? (
            <div className="col-12">
              <div className="skeleton-integration-list"></div>
            </div>
          ) : (
            <div className="col-lg-10">
              <div className="integration-list fade-in-up">
                <div className="integration-item">
                  <div className="integration-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <span>Workday</span>
                </div>
                <div className="integration-item">
                  <div className="integration-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <span>Salesforce</span>
                </div>
                <div className="integration-item">
                  <div className="integration-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <span>Microsoft Teams</span>
                </div>
                <div className="integration-item">
                  <div className="integration-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <span>Google Workspace</span>
                </div>
                <div className="integration-item">
                  <div className="integration-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <span>Slack</span>
                </div>
                <div className="integration-item">
                  <div className="integration-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <span>LinkedIn</span>
                </div>
                <div className="integration-item">
                  <div className="integration-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <span>Zoom</span>
                </div>
                <div className="integration-item">
                  <div className="integration-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <span>ADP</span>
                </div>
              </div>
              <div className="text-center mt-4">
                <small className="integration-note fade-in">...and many more with our open API</small>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Client Success Stories */}
      <div className="container-fluid success-stories-section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              {isLoading ? (
                <div className="skeleton-section-title mx-auto"></div>
              ) : (
                <h2 className="section-title fade-in">Success Stories</h2>
              )}
            
            </div>
          </div>

          <div className="row justify-content-center">
            {isLoading ? (
              <>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="skeleton-story-card"></div>
                </div>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="skeleton-story-card"></div>
                </div>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="skeleton-story-card"></div>
                </div>
              </>
            ) : (
              <>
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="story-card fade-in-up">
                    <div className="story-header">
                      <div className="story-company">TechCorp</div>
                      <div className="story-metric">60%</div>
                    </div>
                    <div className="story-body">
                      <p>"The AI matching technology reduced our time-to-hire by 60% while improving candidate quality. We're now able to focus on the human side of recruitment."</p>
                    </div>
                    <div className="story-footer">
                      <div className="story-author">Sarah Johnson</div>
                      <div className="story-position">HR Director</div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="story-card fade-in-up" style={{animationDelay: "0.2s"}}>
                    <div className="story-header">
                      <div className="story-company">Innovate Inc.</div>
                      <div className="story-metric">85%</div>
                    </div>
                    <div className="story-body">
                      <p>"The insights provided by the platform transformed how we evaluate talent. We've seen an 85% improvement in first-year retention rates!"</p>
                    </div>
                    <div className="story-footer">
                      <div className="story-author">Michael Chen</div>
                      <div className="story-position">Talent Acquisition Lead</div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="story-card fade-in-up" style={{animationDelay: "0.4s"}}>
                    <div className="story-header">
                      <div className="story-company">Global Services</div>
                      <div className="story-metric">40%</div>
                    </div>
                    <div className="story-body">
                      <p>"We've cut recruiting costs by 40% while doubling our qualified applicant pool. The automated screening is like having an extra team member."</p>
                    </div>
                    <div className="story-footer">
                      <div className="story-author">Jennifer Patel</div>
                      <div className="story-position">Recruiting Manager</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container-fluid cta-section">
        <div className="container">
          <div className="row align-items-center">
            {isLoading ? (
              <div className="col-12">
                <div className="skeleton-cta"></div>
              </div>
            ) : (
              <>
                <div className="col-lg-8">
                  <h2 className="cta-title fade-in">Ready to Experience These Features?</h2>
                  <p className="cta-text fade-in">Transform your hiring process today with our AI-powered recruitment platform.</p>
                </div>
                <div className="col-lg-4 text-center text-lg-end">
                  <Link to="/demo" className="btn-link">
                    <button className="cta-button fade-in">
                      Schedule a Demo <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;