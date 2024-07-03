import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Reference = () => {
  const [references, setReferences] = useState([]);
  const [filteredReferences, setFilteredReferences] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReferences();
  }, []);

  useEffect(() => {
    setFilteredReferences(
      references.filter((reference) =>
        reference.Reference_ID.toString().includes(searchTerm)
      )
    );
  }, [searchTerm, references]);

  const fetchReferences = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/auth/get_references"
      );
      if (response.data.status === "Success") {
        setReferences(response.data.references);
        setError("");
      } else {
        setError(response.data.error || "Failed to fetch references");
      }
    } catch (error) {
      console.error("Error fetching references:", error);
      setError("Failed to fetch references");
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this reference?"
      );
      if (!confirmDelete) {
        return;
      }

      const response = await axios.delete(
        `http://localhost:3000/auth/delete_reference/${id}`
      );
      if (response.status === 200) {
        fetchReferences();
      } else {
        setError("Failed to delete reference");
      }
    } catch (error) {
      console.error("Error deleting reference:", error);
      setError("Failed to delete reference");
    }
  };

  const handlePrint = (reference) => {
    const printContent = `
      <div>
        <h2>Reference Details</h2>
        <p><strong>ID:</strong> ${reference.Reference_ID}</p>
        <p><strong>Applicant ID:</strong> ${reference.Applicant_ID}</p>
        <p><strong>Name:</strong> ${reference.Reference_Name}</p>
        <p><strong>Phone Number:</strong> ${reference.Reference_PhoneNo}</p>
        <p><strong>Profession:</strong> ${reference.Reference_Profession}</p>
        <p><strong>Years Known:</strong> ${reference.Reference_Years_Known}</p>
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
        <h3>Reference History</h3>
        <div>
          <Link to="/dashboard/add_reference" className="btn btn-success">
            Add Reference
          </Link>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search by Reference ID"
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
              <th>Name</th>
              <th>Phone Number</th>
              <th>Profession</th>
              <th>Years Known</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReferences.map((reference) => (
              <tr key={reference.Reference_ID}>
                <td>{reference.Reference_ID}</td>
                <td>{reference.Applicant_ID}</td>
                <td>{reference.Reference_Name}</td>
                <td>{reference.Reference_PhoneNo}</td>
                <td>{reference.Reference_Profession}</td>
                <td>{reference.Reference_Years_Known}</td>
                <td>
                  <div className="btn-group" role="group">
                    <Link
                      to={`/dashboard/edit_reference/${reference.Reference_ID}`}
                      className="btn btn-info btn-sm me-2"
                    >
                      Edit
                    </Link>

                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleDelete(reference.Reference_ID)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handlePrint(reference)}
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

export default Reference;
