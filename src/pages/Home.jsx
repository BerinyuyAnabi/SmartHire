import "../css/Home.css";
function Home() {
    return (
        <div className="home">
            <p>
                Find the Perfect <span className="highlight">Talent</span> with <br />
                <span className="highlight">AI-Powered</span> Precision
            </p>

            <p>
                Smart Hiring<span className="highlight">.</span>Faster<span className="highlight">.</span>Better
            </p>

            <div className="home-btns">
                <button className="logout-btn">Apply</button>
                <button className="home-btn">HR view</button>
            </div>
        </div>
    );
}

export default Home;
