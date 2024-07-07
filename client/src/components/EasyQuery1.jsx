// Frontend: EasyQuery1.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EasyQuery1 = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplicationsWithHighSalary();
  }, []);

  const fetchApplicationsWithHighSalary = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/applications_with_high_salary'); // Adjust URL as needed
      if (response.data.status === 'Success') {
        setApplications(response.data.applications);
        setError('');
      } else {
        setError(response.data.error || 'Failed to fetch applications with high salary');
      }
    } catch (error) {
      console.error('Error fetching applications with high salary:', error);
      setError('Failed to fetch applications with high salary');
    }
  };

  return (
    <div className="p-3 d-flex flex-column align-items-center mt-3 text-white">
      <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-50 mb-3">
        <div className="text-center pb-1">
          <h4>Easy Query 1</h4>
        </div>
        <hr />
        <div>
          <p>Retrieve applications from candidates who are seeking a salary higher than PHP 50,000.</p>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>

      <div className="table-responsive w-75">
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Applicant ID</th>
              <th>Position</th>
              <th>Date of Application</th>
              <th>Date can Start</th>
              <th>Salary Desired</th>
              <th>Currently Employed</th>
              <th>Can Inquire Current Employer</th>
              <th>Applied Before</th>
              <th>Applied Before Where</th>
              <th>Applied Before When</th>
              <th>Special Study Subject</th>
              <th>Special Training</th>
              <th>Special Skills</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(application => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EasyQuery1;
