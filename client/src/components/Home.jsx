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
      <div className="p-3 d-flex justify-content-around mt-3">
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Admin</h4>
          </div>
          <hr />
          <div>
            <h5>Total: {adminCount}</h5>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Applicants</h4>
          </div>
          <hr />
          <div>
            <h5>Total: {applicantCount}</h5>
          </div>
        </div>
        <div className="px-3 pt-2 pb-3 border shadow-sm w-25">
          <div className="text-center pb-1">
            <h4>Applications</h4>
          </div>
          <hr />
          <div>
            <h5>Total: {applicationCount}</h5>
          </div>
        </div>
      </div>

      {/* List of admin */}
      <div className="mt-4 px-5 pt-3">
        <h3>List of Admins</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
