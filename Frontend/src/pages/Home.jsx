// import React from "react";
// import { Link } from 'react-router-dom';
// import { FaArrowRight } from "react-icons/fa";
// import "../css/Home.css";

// function Home() {
//   // Add useEffect to inject Bootstrap CDN link
//   React.useEffect(() => {
//     // Check if the link is already in the document
//     if (!document.getElementById('bootstrap-cdn')) {
//       const link = document.createElement('link');
//       link.id = 'bootstrap-cdn';
//       link.rel = 'stylesheet';
//       link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css';
//       link.integrity = 'sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN';
//       link.crossOrigin = 'anonymous';
//       document.head.appendChild(link);
//     }
    
//     return () => {
//       // Optional: Remove the link when component unmounts
//       // const link = document.getElementById('bootstrap-cdn');
//       // if (link) document.head.removeChild(link);
//     };
//   }, []);

//   return (
//     <div className="container home py-5">
//       {/* Header Section */}
//       <div className="row align-items-center mb-5">
//         <div className="col-lg-5 mb-4 mb-lg-0">
//           <h1 className="home-title">
//             Find the Perfect <br />
//             <span className="highlight">Talent</span> with AI-
//             <br />
//             Powered<span className="highlight"> Precision</span>
//           </h1>
//         </div>
        
//         <div className="col-lg-7">
//           <div className="home-subtitle">
//             <h2 className="subtitle">Smart Hiring. Faster. Better</h2>
//             <p className="subtitle-text">
//               Leverage cutting-edge AI to identify top talent with 
//               unmatched accuracy. Streamline your hiring process, reduce
//               time-to-hire, and make data-driven decisions with confidence.
//             </p>
//             <div className="home-btns">
//                 <Link to="/job-posting">
//                   <button className="home-btn">
//                     <span>Apply</span>
//                     <img className="arrow_icon ms-2" src="static/images/arrow.png" alt="" />
//                   </button>
//                 </Link>
                
//                 <Link to="/admin">
//                   <button className="home-btn-1">
//                     <span>HR view</span>
//                     <img className="arrow_icon ms-2" src="static/images/arrow.png" alt="" />
//                   </button>
//                 </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Images Section */}
//       <div className="row home-image-container justify-content-center">
//         <div className="col-md-6 col-lg-4 mb-4">
//           <div className="image-wrapper">
//             <img src="static/images/home.png" alt="home" className="img-fluid home-image rounded" />
//             <button className="image-btn">
//               AI-Powered Talent Matching <FaArrowRight />
//             </button>
//           </div>
//         </div>
        
//         <div className="col-md-6 col-lg-4 mb-4">
//           <div className="image-wrapper">
//             <img src="static/images/home.png" alt="home" className="img-fluid home-image rounded" />
//             <button className="image-btn">
//               Automated Screening & Insights <FaArrowRight />
//             </button>
//           </div>
//         </div>
        
//         <div className="col-md-12 col-lg-4 mb-4">
//           <div className="image-wrapper">
//             <img src="static/images/home.png" alt="home" className="img-fluid home-image2 rounded" />
//             <button className="image-btn">
//               Seamless & Efficient Hiring <FaArrowRight />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;


import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import "../css/Home.css";

