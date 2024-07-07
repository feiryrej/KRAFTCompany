// ModerateQuery3.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const ModerateQuery3 = () => {
  const [
    applicantsWithPreviousApplications,
    setApplicantsWithPreviousApplications,
  ] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplicantsWithPreviousApplications();
  }, []);

  const fetchApplicantsWithPreviousApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/applicants_with_previous_applications"
      );
      if (response.data.status === "Success") {
        setApplicantsWithPreviousApplications(
          response.data.applicantsWithPreviousApplications
        );
        setError("");
      } else {
        setError(
          response.data.error ||
            "Failed to fetch applicants with previous applications"
        );
      }
    } catch (error) {
      console.error(
        "Error fetching applicants with previous applications:",
        error
      );
      setError("Failed to fetch applicants with previous applications");
    }
  };

  return (
    <div className="p-3 d-flex flex-column align-items-center mt-3 text-white">
      <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-50 mb-3">
        <div className="text-center pb-1">
          <h4>Moderate Query 3</h4>
        </div>
        <hr />
        <div>
          <p>
            Who are the applicants that have applied before, and where did they
            apply previously?
          </p>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>

      <div className="table-responsive w-50">
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Applicant ID</th>
              <th>Applied Before Where</th>
            </tr>
          </thead>
          <tbody>
            {applicantsWithPreviousApplications.map((item, index) => (
              <tr key={index}>
                <td>{item.Applicant_ID}</td>
                <td>{item.Applied_Before_Where || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModerateQuery3;
