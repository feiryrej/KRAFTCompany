import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    setFilteredApplications(
      applications.filter((application) =>
        application.Application_ID.toString().includes(searchTerm)
      )
    );
  }, [searchTerm, applications]);

  const fetchApplications = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/get_application"
      );
      console.log("Response:", response); // Log response data for debugging
      if (response.data.status === "Success") {
        setApplications(response.data.applications);
        setError(""); // Clear error state on success
      } else {
        setError(response.data.error || "Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("Failed to fetch applications");
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this application?"
      );
      if (!confirmDelete) {
        return;
      }

      const response = await axios.delete(
        `http://localhost:3000/auth/delete_application/${id}`
      );
      if (response.status === 200) {
        fetchApplications();
      } else {
        setError("Failed to delete application");
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      setError("Failed to delete application");
    }
  };

  const handlePrint = (application) => {
    const printContent = `
      <div>
        <h2>Application Details</h2>
        <p><strong>ID:</strong> ${application.Application_ID}</p>
        <p><strong>Applicant ID:</strong> ${application.Applicant_ID}</p>
        <p><strong>Position:</strong> ${application.Position}</p>
        <p><strong>Date of Application:</strong> ${new Date(application.Date_of_Application).toLocaleDateString()}</p>
        <p><strong>Date can Start:</strong> ${new Date(application.Date_can_Start).toLocaleDateString()}</p>
        <p><strong>Salary Desired:</strong> ${application.Salary_Desired}</p>
        <p><strong>Currently Employed:</strong> ${application.is_Currently_Employed ? 'Yes' : 'No'}</p>
        <p><strong>Can Inquire Current Employer:</strong> ${application.can_Inquire_Current_Employer ? 'Yes' : 'No'}</p>
        <p><strong>Applied Before:</strong> ${application.has_Applied_Before ? 'Yes' : 'No'}</p>
        <p><strong>Where Applied Before:</strong> ${application.Applied_Before_Where || 'N/A'}</p>
        <p><strong>When Applied Before:</strong> ${application.Applied_Before_When ? new Date(application.Applied_Before_When).toLocaleDateString() : 'N/A'}</p>
        <p><strong>Special Study Subject:</strong> ${application.Special_Study_Subject || 'N/A'}</p>
        <p><strong>Special Training:</strong> ${application.Special_Training || 'N/A'}</p>
        <p><strong>Special Skills:</strong> ${application.Special_Skills || 'N/A'}</p>
      </div>
    `;
    
    const newWindow = window.open('', '', 'width=800,height=600');
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Job Applications</h3>
        <Link to="/dashboard/add_application" className="btn btn-success">
          Add Application
        </Link>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by Application ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Applicant ID</th>
              <th>Position</th>
              <th>Date of Application</th>
              <th>Date can Start</th>
              <th>Salary Desired</th>
              <th>Currently Employed</th>
              <th>Can Inquire Current Employer</th>
              <th>Applied Before</th>
              <th>Where Applied Before</th>
              <th>When Applied Before</th>
              <th>Special Study Subject</th>
              <th>Special Training</th>
              <th>Special Skills</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((application) => (
              <tr key={application.Application_ID}>
                <td>{application.Application_ID}</td>
                <td>{application.Applicant_ID}</td>
                <td>{application.Position}</td>
                <td>{new Date(application.Date_of_Application).toLocaleDateString()}</td>
                <td>{new Date(application.Date_can_Start).toLocaleDateString()}</td>
                <td>{application.Salary_Desired}</td>
                <td>{application.is_Currently_Employed ? 'Yes' : 'No'}</td>
                <td>{application.can_Inquire_Current_Employer ? 'Yes' : 'No'}</td>
                <td>{application.has_Applied_Before ? 'Yes' : 'No'}</td>
                <td>{application.Applied_Before_Where || 'N/A'}</td>
                <td>{application.Applied_Before_When ? new Date(application.Applied_Before_When).toLocaleDateString() : 'N/A'}</td>
                <td>{application.Special_Study_Subject || 'N/A'}</td>
                <td>{application.Special_Training || 'N/A'}</td>
                <td>{application.Special_Skills || 'N/A'}</td>
                <td>
                  <div className="btn-group" role="group">
                    <Link
                      to={`/dashboard/edit_application/${application.Application_ID}`}
                      className="btn btn-info btn-sm me-2"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleDelete(application.Application_ID)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handlePrint(application)}
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

export default Applications;
