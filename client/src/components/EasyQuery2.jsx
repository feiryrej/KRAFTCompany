import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EasyQuery2 = () => {
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplicantsSortedByName();
  }, []);

  const fetchApplicantsSortedByName = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/get_applicants_sorted_by_name');
      if (response.data.status === 'Success') {
        setApplicants(response.data.applicants);
        setError('');
      } else {
        setError(response.data.error || 'Failed to fetch applicants sorted by name');
      }
    } catch (error) {
      console.error('Error fetching applicants sorted by name:', error);
      setError('Failed to fetch applicants sorted by name');
    }
  };

  return (
    <div className="p-3 d-flex flex-column align-items-center mt-3 text-white">
      <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-50 mb-3">
        <div className="text-center pb-1">
          <h4>Easy Query 2</h4>
        </div>
        <hr />
        <div>
          <p>List all applicants sorted alphabetically by their names.</p>
          <p style={{ textAlign: 'center' }}>SELECT * FROM Applicant ORDER BY Name;</p>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>

      <div className="table-responsive w-75">
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>SSS Number</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(applicant => (
              <tr key={applicant.Applicant_ID}>
                <td>{applicant.Applicant_ID}</td>
                <td>{applicant.Name}</td>
                <td>{applicant.SSS_number}</td>
                <td>{applicant.Address}</td>
                <td>{applicant.Phone_No}</td>
                <td>{applicant.Email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EasyQuery2;
