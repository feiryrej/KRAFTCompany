import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditEducation = () => {
  const { id } = useParams();
  const [education, setEducation] = useState({
    Education_School_Name: "",
    Education_Level: "",
    Education_Location: "",
    Education_Years: "",
    has_Graduated: "", // This will be a string "true" or "false"
    Education_Subjects: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/auth/education/${id}`)
      .then((result) => {
        console.log('Fetched Education:', result.data);
        setEducation({
          Education_School_Name: result.data.education[0].Education_School_Name,
          Education_Level: result.data.education[0].Education_Level,
          Education_Location: result.data.education[0].Education_Location,
          Education_Years: result.data.education[0].Education_Years,
          has_Graduated: result.data.education[0].has_Graduated ? "true" : "false",
          Education_Subjects: result.data.education[0].Education_Subjects
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:3000/auth/edit_education/${id}`, {
        ...education,
        has_Graduated: education.has_Graduated === "true"
      })
      .then((result) => {
        if (result.data.status === "Success") {
          navigate("/dashboard/education");
        } else {
          alert(result.data.error);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="floating-panel d-flex justify-content-center align-items-center mt-3 text-white">
      <div className="p-3 rounded w-50">
        <h3 className="text-center">Edit Education</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputSchoolName" className="form-label">
              School Name
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSchoolName"
              placeholder="Enter School Name"
              value={education.Education_School_Name}
              onChange={(e) =>
                setEducation({ ...education, Education_School_Name: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputLevel" className="form-label">
              Education Level
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputLevel"
              placeholder="Enter Education Level"
              value={education.Education_Level}
              onChange={(e) =>
                setEducation({ ...education, Education_Level: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputLocation" className="form-label">
              Location
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputLocation"
              placeholder="Enter Location"
              value={education.Education_Location}
              onChange={(e) =>
                setEducation({ ...education, Education_Location: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputYears" className="form-label">
              Years
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputYears"
              placeholder="Enter Years"
              value={education.Education_Years}
              onChange={(e) =>
                setEducation({ ...education, Education_Years: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputGraduated" className="form-label">
              Graduated (Yes/No)
            </label>
            <select
              className="form-control"
              id="inputGraduated"
              value={education.has_Graduated}
              onChange={(e) =>
                setEducation({ ...education, has_Graduated: e.target.value })
              }
              required
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
          <div className="col-12">
            <label htmlFor="inputSubjects" className="form-label">
              Subjects
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSubjects"
              placeholder="Enter Subjects"
              value={education.Education_Subjects}
              onChange={(e) =>
                setEducation({ ...education, Education_Subjects: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Education
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEducation;
