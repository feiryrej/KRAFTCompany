import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AddEmployment = () => {
  const [employment, setEmployment] = useState({
    Employment_History_ID: `EMPID-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    Applicant_ID: '',
    Employment_Start_Date: '',
    Employment_End_Date: null, // Changed to allow null end date
    Employment_Company_Name: '',
    Employment_Company_Address: '',
    Employment_Salary: '',
    Employment_Position: '',
    Employment_Reason_For_Leaving: ''
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
    if (!applicants.some(applicant => applicant.Applicant_ID === employment.Applicant_ID)) {
      setError('Applicant ID does not exist.');
      setSuccess('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/add_employment', employment);
      if (response.data.status) {
        setError('');
        setSuccess('Employment history successfully added.');
        navigate('/dashboard/employment');
      } else {
        setError('Failed to add employment history.');
        setSuccess('');
      }
    } catch (err) {
      console.error('Error adding employment history:', err);
      setError('Failed to add employment history.');
      setSuccess('');
    }
  };

  return (
    <div className='floating-panel'>
      <div className='d-flex justify-content-center'>
        <h3 style={{ color: 'white' }}>Add Employment History</h3>
      </div>
      <form className='d-flex flex-column align-items-center mt-3' onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger w-50" role="alert">{error}</div>}
        {success && <div className="alert alert-success w-50" role="alert">{success}</div>}
        <div className="mb-3 w-50">
          <label htmlFor="Applicant_ID" className="form-label" style={{ color: 'white' }}>Applicant ID</label>
          <input type="text" className="form-control" id="Applicant_ID" value={employment.Applicant_ID} onChange={(e) => setEmployment({...employment, Applicant_ID: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Employment_Start_Date" className="form-label" style={{ color: 'white' }}>Start Date</label>
          <input type="date" className="form-control" id="Employment_Start_Date" value={employment.Employment_Start_Date} onChange={(e) => setEmployment({...employment, Employment_Start_Date: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Employment_End_Date" className="form-label" style={{ color: 'white' }}>End Date</label>
          <input type="date" className="form-control" id="Employment_End_Date" value={employment.Employment_End_Date || ''} onChange={(e) => setEmployment({...employment, Employment_End_Date: e.target.value || null})} />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Employment_Company_Name" className="form-label" style={{ color: 'white' }}>Company Name</label>
          <input type="text" className="form-control" id="Employment_Company_Name" value={employment.Employment_Company_Name} onChange={(e) => setEmployment({...employment, Employment_Company_Name: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Employment_Company_Address" className="form-label" style={{ color: 'white' }}>Company Address</label>
          <input type="text" className="form-control" id="Employment_Company_Address" value={employment.Employment_Company_Address} onChange={(e) => setEmployment({...employment, Employment_Company_Address: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Employment_Salary" className="form-label" style={{ color: 'white' }}>Salary</label>
          <input type="text" className="form-control" id="Employment_Salary" value={employment.Employment_Salary} onChange={(e) => setEmployment({...employment, Employment_Salary: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Employment_Position" className="form-label" style={{ color: 'white' }}>Position</label>
          <input type="text" className="form-control" id="Employment_Position" value={employment.Employment_Position} onChange={(e) => setEmployment({...employment, Employment_Position: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Employment_Reason_For_Leaving" className="form-label" style={{ color: 'white' }}>Reason for Leaving</label>
          <input type="text" className="form-control" id="Employment_Reason_For_Leaving" value={employment.Employment_Reason_For_Leaving} onChange={(e) => setEmployment({...employment, Employment_Reason_For_Leaving: e.target.value})} />
        </div>
        <div className='d-flex justify-content-center w-50'>
          <Link to="/dashboard/employment" className="btn btn-secondary me-2">Cancel</Link>
          <button type="submit" className="btn btn-success">Add</button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployment;
