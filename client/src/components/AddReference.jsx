import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AddReference = () => {
  const [reference, setReference] = useState({
    Reference_ID: `REFID-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    Applicant_ID: '',
    Reference_Name: '',
    Reference_PhoneNo: '',
    Reference_Profession: '',
    Reference_Years_Known: ''
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
    if (!applicants.some(applicant => applicant.Applicant_ID === reference.Applicant_ID)) {
      setError('Applicant ID does not exist.');
      setSuccess('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/add_reference', reference);
      if (response.data.status) {
        setError('');
        setSuccess('Reference successfully added.');
        navigate('/dashboard/reference');
      } else {
        setError('Failed to add reference.');
        setSuccess('');
      }
    } catch (err) {
      console.error('Error adding reference:', err);
      setError('Failed to add reference.');
      setSuccess('');
    }
  };

  return (
    <div className='px-5 mt-3'>
      <div className='d-flex justify-content-center'>
        <h3>Add Reference</h3>
      </div>
      <form className='d-flex flex-column align-items-center mt-3' onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger w-50" role="alert">{error}</div>}
        {success && <div className="alert alert-success w-50" role="alert">{success}</div>}
        <div className="mb-3 w-50">
          <label htmlFor="Applicant_ID" className="form-label">Applicant ID</label>
          <input type="text" className="form-control" id="Applicant_ID" value={reference.Applicant_ID} onChange={(e) => setReference({...reference, Applicant_ID: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Reference_Name" className="form-label">Reference Name</label>
          <input type="text" className="form-control" id="Reference_Name" value={reference.Reference_Name} onChange={(e) => setReference({...reference, Reference_Name: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Reference_PhoneNo" className="form-label">Phone Number</label>
          <input type="text" className="form-control" id="Reference_PhoneNo" value={reference.Reference_PhoneNo} onChange={(e) => setReference({...reference, Reference_PhoneNo: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Reference_Profession" className="form-label">Profession</label>
          <input type="text" className="form-control" id="Reference_Profession" value={reference.Reference_Profession} onChange={(e) => setReference({...reference, Reference_Profession: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Reference_Years_Known" className="form-label">Years Known</label>
          <input type="text" className="form-control" id="Reference_Years_Known" value={reference.Reference_Years_Known} onChange={(e) => setReference({...reference, Reference_Years_Known: e.target.value})} required />
        </div>
        <button type="submit" className="btn btn-primary">Add Reference</button>
      </form>
    </div>
  );
};

export default AddReference;
