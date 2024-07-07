import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditReference = () => {
  const { id } = useParams();
  const [reference, setReference] = useState({
    Reference_Name: "",
    Reference_PhoneNo: "",
    Reference_Profession: "",
    Reference_Years_Known: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/reference/${id}`)
      .then((result) => {
        console.log(result.data); // Log the full response to see its structure
        const fetchedData = {
          Reference_Name: result.data.reference[0].Reference_Name,
          Reference_PhoneNo: result.data.reference[0].Reference_PhoneNo,
          Reference_Profession: result.data.reference[0].Reference_Profession,
          Reference_Years_Known: result.data.reference[0].Reference_Years_Known
        };
        console.log(fetchedData); // Log the mapped data
        setReference(fetchedData);
      })
      .catch((err) => console.log(err));
  }, [id]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
    axios
    .put(`http://localhost:3000/auth/edit_reference/${id}`, reference)
    .then((result) => {
      if (result.data.status === "Success") {
        navigate("/dashboard/reference");
      } else {
        alert(result.data.error);
      }
    })
    .catch((err) => console.error(err));  
  };

  return (
    <div className="floating-panel d-flex justify-content-center align-items-center mt-3 text-white">
      <div className="p-3 rounded w-50">
        <h3 className="text-center">Edit Reference</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputReferenceName" className="form-label">
              Reference Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputReferenceName"
              placeholder="Enter Reference Name"
              value={reference.Reference_Name}
              onChange={(e) =>
                setReference({ ...reference, Reference_Name: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputReferencePhone" className="form-label">
              Reference Phone
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputReferencePhone"
              placeholder="Enter Reference Phone"
              value={reference.Reference_PhoneNo}
              onChange={(e) =>
                setReference({ ...reference, Reference_PhoneNo: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputReferenceProfession" className="form-label">
              Profession
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputReferenceEmail"
              placeholder="Enter Reference Email"
              value={reference.Reference_Profession}
              onChange={(e) =>
                setReference({ ...reference, Reference_Profession: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputReferenceYearsKnown" className="form-label">
              Years Known
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputReferenceYearsKnown"
              placeholder="Enter Reference Relationship"
              value={reference.Reference_Years_Known}
              onChange={(e) =>
                setReference({ ...reference, Reference_Years_Known: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Reference
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReference;
