function SearchTab() {
  return (
    <div className="search">
        <input type="text" placeholder="Search.." />
        <div className="suggested-searches">
          <p>Suggested job searches :</p>
          <div className="search-tags">
            <span>Software Engineering</span>
            <span>Cybersecurity</span>
            <span>Motion Graphics</span>
            <span>Graphic Designer</span>
            <span>Front-End Developer</span>
            <span>UI/UX Designer</span>
          </div>
        </div>
      </div>
  );
}

export default SearchTab