function Home() {
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
    <div className="home">
      {/* Header Section */}
      <div className="container-fluid px-0">
        <div className="row g-0 hero-section align-items-center">
          <div className="col-lg-6">
            {isLoading ? (
              <div className="skeleton-container-home">
                <div className="skeleton-title-home"></div>
                <div className="skeleton-subtitle-home"></div>
                <div className="skeleton-text-home"></div>
                <div className="skeleton-text-home"></div>
                <div className="skeleton-buttons-home">
                  <div className="skeleton-button-home"></div>
                  <div className="skeleton-button-home"></div>
                </div>
              </div>
            ) : (
              <div className="hero-content fade-in">
                <h1 className="home-title">
                  Find the Perfect <span className="highlight">Talent</span> with AI-
                  <span className="highlight">Powered</span> Precision
                </h1>
                <h2 className="subtitle mt-4">Smart Hiring. Faster. Better.</h2>
                <p className="subtitle-text mt-3">
                  Leverage cutting-edge AI to identify top talent with 
                  unmatched accuracy. Streamline your hiring process, reduce 
                  time-to-hire, and make data-driven decisions with confidence.
                </p>
                <div className="home-btns">
                  <Link to="/job-posting" className="btn-link">
                    <button className="home-btn">
                      Apply <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  </Link>
                  <Link to="/hr" className="btn-link">
                    <button className="home-btn-1">
                      HR view <i className="fas fa-arrow-right ms-2"></i>
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-6">
            {isLoading ? (
              <div className="skeleton-image-home"></div>
            ) : (
              <div className="hero-image-container fade-in">
                <img src="static/images/home.png" alt="AI Hiring" className="hero-image" />
                <div className="hero-overlay"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container features-section">
        <div className="row">
          <div className="col-12 text-center">
            <h2 className="section-title fade-in-up">Our Advanced Solutions</h2>
            <div className="section-divider-home"></div>
          </div>
        </div>
        
        <div className="row mt-5">
          {isLoading ? (
            <>
              <div className="col-md-4">
                <div className="skeleton-feature-home">
                  <div className="skeleton-feature-icon-home"></div>
                  <div className="skeleton-feature-title-home"></div>
                  <div className="skeleton-feature-text-home"></div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="skeleton-feature-home">
                  <div className="skeleton-feature-icon-home"></div>
                  <div className="skeleton-feature-title-home"></div>
                  <div className="skeleton-feature-text-home"></div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="skeleton-feature-home">
                  <div className="skeleton-feature-icon-home"></div>
                  <div className="skeleton-feature-title-home"></div>
                  <div className="skeleton-feature-text-home"></div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="col-md-4">
                <div className="feature-card fade-in-up">
                  <div className="feature-icon">
                    <i className="fas fa-brain"></i>
                  </div>
                  <h3 className="feature-title">AI-Powered Talent Matching</h3>
                  <p className="feature-text">
                    Our proprietary algorithms match candidates to positions with unprecedented accuracy.
                  </p>
                  <Link to="/features" className="feature-link">
                    Learn more <i className="fas fa-chevron-right ms-2"></i>
                  </Link>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="feature-card fade-in-up" style={{animationDelay: "0.2s"}}>
                  <div className="feature-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h3 className="feature-title">Automated Screening & Insights</h3>
                  <p className="feature-text">
                    Save hours with intelligent resume parsing and candidate evaluation.
                  </p>
                  <Link to="/features" className="feature-link">
                    Learn more <i className="fas fa-chevron-right ms-2"></i>
                  </Link>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="feature-card fade-in-up" style={{animationDelay: "0.4s"}}>
                  <div className="feature-icon">
                    <i className="fas fa-rocket"></i>
                  </div>
                  <h3 className="feature-title">Seamless & Efficient Hiring</h3>
                  <p className="feature-text">
                    End-to-end solution that transforms your recruitment pipeline.
                  </p>
                  <Link to="/features" className="feature-link">
                    Learn more <i className="fas fa-chevron-right ms-2"></i>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Testimonials Section */}
      <div className="container-fluid testimonial-section">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <h2 className="section-title">What Our Clients Say</h2>
              <div className="section-divider-home"></div>
            </div>
          </div>
          
          <div className="row mt-5">
            {isLoading ? (
              <>
                <div className="col-md-6">
                  <div className="skeleton-testimonial-home"></div>
                </div>
                <div className="col-md-6">
                  <div className="skeleton-testimonial-home"></div>
                </div>
              </>
            ) : (
              <>
                <div className="col-md-6">
                  <div className="testimonial-card fade-in-up">
                    <div className="testimonial-quote">"The AI matching technology has reduced our time-to-hire by 60% while improving candidate quality."</div>
                    <div className="testimonial-author">
                      <div className="testimonial-name">Sarah Johnson</div>
                      <div className="testimonial-position">HR Director, TechCorp</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="testimonial-card fade-in-up" style={{animationDelay: "0.2s"}}>
                    <div className="testimonial-quote">"The insights provided by the platform have transformed how we evaluate talent. Game-changing!"</div>
                    <div className="testimonial-author">
                      <div className="testimonial-name">Michael Chen</div>
                      <div className="testimonial-position">Talent Acquisition Lead, Innovate Inc.</div>
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
                <div className="skeleton-cta-home"></div>
              </div>
            ) : (
              <>
                <div className="col-lg-8">
                  <h2 className="cta-title fade-in">Ready to Transform Your Hiring Process?</h2>
                  <p className="cta-text fade-in">Join thousands of companies that are already experiencing the power of AI-driven talent acquisition.</p>
                </div>
                <div className="col-lg-4 text-center text-lg-end">
                  <Link to="Login" className="btn-link">
                    <button className="cta-button fade-in">
                      HR View <i className="fas fa-arrow-right ms-2"></i>
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

export default Home;

// Function to load FontAwesome script
function loadFontAwesome() {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js';
  script.integrity = 'sha512-Tn2m0TIpgVyTzzvmxLNuqbSJH3JP8jm+Cy3hvHrW7ndTDcJ1w5mBiksqDBb8GpE2ksktFvDB/ykZ0mDpsZj20w==';
  script.crossOrigin = 'anonymous';
  script.defer = true;
  
  document.head.appendChild(script);
}

// Function to inject Inter font
function loadInterFont() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
  
  document.head.appendChild(link);
}

// Function to handle page preloader
function handlePreloader() {
  // Create preloader elements
  const preloader = document.createElement('div');
  preloader.className = 'preloader';
  
  const spinner = document.createElement('div');
  spinner.className = 'preloader-spinner';
  
  preloader.appendChild(spinner);
  document.body.appendChild(preloader);
  
  // Hide preloader after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('fade-out');
      
      // Remove preloader from DOM after animation
      setTimeout(() => {
        if (preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 500);
    }, 1000);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadFontAwesome();
  loadInterFont();
  handlePreloader();
  
});