import "../css/Card.css";
function Card() {
  return (
    <div className="card">
      <div className="uploads">
        <div>
          <button className="upload-btn">Upload CV</button>
        </div>
        <div>
          <button className="upload-btn">Upload Cover Letter</button>
        </div>
      </div>
      <div className="candidate-details">
        <div className="candidate-names">
          <input type="text" placeholder="Enter your first name" />
          <input type="text" placeholder="Enter your last name" />
        </div>
        <div className="candidate-address">
          <input type="text" placeholder="Enter your address" />
          <input type="text" placeholder="Enter email" />
        </div>
      </div>
      <div className="candidate-btns">
          <button className="role-btn"> Choose Role </button>
          <button className="submit-btn"> Submit </button>
        </div>
    </div>
  );
}

export default Card;
