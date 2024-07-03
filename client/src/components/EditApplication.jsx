import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditApplication = () => {
  const { id } = useParams();
  const [application, setApplication] = useState({
    Application_ID: "",
    Applicant_ID: '',
    Position: '',
    Date_of_Application: '',
    Date_can_Start: '',
    Salary_Desired: '',
    is_Currently_Employed: false,
    can_Inquire_Current_Employer: false,
    has_Applied_Before: false,
    Applied_Before_Where: '',
    Applied_Before_When: '',
    Special_Study_Subject: '',
    Special_Training: '',
    Special_Skills: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/auth/application/${id}`);
        const { data } = response;
        if (data.status === "Success") {
          const fetchedApplication = data.application[0];
          setApplication({
            ...fetchedApplication,
            Date_of_Application: fetchedApplication.Date_of_Application ? new Date(fetchedApplication.Date_of_Application).toISOString().split('T')[0] : '',
            Date_can_Start: fetchedApplication.Date_can_Start ? new Date(fetchedApplication.Date_can_Start).toISOString().split('T')[0] : '',
            Applied_Before_When: fetchedApplication.Applied_Before_When ? new Date(fetchedApplication.Applied_Before_When).toISOString().split('T')[0] : '',
          });
        } else {
          console.error("Failed to fetch application:", data.error);
        }
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };
  
    fetchApplication();
  }, [id]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting Application:', application);
    try {
      const response = await axios.put(`http://localhost:3000/auth/edit_application/${id}`, application);
      const { data } = response;
      if (data.status === "Success") {
        navigate("/dashboard/application");
      } else {
        alert(data.error || "Failed to edit application.");
      }
    } catch (error) {
      console.error("Error editing application:", error);
      alert("Failed to edit application.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Edit Application</h3>
        <form className="row g-1" onSubmit={handleSubmit}>
          <div className="col-12">
            <label htmlFor="inputPosition" className="form-label">
              Position
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputPosition"
              placeholder="Enter Position"
              value={application.Position}
              onChange={(e) =>
                setApplication({ ...application, Position: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputDateOfApplication" className="form-label">
              Date of Application
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputDateOfApplication"
              value={application.Date_of_Application}
              onChange={(e) =>
                setApplication({ ...application, Date_of_Application: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputDateCanStart" className="form-label">
              Date can Start
            </label>
            <input
              type="date"
              className="form-control rounded-0"
              id="inputDateCanStart"
              value={application.Date_can_Start}
              onChange={(e) =>
                setApplication({ ...application, Date_can_Start: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputSalaryDesired" className="form-label">
              Salary Desired
            </label>
            <input
              type="number"
              className="form-control rounded-0"
              id="inputSalaryDesired"
              placeholder="Enter Salary Desired"
              value={application.Salary_Desired}
              onChange={(e) =>
                setApplication({ ...application, Salary_Desired: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label className="form-check-label d-block mb-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={application.is_Currently_Employed}
                onChange={(e) =>
                  setApplication({ ...application, is_Currently_Employed: e.target.checked })
                }
              />
              Currently Employed
            </label>
          </div>
          <div className="col-12">
            <label className="form-check-label d-block mb-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={application.can_Inquire_Current_Employer}
                onChange={(e) =>
                  setApplication({ ...application, can_Inquire_Current_Employer: e.target.checked })
                }
              />
              Can Inquire Current Employer
            </label>
          </div>
          <div className="col-12">
            <label className="form-check-label d-block mb-2">
              <input
                type="checkbox"
                className="form-check-input"
                checked={application.has_Applied_Before}
                onChange={(e) =>
                  setApplication({ ...application, has_Applied_Before: e.target.checked })
                }
              />
              Applied Before
            </label>
          </div>
          {application.has_Applied_Before && (
            <div className="col-12">
              <label htmlFor="inputAppliedBeforeWhere" className="form-label">
                Where did you apply before?
              </label>
              <input
                type="text"
                className="form-control rounded-0"
                id="inputAppliedBeforeWhere"
                placeholder="Enter where you applied before"
                value={application.Applied_Before_Where}
                onChange={(e) =>
                  setApplication({ ...application, Applied_Before_Where: e.target.value })
                }
                autoComplete="off"
              />
            </div>
          )}
          {application.has_Applied_Before && (
            <div className="col-12">
              <label htmlFor="inputAppliedBeforeWhen" className="form-label">
                When did you apply before?
              </label>
              <input
                type="date"
                className="form-control rounded-0"
                id="inputAppliedBeforeWhen"
                value={application.Applied_Before_When}
                onChange={(e) =>
                  setApplication({ ...application, Applied_Before_When: e.target.value })
                }
                autoComplete="off"
              />
            </div>
          )}
          <div className="col-12">
            <label htmlFor="inputSpecialStudySubject" className="form-label">
              Special Study Subject (optional)
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSpecialStudySubject"
              placeholder="Enter special study subject"
              value={application.Special_Study_Subject}
              onChange={(e) =>
                setApplication({ ...application, Special_Study_Subject: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputSpecialTraining" className="form-label">
              Special Training (optional)
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSpecialTraining"
              placeholder="Enter special training"
              value={application.Special_Training}
              onChange={(e) =>
                setApplication({ ...application, Special_Training: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <label htmlFor="inputSpecialSkills" className="form-label">
              Special Skills (optional)
            </label>
            <input
              type="text"
              className="form-control rounded-0"
              id="inputSpecialSkills"
              placeholder="Enter special skills"
              value={application.Special_Skills}
              onChange={(e) =>
                setApplication({ ...application, Special_Skills: e.target.value })
              }
              autoComplete="off"
            />
          </div>
          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Edit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditApplication;
