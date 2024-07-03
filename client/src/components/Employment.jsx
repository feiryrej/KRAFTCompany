import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Employment = () => {
  const [employmentHistory, setEmploymentHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEmployment, setFilteredEmployment] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEmploymentHistory();
  }, []);

  useEffect(() => {
    setFilteredEmployment(
      employmentHistory.filter((employment) =>
        employment.Employment_History_ID.toString().includes(searchTerm)
      )
    );
  }, [searchTerm, employmentHistory]);

  const fetchEmploymentHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/get_employments"
      );
      console.log("Response:", response); // Log response data for debugging
      if (response.data.status === "Success") {
        setEmploymentHistory(response.data.employment);
        setError(""); // Clear error state on success
      } else {
        setError(response.data.error || "Failed to fetch employment history");
      }
    } catch (error) {
      console.error("Error fetching employment history:", error);
      setError("Failed to fetch employment history");
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this employment history?"
      );
      if (!confirmDelete) {
        return;
      }

      const response = await axios.delete(
        `http://localhost:3000/auth/delete_employment/${id}`
      );
      if (response.status === 200) {
        fetchEmploymentHistory();
      } else {
        setError("Failed to delete employment history");
      }
    } catch (error) {
      console.error("Error deleting employment history:", error);
      setError("Failed to delete employment history");
    }
  };

  const handlePrint = (employment) => {
    const printContent = `
      <div>
        <h2>Employment History Details</h2>
        <p><strong>ID:</strong> ${employment.Employment_History_ID}</p>
        <p><strong>Applicant ID:</strong> ${employment.Applicant_ID}</p>
        <p><strong>Start Date:</strong> ${employment.Employment_Start_Date}</p>
        <p><strong>End Date:</strong> ${
          employment.Employment_End_Date || "N/A"
        }</p>
        <p><strong>Company Name:</strong> ${
          employment.Employment_Company_Name
        }</p>
        <p><strong>Company Address:</strong> ${
          employment.Employment_Company_Address
        }</p>
        <p><strong>Salary:</strong> ${employment.Employment_Salary}</p>
        <p><strong>Position:</strong> ${employment.Employment_Position}</p>
        <p><strong>Reason for Leaving:</strong> ${
          employment.Employment_Reason_For_Leaving
        }</p>
      </div>
    `;

    const newWindow = window.open("", "", "width=800,height=600");
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Employment History</h3>
        <Link to="/dashboard/add_employment" className="btn btn-success">
          Add Employment History
        </Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by Employment History ID"
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
              <th>Start Date</th>
              <th>End Date</th>
              <th>Company Name</th>
              <th>Company Address</th>
              <th>Salary</th>
              <th>Position</th>
              <th>Reason for Leaving</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployment.map((employment) => (
              <tr key={employment.Employment_History_ID}>
                <td>{employment.Employment_History_ID}</td>
                <td>{employment.Applicant_ID}</td>
                <td>
                  {new Date(
                    employment.Employment_Start_Date
                  ).toLocaleDateString()}
                </td>
                <td>
                  {employment.Employment_End_Date
                    ? new Date(
                        employment.Employment_End_Date
                      ).toLocaleDateString()
                    : "N/A"}
                </td>
                <td>{employment.Employment_Company_Name}</td>
                <td>{employment.Employment_Company_Address}</td>
                <td>{employment.Employment_Salary}</td>
                <td>{employment.Employment_Position}</td>
                <td>{employment.Employment_Reason_For_Leaving}</td>
                <td>
                  <div className="btn-group" role="group">
                    <Link
                      to={`/dashboard/edit_employment/${employment.Employment_History_ID}`}
                      className="btn btn-info btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() =>
                        handleDelete(employment.Employment_History_ID)
                      }
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handlePrint(employment)}
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

export default Employment;
