import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditApplicant = () => {
  const { id } = useParams();
  const [applicant, setApplicant] = useState({
    Name: "",
    SSS_number: "",
    Address: "",
    Phone_No: "",
    Email: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/applicant/${id}`)
      .then((result) => {
        setApplicant({
          ...applicant,
          Name: result.data.Result[0].Name,
          SSS_number: result.data.Result[0].SSS_number,
          Address: result.data.Result[0].Address,
          Phone_No: result.data.Result[0].Phone_No,
          Email: result.data.Result[0].Email,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/auth/edit_applicant/${id}`, applicant)
      .then((result) => {
        if (result.data.status === "Success") {
          // Check for 'Success' instead of 'Status'
          navigate("/dashboard/applicant");
        } else {
          alert(result.data.error); // Display error message if update fails
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="floating-panel d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50">
        <h3 className="text-center text-white">Edit Applicant</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputName" className="form-label text-white">
              Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputName"
              placeholder="Enter Name"
              value={applicant.Name}
              onChange={(e) =>
                setApplicant({ ...applicant, Name: e.target.value })
              }
              autoComplete="off" // added autocomplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputSSSNumber" className="form-label text-white">
              SSS Number
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSSSNumber"
              placeholder="Enter SSS Number"
              value={applicant.SSS_number}
              onChange={(e) =>
                setApplicant({ ...applicant, SSS_number: e.target.value })
              }
              autoComplete="off" // added autocomplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputAddress" className="form-label text-white">
              Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputAddress"
              placeholder="Enter Address"
              value={applicant.Address}
              onChange={(e) =>
                setApplicant({ ...applicant, Address: e.target.value })
              }
              autoComplete="off" // added autocomplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPhoneNo" className="form-label text-white">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputPhoneNo"
              placeholder="Enter Phone Number"
              value={applicant.Phone_No}
              onChange={(e) =>
                setApplicant({ ...applicant, Phone_No: e.target.value })
              }
              autoComplete="off" // added autocomplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEmail" className="form-label text-white">
              Email
            </label>
            <input
              type="email"
              className="form-control rounded-0"
              id="inputEmail"
              placeholder="Enter Email"
              value={applicant.Email}
              onChange={(e) =>
                setApplicant({ ...applicant, Email: e.target.value })
              }
              autoComplete="off" // added autocomplete="off"
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Applicant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditApplicant;
