import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditEmployment = () => {
  const { id } = useParams();
  const [employment, setEmployment] = useState({
    Employment_Start_Date: "",
    Employment_End_Date: "",
    Employment_Company_Name: "",
    Employment_Company_Address: "",
    Employment_Salary: "",
    Employment_Position: "",
    Employment_Reason_For_Leaving: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployment = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/auth/get_employment/${id}`);
        const { data } = response;
        if (data.status === "Success") {
          const fetchedEmployment = data.employment[0];
          setEmployment({
            Employment_Start_Date: fetchedEmployment.Employment_Start_Date ? new Date(fetchedEmployment.Employment_Start_Date).toISOString().split('T')[0] : '',
            Employment_End_Date: fetchedEmployment.Employment_End_Date ? new Date(fetchedEmployment.Employment_End_Date).toISOString().split('T')[0] : '',
            Employment_Company_Name: fetchedEmployment.Employment_Company_Name,
            Employment_Company_Address: fetchedEmployment.Employment_Company_Address,
            Employment_Salary: fetchedEmployment.Employment_Salary,
            Employment_Position: fetchedEmployment.Employment_Position,
            Employment_Reason_For_Leaving: fetchedEmployment.Employment_Reason_For_Leaving
          });
        } else {
          console.error("Failed to fetch employment:", data.error);
        }
      } catch (error) {
        console.error("Error fetching employment:", error);
      }
    };

    fetchEmployment();
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.Employment_End_Date = null
    axios
      .put(`http://localhost:3000/auth/edit_employment/${id}`, employment)
      .then((result) => {
        if (result.data.status === "Success") {
          navigate("/dashboard/employment");
        } else {
          alert(result.data.error);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="floating-panel d-flex justify-content-center align-items-center mt-3 text-white">
      <div className="p-3 rounded w-50">
        <h3 className="text-center">Edit Employment</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputStartDate" className="form-label">
              Start Date
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputStartDate"
              value={employment.Employment_Start_Date}
              onChange={(e) =>
                setEmployment({ ...employment, Employment_Start_Date: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputEndDate" className="form-label">
              End Date
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputEndDate"
              value={employment.Employment_End_Date}
              onChange={(e) =>
                setEmployment({ ...employment, Employment_End_Date: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputCompanyName" className="form-label">
              Company Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputCompanyName"
              placeholder="Enter Company Name"
              value={employment.Employment_Company_Name}
              onChange={(e) =>
                setEmployment({ ...employment, Employment_Company_Name: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputCompanyAddress" className="form-label">
              Company Address
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputCompanyAddress"
              placeholder="Enter Company Address"
              value={employment.Employment_Company_Address}
              onChange={(e) =>
                setEmployment({ ...employment, Employment_Company_Address: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputSalary" className="form-label">
              Salary
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSalary"
              placeholder="Enter Salary"
              value={employment.Employment_Salary}
              onChange={(e) =>
                setEmployment({ ...employment, Employment_Salary: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputPosition" className="form-label">
              Position
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputPosition"
              placeholder="Enter Position"
              value={employment.Employment_Position}
              onChange={(e) =>
                setEmployment({ ...employment, Employment_Position: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputReason" className="form-label">
              Reason for Leaving
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputReason"
              placeholder="Enter Reason for Leaving"
              value={employment.Employment_Reason_For_Leaving}
              onChange={(e) =>
                setEmployment({ ...employment, Employment_Reason_For_Leaving: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Employment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployment;
