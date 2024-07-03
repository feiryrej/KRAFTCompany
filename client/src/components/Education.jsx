import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Education = () => {
  const [educationHistory, setEducationHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEducation, setFilteredEducation] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchEducationHistory();
  }, []);

  useEffect(() => {
    setFilteredEducation(
      educationHistory.filter((education) =>
        education.Education_History_ID.toString().includes(searchTerm)
      )
    );
  }, [searchTerm, educationHistory]);

  const fetchEducationHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/get_educations"
      );
      console.log("Response:", response); // Log response data for debugging
      if (response.data.status === "Success") {
        setEducationHistory(response.data.education);
        setError(""); // Clear error state on success
      } else {
        setError(response.data.error || "Failed to fetch education history");
      }
    } catch (error) {
      console.error("Error fetching education history:", error);
      setError("Failed to fetch education history");
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this education history?");
      if (!confirmDelete) {
        return;
      }
  
      const response = await axios.delete(
        `http://localhost:3000/auth/auth/delete_education/${id}`
      );
      if (response.status === 200) {
        fetchEducationHistory();
      } else {
        setError("Failed to delete education history");
      }
    } catch (error) {
      console.error("Error deleting education history:", error);
      setError("Failed to delete education history");
    }
  };
  

  const handlePrint = (education) => {
    const printContent = `
      <div>
        <h2>Education History Details</h2>
        <p><strong>ID:</strong> ${education.Education_History_ID}</p>
        <p><strong>Applicant ID:</strong> ${education.Applicant_ID}</p>
        <p><strong>School Name:</strong> ${education.Education_School_Name}</p>
        <p><strong>Education Level:</strong> ${education.Education_Level}</p>
        <p><strong>Location:</strong> ${education.Education_Location}</p>
        <p><strong>Years:</strong> ${education.Education_Years}</p>
        <p><strong>Graduated:</strong> ${education.has_Graduated ? 'Yes' : 'No'}</p>
        <p><strong>Subjects:</strong> ${education.Education_Subjects}</p>
      </div>
    `;
    
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Education History</h3>
        <Link to="/dashboard/add_education" className="btn btn-success">
          Add Education History
        </Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by Education History ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Applicant ID</th>
              <th>School Name</th>
              <th>Education Level</th>
              <th>Location</th>
              <th>Years</th>
              <th>Graduated</th>
              <th>Subjects</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEducation.map((education) => (
              <tr key={education.Education_History_ID}>
                <td>{education.Education_History_ID}</td>
                <td>{education.Applicant_ID}</td>
                <td>{education.Education_School_Name}</td>
                <td>{education.Education_Level}</td>
                <td>{education.Education_Location}</td>
                <td>{education.Education_Years}</td>
                <td>{education.has_Graduated ? 'Yes' : 'No'}</td>
                <td>{education.Education_Subjects}</td>
                <td>
                  <div className="btn-group" role="group">
                    <Link
                      to={`/dashboard/edit_education/${education.Education_History_ID}`}
                      className="btn btn-info btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleDelete(education.Education_History_ID)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handlePrint(education)}
                    >
                      Print
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Education;
