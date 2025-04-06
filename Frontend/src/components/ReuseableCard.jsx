import React from "react";
import PropTypes from "prop-types";

const SmartHireCard = ({ type, data }) => {
  // Common styling for both card types
  const cardStyle = {
    border: "1px solid #e1e1e1",
    borderRadius: "8px",
    padding: "20px",
    margin: "16px 0",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    maxWidth: "600px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start", // Changed to flex-start for better button alignment
    marginBottom: "16px"
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: "600",
    margin: "0"
  };

  const subtitleStyle = {
    fontSize: "14px",
    color: "#666",
    margin: "4px 0"
  };

  const dividerStyle = {
    borderTop: "1px solid #e1e1e1",
    margin: "16px 0"
  };

  const keywordStyle = {
    display: "inline-block",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    padding: "4px 8px",
    margin: "4px",
    fontSize: "12px"
  };

  const buttonContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px"
  };

  if (type === "applicant") {
    // ... (keep the existing applicant code unchanged)
  }

  if (type === "job") {
    return (
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={{ flex: 1 }}>
            <h2 style={titleStyle}>{data.title}</h2>
            <p style={subtitleStyle}>{data.company}</p>
            
            {/* Job details in one line */}
            <div style={{ display: "flex", gap: "8px", margin: "8px 0", flexWrap: "wrap" }}>
              <span style={keywordStyle}>{data.salary}</span>
              {data.applicants && <span style={keywordStyle}>{data.applicants} applicants</span>}
              <span style={keywordStyle}>{data.employmentType}</span>
              <span style={keywordStyle}>{data.locationType}</span>
              <span style={keywordStyle}>{data.location}</span>
            </div>
            
            {/* Brief job description */}
            {data.briefDescription && (
              <p style={{ fontSize: "14px", margin: "8px 0" }}>{data.briefDescription}</p>
            )}
          </div>
          
          {/* Buttons stacked vertically on the right */}
          <div style={buttonContainerStyle}>
            <button style={{ 
              backgroundColor: "#4CAF50", 
              color: "white", 
              border: "none", 
              padding: "8px 16px", 
              borderRadius: "4px", 
              cursor: "pointer",
              width: "100px"
            }}>
              Apply
            </button>
            <button style={{ 
              backgroundColor: "transparent", 
              border: "1px solid #ccc", 
              padding: "8px 16px", 
              borderRadius: "4px", 
              cursor: "pointer",
              width: "100px"
            }}>
              Save
            </button>
          </div>
        </div>

        <div style={dividerStyle} />

        {data.overviewTags && (
          <div>
            <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>Overview</h3>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {data.overviewTags.map((tag, index) => (
                <span key={index} style={keywordStyle}>
                  {tag}
                </span>
              ))}
            </div>
            <div style={dividerStyle} />
          </div>
        )}

        {data.responsibilities && (
          <div>
            <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>Responsibilities</h3>
            <ul style={{ paddingLeft: "20px", fontSize: "14px" }}>
              {data.responsibilities.map((item, index) => (
                <li key={index} style={{ marginBottom: "4px" }}>
                  {item}
                </li>
              ))}
            </ul>
            <div style={dividerStyle} />
          </div>
        )}

        {data.requirements && (
          <div>
            <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>Requirements</h3>
            <ul style={{ paddingLeft: "20px", fontSize: "14px" }}>
              {data.requirements.map((item, index) => (
                <li key={index} style={{ marginBottom: "4px" }}>
                  {item}
                </li>
              ))}
            </ul>
            <div style={dividerStyle} />
          </div>
        )}

        {data.preferredQualifications && (
          <div>
            <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>Preferred Qualifications</h3>
            <ul style={{ paddingLeft: "20px", fontSize: "14px" }}>
              {data.preferredQualifications.map((item, index) => (
                <li key={index} style={{ marginBottom: "4px" }}>
                  {item}
                </li>
              ))}
            </ul>
            <div style={dividerStyle} />
          </div>
        )}

        {data.benefits && (
          <div>
            <h3 style={{ fontSize: "16px", marginBottom: "8px" }}>What We Offer</h3>
            <ul style={{ paddingLeft: "20px", fontSize: "14px" }}>
              {data.benefits.map((item, index) => (
                <li key={index} style={{ marginBottom: "4px" }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return null;
};

SmartHireCard.propTypes = {
  type: PropTypes.oneOf(["applicant", "job"]).isRequired,
  data: PropTypes.object.isRequired
};

export default SmartHireCard;