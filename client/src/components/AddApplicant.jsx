import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AddApplicant = () => {
    const [applicant, setApplicant] = useState({
        Name: '',
        SSS_number: '',
        Address: '',
        Phone_No: '',
        Email: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Check if any field is empty
        if (!applicant.Name || !applicant.SSS_number || !applicant.Address || !applicant.Phone_No || !applicant.Email) {
            setError('All fields are required.');
            setSuccess('');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/auth/add_applicant', applicant);
            if (response.data.status) {
                setError('');
                setSuccess('Applicant successfully added.');
                setApplicant({
                    Name: '',
                    SSS_number: '',
                    Address: '',
                    Phone_No: '',
                    Email: ''
                });
            } else {
                setError('Failed to add applicant.');
                setSuccess('');
            }
        } catch (err) {
            console.error('Error adding applicant:', err);
            setError('Failed to add applicant.');
            setSuccess('');
        }
    };

    return (
        <div className='px-5 mt-3'>
            <div className='d-flex justify-content-center'>
                <h3>Add New Applicant</h3>
            </div>
            <form className='d-flex flex-column align-items-center mt-3' onSubmit={handleSubmit}>
                {error && <div className="alert alert-danger w-50" role="alert">{error}</div>}
                {success && <div className="alert alert-success w-50" role="alert">{success}</div>}
                <div className="mb-3 w-50">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="Name" value={applicant.Name} onChange={(e) => setApplicant({...applicant, Name: e.target.value})}/>
                </div>
                <div className="mb-3 w-50">
                    <label htmlFor="sssNumber" className="form-label">SSS Number</label>
                    <input type="text" className="form-control" id="SSS_Number" value={applicant.SSS_number} onChange={(e) => setApplicant({...applicant, SSS_number: e.target.value})}/>
                </div>
                <div className="mb-3 w-50">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="Address" value={applicant.Address} onChange={(e) => setApplicant({...applicant, Address: e.target.value})}/>
                </div>
                <div className="mb-3 w-50">
                    <label htmlFor="phoneNo" className="form-label">Phone Number</label>
                    <input type="text" className="form-control" id="Phone_No" value={applicant.Phone_No} onChange={(e) => setApplicant({...applicant, Phone_No: e.target.value})}/>
                </div>
                <div className="mb-3 w-50">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="Email" value={applicant.Email} onChange={(e) => setApplicant({...applicant, Email: e.target.value})}/>
                </div>
                <div className='d-flex justify-content-center w-50'>
                    <Link to="/dashboard/applicant" className="btn btn-secondary me-2">Cancel</Link>
                    <button type="submit" className="btn btn-success">Add</button>
                </div>
            </form>
        </div>
    );
};

export default AddApplicant;
