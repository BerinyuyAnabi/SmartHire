import "../css/JobPosting.css";

function JobPosting() {
  return (
    <div className="jobposting">
      <p className="page-title">Job Description</p>
      <p className="gen-info">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis ea,
        consectetur, eius porro blanditiis a consequuntur alias exercitationem
        tempore beatae aperiam quaerat tenetur magni maxime laudantium, quidem
        quo qui at.
      </p>

      <div className="content">
        {/* General Info Section */}
        <div className="general-info">
          <p className="section-title">General Information</p>

          <input type="text" placeholder="Enter your first name" />

          <input type="text" placeholder="Enter your last name" />

          <input type="email" placeholder="Enter your email address" />

          <p>Gender</p>
          <div className="radio-group">
            <label>
              <input type="radio" name="gender" value="Male" />
              Male
            </label>
            <label>
              <input type="radio" name="gender" value="Female" />
              Female
            </label>
          </div>
        </div>

        {/* Other Information Section */}
        <div className="other-info">
          <p className="section-mini-title">
            Submit document in PDF. Ensure you name them properly
            (SurnameLastname)
          </p>

          <div className="buttons">
            <button>Upload CV</button>
            <button>Upload Cover Letter</button>
          </div>

          <input type="text" placeholder="Enter your phone number" />

          <input type="text" placeholder="Enter your qualifications" />
        </div>
      </div>

      {/* Submit Button Centered at Bottom */}
      <div className="submit-container">
        <button className="submit-button">Submit</button>
      </div>
    </div>
  );
}

export default JobPosting;
