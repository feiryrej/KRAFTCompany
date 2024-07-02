import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.get('http://localhost:3000/auth/logout')
      .then(res => {
        if (res.data.Status) {
          navigate('/adminLogin'); // Redirect using React Router
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
            <Link
              to="/dashboard"
              className="d-flex align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
            >
              <span className="fs-5 fw-bolder d-none d-sm-inline">
                Admin Dashboard
              </span>
            </Link>
            <ul
              className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
              id="menu"
            >
              <li>
                <Link
                  to="/dashboard"
                  data-bs-toggle="collapse"
                  className="nav-link text-white px-0 align-middle"
                >
                  <i className="fs-4 bi-speedometer2"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/Dashboard/Applicant"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-file-earmark-person"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">Applicants</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/Dashboard/Education"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-book"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">
                    Education History
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/Dashboard/Employment"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-briefcase"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">
                    Employment History
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/Dashboard/Application"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-file-earmark-text"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">Applications</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/Dashboard/Reference"
                  className="nav-link px-0 align-middle text-white"
                >
                  <i className="fs-4 bi-person-badge"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">References</span>
                </Link>
              </li>
              <li onClick={handleLogout}>
                <a href="#" className="nav-link px-0 align-middle text-white">
                  <i className="fs-4 bi-power"></i>{" "}
                  <span className="ms-1 d-none d-sm-inline">Logout</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="col p-0 m-0">
          <div className="p-2 d-flex justify-content-center shadow">
            <h4>Employee Management System</h4>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
