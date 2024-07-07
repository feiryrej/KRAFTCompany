import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DifficultQuery3 = () => {
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/difficult_query_3');
      if (response.data.status === 'Success') {
        setApplicants(response.data.applicants);
        setError('');
      } else {
        setError(response.data.error || 'Failed to fetch applicants');
      }
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setError('Failed to fetch applicants');
    }
  };

  return (
    <div className="p-3 d-flex flex-column align-items-center mt-3 text-white">
      <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-50 mb-3">
        <div className="text-center pb-1">
          <h4>Difficult Query 3</h4>
        </div>
        <hr />
        <div>
          <p>Identify applicants who have references from people they have known for more than 5 years, and display details about their most recent job application.</p>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>

      <div className="table-responsive w-100">
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Applicant Name</th>
              <th>Last Applied Position</th>
              <th>Last Application Date</th>
              <th>Reference Name</th>
              <th>Reference Years Known</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(applicant => (
              <tr key={applicant.Applicant_Name + '-' + applicant.Reference_Name}>
                <td>{applicant.Applicant_Name}</td>
                <td>{applicant.Last_Applied_Position}</td>
                <td>{new Date(applicant.Last_Application_Date).toLocaleDateString()}</td>
                <td>{applicant.Reference_Name}</td>
                <td>{applicant.Reference_Years_KNown}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DifficultQuery3;
