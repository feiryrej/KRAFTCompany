import axios from "axios";
import React, { useEffect, useState } from "react";

function Home() {
  const [adminCount, setAdminCount] = useState(0);
  const [applicantCount, setApplicantCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/admin_count")
      .then((res) => {
        if (res.data.Status) {
          setAdminCount(res.data.Result[0].admin);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3000/auth/applicant_count")
      .then((res) => {
        if (res.data.Status) {
          setApplicantCount(res.data.Result[0].applicants);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3000/auth/application_count")
      .then((res) => {
        if (res.data.Status) {
          setApplicationCount(res.data.Result[0].applications);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get("http://localhost:3000/auth/admin_records")
      .then((res) => {
        if (res.data.Status) {
          setAdmins(res.data.Result);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <div className="p-3 d-flex justify-content-around mt-3 text-white">
        <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Admin</h4>
          </div>
          <hr />
          <div>
            <h5>Total: {adminCount}</h5>
          </div>
        </div>
        <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Applicants</h4>
          </div>
          <hr />
          <div>
            <h5>Total: {applicantCount}</h5>
          </div>
        </div>
        <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Applications</h4>
          </div>
          <hr />
          <div>
            <h5>Total: {applicationCount}</h5>
          </div>
        </div>
      </div>
      <div className="floating-panel d-flex justify-content-around align-items-center mt-4">
        <div>
          <img
            src="/logoim.png"
            alt="Logo"
            className="img-fluid"
            style={{ maxHeight: "70%", maxWidth: "70%", objectFit: "contain", marginLeft: "20px" }}
          />
        </div>
        <div className="w-50">
          <h2 style={{ color: 'white', fontSize: '2.5rem' }}>KRAFT Company</h2>
          <p style={{ color: 'white', fontSize: '1.5rem', lineHeight: '1.5' }}>
            K.R.A.F.T. Company, a leading tech organization, is seeking to streamline its employment
            application process by implementing a comprehensive database system for the company's
            employment application form. The aim is to efficiently manage the influx of applications, track
            candidate progress, and facilitate seamless communication between recruiters and applicants.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
