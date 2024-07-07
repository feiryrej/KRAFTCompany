import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const AddEducation = () => {
  const [education, setEducation] = useState({
    Education_History_ID: `EDID-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    Applicant_ID: '',
    Education_School_Name: '',
    Education_Level: '',
    Education_Location: '',
    Education_Years: '',
    has_Graduated: false,
    Education_Subjects: ''
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
    if (!applicants.some(applicant => applicant.Applicant_ID === education.Applicant_ID)) {
      setError('Applicant ID does not exist.');
      setSuccess('');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/add_education', education);
      if (response.data.status) {
        setError('');
        setSuccess('Education history successfully added.');
        navigate('/dashboard/education');
      } else {
        setError('Failed to add education history.');
        setSuccess('');
      }
    } catch (err) {
      console.error('Error adding education history:', err);
      setError('Failed to add education history.');
      setSuccess('');
    }
  };

  return (
    <div className='floating-panel'>
      <div className='d-flex justify-content-center'>
        <h3 style={{ color: 'white' }}>Add Education History</h3>
      </div>
      <form className='d-flex flex-column align-items-center mt-3' onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger w-50" role="alert">{error}</div>}
        {success && <div className="alert alert-success w-50" role="alert">{success}</div>}
        <div className="mb-3 w-50">
          <label htmlFor="Applicant_ID" className="form-label" style={{ color: 'white' }}>Applicant ID</label>
          <input type="text" className="form-control" id="Applicant_ID" value={education.Applicant_ID} onChange={(e) => setEducation({...education, Applicant_ID: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Education_School_Name" className="form-label" style={{ color: 'white' }}>School Name</label>
          <input type="text" className="form-control" id="Education_School_Name" value={education.Education_School_Name} onChange={(e) => setEducation({...education, Education_School_Name: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Education_Level" className="form-label" style={{ color: 'white' }}>Education Level</label>
          <input type="text" className="form-control" id="Education_Level" value={education.Education_Level} onChange={(e) => setEducation({...education, Education_Level: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Education_Location" className="form-label" style={{ color: 'white' }}>Location</label>
          <input type="text" className="form-control" id="Education_Location" value={education.Education_Location} onChange={(e) => setEducation({...education, Education_Location: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Education_Years" className="form-label" style={{ color: 'white' }}>Years</label>
          <input type="text" className="form-control" id="Education_Years" value={education.Education_Years} onChange={(e) => setEducation({...education, Education_Years: e.target.value})} required />
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="has_Graduated" className="form-label" style={{ color: 'white' }}>Graduated</label>
          <select className="form-control" id="has_Graduated" value={education.has_Graduated} onChange={(e) => setEducation({...education, has_Graduated: e.target.value === 'true'})} required>
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </div>
        <div className="mb-3 w-50">
          <label htmlFor="Education_Subjects" className="form-label" style={{ color: 'white' }}>Subjects</label>
          <input type="text" className="form-control" id="Education_Subjects" value={education.Education_Subjects} onChange={(e) => setEducation({...education, Education_Subjects: e.target.value})} required />
        </div>
        <div className='d-flex justify-content-center w-50'>
          <Link to="/dashboard/education" className="btn btn-secondary me-2">Cancel</Link>
          <button type="submit" className="btn btn-success">Add</button>
        </div>
      </form>
    </div>
  );
};

export default AddEducation;
