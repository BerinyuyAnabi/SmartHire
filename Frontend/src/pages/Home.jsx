// import "../css/Home.css";
// import { FaArrowRight } from "react-icons/fa"; // Importing an arrow icon

// function Home() {
//   return (
//     <div className="home">
//       <div className="home-header">
//         <p className="home-title">
//           Find the Perfect <br /><span className="highlight">Talent</span> with
//           AI-
//           <br />
//           Powered<span className="highlight"> Precision</span>
//         </p>

//         <div className="home-subtitle">
//           <p className="subtitle">Smart Hiring. Faster. Better</p>
//           <p className="subtitle-text">
//             Leverage cutting-edge AI to identify top talent with <br />
//             unmatched accuracy. Streamline your hiring process, reduce
//             <br />
//             time-to-hire, and make data-driven decisions with confidence.
//             <br />
//           </p>
//           <div className="home-btns">
//             <button className="logout-btn"><span>Apply</span><img class="arrow_icon" src="src/assets/arrow.png" alt=""/></button>
//             <button className="home-btn">HR view</button>
//           </div>
//         </div>
//       </div>
//       <div className="home-image-container">
//         <div className="image-wrapper">
//           <img src="src/assets/home.png" alt="home" className="home-image" />
//           <button className="image-btn">
//             AI-Powered Talent Matching <FaArrowRight />
//           </button>
//         </div>
//         <div className="image-wrapper">
//           <img src="src/assets/home.png" alt="home" className="home-image" />
//           <button className="image-btn">
//             Automated Screening & Insights <FaArrowRight />
//           </button>
//         </div>
//         <div className="image-wrapper">
//           <img src="src/assets/home.png" alt="home" className="home-image2" />
//           <button className="image-btn">
//             Seamless & Efficient Hiring <FaArrowRight />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Home;


import React from "react";
import { FaArrowRight } from "react-icons/fa";
import "../css/Home.css";

function Home() {
  // Add useEffect to inject Bootstrap CDN link
  React.useEffect(() => {
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

  return (
    <div className="container home py-5">
      {/* Header Section */}
      <div className="row align-items-center mb-5">
        <div className="col-lg-5 mb-4 mb-lg-0">
          <h1 className="home-title">
            Find the Perfect <br />
            <span className="highlight">Talent</span> with AI-
            <br />
            Powered<span className="highlight"> Precision</span>
          </h1>
        </div>
        
        <div className="col-lg-7">
          <div className="home-subtitle">
            <h2 className="subtitle">Smart Hiring. Faster. Better</h2>
            <p className="subtitle-text">
              Leverage cutting-edge AI to identify top talent with 
              unmatched accuracy. Streamline your hiring process, reduce
              time-to-hire, and make data-driven decisions with confidence.
            </p>
            <div className="home-btns">
              <button className="home-btn">
                <span>Apply</span>
                <img className="arrow_icon ms-2" src="static/images/arrow.png" alt="" />
              </button>
              <button className=" home-btn-1">
                <span>HR view</span>
                <img className="arrow_icon ms-2" src="static/images/arrow.png" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Images Section */}
      <div className="row home-image-container justify-content-center">
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="image-wrapper">
            <img src="static/images/home.png" alt="home" className="img-fluid home-image rounded" />
            <button className="image-btn">
              AI-Powered Talent Matching <FaArrowRight />
            </button>
          </div>
        </div>
        
        <div className="col-md-6 col-lg-4 mb-4">
          <div className="image-wrapper">
            <img src="static/images/home.png" alt="home" className="img-fluid home-image rounded" />
            <button className="image-btn">
              Automated Screening & Insights <FaArrowRight />
            </button>
          </div>
        </div>
        
        <div className="col-md-12 col-lg-4 mb-4">
          <div className="image-wrapper">
            <img src="static/images/home.png" alt="home" className="img-fluid home-image2 rounded" />
            <button className="image-btn">
              Seamless & Efficient Hiring <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;