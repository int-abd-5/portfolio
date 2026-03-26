import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Foundational Developer Journey</h4>
                <h5>Academic + Core C++ Projects</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Built data-structures and systems projects in C++, including
              Solitaire, customer service modules, and assembly-based logic
              games with focus on algorithms and performance.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full-Stack & Mobile Builder</h4>
                <h5>CrisisConnect Ecosystem</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Developed mobile and backend components for disaster support
              workflows, including real-time alerts, response coordination, and
              AI-assisted data processing services.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>AI + Product Development</h4>
                <h5>SkillSwap, ASL Translation, Voice Systems</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Building practical AI products and full-stack platforms with
              React, Node.js, Python, and ML tooling, focused on accessibility,
              peer learning, and human-centered software.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
