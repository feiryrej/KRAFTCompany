import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AddApplication = () => {
  const [application, setApplication] = useState({
    Application_ID: `AID-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    Applicant_ID: '',
    Position: '',
    Date_of_Application: '',
    Date_can_Start: '',
    Salary_Desired: '',
    is_Currently_Employed: false,
    can_Inquire_Current_Employer: false, // Set default value to false
    has_Applied_Before: false,
    Applied_Before_Where: '',
    Applied_Before_When: '',
    Special_Study_Subject: '',
    Special_Training: '',
    Special_Skills: ''
  });
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth/get_applicants");
      if (response.data.status === "Success") {
        setApplicants(response.data.applicants);
      } else {
        setError(response.data.error || "Failed to fetch applicants");
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setError("Failed to fetch applicants");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if Applicant ID exists
    if (!applicants.some(applicant => applicant.Applicant_ID === application.Applicant_ID)) {
      setError('Applicant ID does not exist.');
      setSuccess('');
      return;
    }

    try {
      console.log("Submitting application: ", application); // Debug log
      const response = await axios.post('http://localhost:3000/auth/add_application', application);
      if (response.data.status === 'Success') {
        setError('');
        setSuccess('Application successfully added.');
        navigate('/dashboard/application');
      } else {
        setError('Failed to add application.');
        setSuccess('');
      }
    } catch (err) {
      console.error('Error adding application:', err);
      setError('Failed to add application.');
      setSuccess('');
    }
  };

  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h3>Add Application</h3>
      </div>
      <form className='d-flex flex-column align-items-center mt-3' onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger w-50" role="alert">{error}</div>}
        {success && <div className="alert alert-success w-50" role="alert">{success}</div>}
        <div className="mb-3 w-50">
          <label htmlFor="Applicant_ID" className="form-label">Applicant ID</label>
          <input type="text" className="form-control" id="Applicant_ID" value={application.Applicant_ID} onChange={(e) => setApplication({...application, Applicant_ID: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Position" className="form-label">Position</label>
          <input type="text" className="form-control" id="Position" value={application.Position} onChange={(e) => setApplication({...application, Position: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Date_of_Application" className="form-label">Date of Application</label>
          <input type="date" className="form-control" id="Date_of_Application" value={application.Date_of_Application} onChange={(e) => setApplication({...application, Date_of_Application: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Date_can_Start" className="form-label">Date can Start</label>
          <input type="date" className="form-control" id="Date_can_Start" value={application.Date_can_Start} onChange={(e) => setApplication({...application, Date_can_Start: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Salary_Desired" className="form-label">Salary Desired</label>
          <input type="text" className="form-control" id="Salary_Desired" value={application.Salary_Desired} onChange={(e) => setApplication({...application, Salary_Desired: e.target.value})} required />
        </div>
        <div className="mb-3 form-check w-50">
          <input type="checkbox" className="form-check-input" id="is_Currently_Employed" checked={application.is_Currently_Employed} onChange={(e) => setApplication({...application, is_Currently_Employed: e.target.checked})} />
          <label className="form-check-label" htmlFor="is_Currently_Employed">Currently Employed</label>
        </div>
        <div className="mb-3 form-check w-50">
          <input
            type="checkbox"
            className="form-check-input"
            id="can_Inquire_Current_Employer"
            checked={application.can_Inquire_Current_Employer || false} // Default to false if null
            onChange={(e) => setApplication({ ...application, can_Inquire_Current_Employer: e.target.checked })}
          />
          <label className="form-check-label" htmlFor="can_Inquire_Current_Employer">Can Inquire Current Employer</label>
        </div>
        <div className="mb-3 form-check w-50">
          <input type="checkbox" className="form-check-input" id="has_Applied_Before" checked={application.has_Applied_Before} onChange={(e) => setApplication({...application, has_Applied_Before: e.target.checked})} />
          <label className="form-check-label" htmlFor="has_Applied_Before">Applied Before</label>
        </div>
        {application.has_Applied_Before && (
          <>
            <div className="mb-3 w-50">
              <label htmlFor="Applied_Before_Where" className="form-label">Where Applied Before</label>
              <input type="text" className="form-control" id="Applied_Before_Where" value={application.Applied_Before_Where} onChange={(e) => setApplication({...application, Applied_Before_Where: e.target.value})} />
            </div>
            <div className="mb-3 w-50">
              <label htmlFor="Applied_Before_When" className="form-label">When Applied Before</label>
              <input type="date" className="form-control" id="Applied_Before_When" value={application.Applied_Before_When} onChange={(e) => setApplication({...application, Applied_Before_When: e.target.value})} />
            </div>
          </>
        )}
        <div className="mb-3 w-50">
          <label htmlFor="Special_Study_Subject" className="form-label">Special Study Subject</label>
          <input type="text" className="form-control" id="Special_Study_Subject" value={application.Special_Study_Subject} onChange={(e) => setApplication({...application, Special_Study_Subject: e.target.value})} />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Special_Training" className="form-label">Special Training</label>
          <input type="text" className="form-control" id="Special_Training" value={application.Special_Training} onChange={(e) => setApplication({...application, Special_Training: e.target.value})} />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Special_Skills" className="form-label">Special Skills</label>
          <input type="text" className="form-control" id="Special_Skills" value={application.Special_Skills} onChange={(e) => setApplication({...application, Special_Skills: e.target.value})} />
        </div>
        <button type="submit" className="btn btn-primary">Add Application</button>
      </form>
    </div>
  );
};

export default AddApplication;
