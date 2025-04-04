import "../css/Home.css";
import { FaArrowRight } from "react-icons/fa"; // Importing an arrow icon

function Home() {
  return (
    <div className="home">
      <div className="home-header">
        <p className="home-title">
          Find the Perfect <br /> <span className="highlight">Talent</span> with
          AI-
          <br />
          Powered<span className="highlight"> Precision</span>
        </p>

        <div className="home-subtitle">
          <p className="subtitle">Smart Hiring. Faster. Better</p>
          <p className="subtitle-text">
            Leverage cutting-edge AI to identify top talent with <br />
            unmatched accuracy. Streamline your hiring process, reduce
            <br />
            time-to-hire, and make data-driven decisions with confidence.
            <br />
          </p>
          <div className="home-btns">
            <button className="logout-btn">Apply</button>
            <button className="home-btn">HR view</button>
          </div>
        </div>
      </div>
      <div className="home-image-container">
        <div className="image-wrapper">
          <img src="src/assets/home.png" alt="home" className="home-image" />
          <button className="image-btn">
            AI-Powered Talent Matching <FaArrowRight />
          </button>
        </div>
        <div className="image-wrapper">
          <img src="src/assets/home.png" alt="home" className="home-image" />
          <button className="image-btn">
            Automated Screening & Insights <FaArrowRight />
          </button>
        </div>
        <div className="image-wrapper">
          <img src="src/assets/home.png" alt="home" className="home-image2" />
          <button className="image-btn">
            Seamless & Efficient Hiring <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
