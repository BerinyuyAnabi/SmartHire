import "../css/Portal.css";

function Portal() {
  return (
    <div className="portal">
      <h1>Pre Assessment</h1>
      <h6>Time: 00: 04:34</h6>

      <div className="question">
        <h2>Dynamic Programming</h2>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Neque sint
          quia nisi eum! Ipsum nobis neque dolorem fugit labore dignissimos
          quas, omnis voluptates voluptas officia delectus sed recusandae vero
          facilis.
        </p>
      </div>

      {/* Input with button inside */}
      <div className="input-container">
        <input type="text" placeholder="Type your answer..." />
        <button>Next</button>
      </div>
    </div>
  );
}

export default Portal;
