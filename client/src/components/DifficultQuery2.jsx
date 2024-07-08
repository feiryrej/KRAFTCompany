import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DifficultQuery2 = () => {
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/difficult_query_2');
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
          <h4>Difficult Query 2</h4>
        </div>
        <hr />
        <div>
          <p>Identify applicants who have recently applied for positions, have backgrounds in Computer Science or Information Technology, and have received specialized training. Display details of their latest application.</p>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>

      <div className="table-responsive w-100">
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Applicant Name</th>
              <th>Education Background</th>
              <th>Specialized Training</th>
              <th>Latest Applied Position</th>
              <th>Latest Application Date</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(applicant => (
              <tr key={applicant.Applicant_Name + '-' + applicant.Latest_Applied_Position}>
                <td>{applicant.Applicant_Name}</td>
                <td>{applicant.Education_Background}</td>
                <td>{applicant.Specialized_Training}</td>
                <td>{applicant.Latest_Applied_Position}</td>
                <td>{new Date(applicant.Latest_Application_Date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DifficultQuery2;