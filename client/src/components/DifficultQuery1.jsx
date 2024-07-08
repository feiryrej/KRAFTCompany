// Frontend: DifficultQuery1.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DifficultQuery1 = () => {
  const [detailedApplicants, setDetailedApplicants] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDetailedApplicants();
  }, []);

  const fetchDetailedApplicants = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/detailed_applicants');
      if (response.data.status === 'Success') {
        setDetailedApplicants(response.data.detailedApplicants);
        setError('');
      } else {
        setError(response.data.error || 'Failed to fetch detailed applicants');
      }
    } catch (error) {
      console.error('Error fetching detailed applicants:', error);
      setError('Failed to fetch detailed applicants');
    }
  };   
  
  return (
    <div className="p-3 d-flex flex-column align-items-center mt-3 text-white">
      <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-50 mb-3">
        <div className="text-center pb-1">
          <h4>Difficult Query 1</h4>
        </div>
        <hr />
        <div>
          <p>Fetch detailed applicants including their employment history.</p>
          <p style={{ textAlign: 'center' }}>SELECT A.Applicant_ID, A.Name, A.SSS_Number, A.Address, A.Phone_No, A.Email,
           E.Employment_History_ID, E.Employment_Start_Date, E.Employment_End_Date,
           E.Employment_Company_Name, E.Employment_Company_Address, E.Employment_Salary,
           E.Employment_Position, E.Employment_Reason_For_Leaving
          FROM Applicant A
          JOIN Employment_History E ON A.Applicant_ID = E.Applicant_ID;</p>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>

      <div className="table-responsive w-100">
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Applicant ID</th>
              <th>Name</th>
              <th>SSS Number</th>
              <th>Address</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Employment History ID</th>
              <th>Employment Start Date</th>
              <th>Employment End Date</th>
              <th>Employment Company Name</th>
              <th>Employment Company Address</th>
              <th>Employment Salary</th>
              <th>Employment Position</th>
              <th>Employment Reason For Leaving</th>
            </tr>
          </thead>
          <tbody>
            {detailedApplicants.map(applicant => (
              <tr key={applicant.Applicant_ID + '-' + applicant.Employment_History_ID}>
                <td>{applicant.Applicant_ID}</td>
                <td>{applicant.Name}</td>
                <td>{applicant.SSS_Number}</td>
                <td>{applicant.Address}</td>
                <td>{applicant.Phone_No}</td>
                <td>{applicant.Email}</td>
                <td>{applicant.Employment_History_ID}</td>
                <td>{new Date(applicant.Employment_Start_Date).toLocaleDateString()}</td>
                <td>{applicant.Employment_End_Date ? new Date(applicant.Employment_End_Date).toLocaleDateString() : 'N/A'}</td>
                <td>{applicant.Employment_Company_Name}</td>
                <td>{applicant.Employment_Company_Address}</td>
                <td>{applicant.Employment_Salary}</td>
                <td>{applicant.Employment_Position}</td>
                <td>{applicant.Employment_Reason_For_Leaving}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DifficultQuery1;
