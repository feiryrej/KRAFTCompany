import React from "react";
import { Link } from "react-router-dom";

const Queries = () => {
  const handleEasyClick = (query) => {
    console.log(`Easy query ${query} clicked`);
  };

  const handleModerateClick = (query) => {
    console.log(`Moderate query ${query} clicked`);
  };

  const handleDifficultClick = (query) => {
    console.log(`Difficult query ${query} clicked`);
  };

  return (
    <div className="p-3 d-flex justify-content-around mt-3 text-white">
      <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-25">
        <div className="text-center pb-1">
          <h4>Easy</h4>
        </div>
        <hr />
        <div className="text-center">
          <h5>
            <Link
              to="/dashboard/easyqueary1"
              className="d-flex justify-content-center align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
              onClick={() => handleEasyClick(1)}
            >
              Easy Query 1
            </Link>
          </h5>
          <h5>
            <Link
              to="/dashboard/easyquery2"
              className="d-flex justify-content-center align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
              onClick={() => handleEasyClick(2)}
            >
              Easy Query 2
            </Link>
          </h5>
          <h5>
            <Link
              to="/dashboard/easyquery3"
              className="d-flex justify-content-center align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
              onClick={() => handleEasyClick(3)}
            >
              Easy Query 3
            </Link>
          </h5>
        </div>
      </div>
      <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-25">
        <div className="text-center pb-1">
          <h4>Moderate</h4>
        </div>
        <hr />
        <div className="text-center">
          <h5>
            <Link
              to="/dashboard/moderatequery1"
              className="d-flex justify-content-center align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
              onClick={() => handleModerateClick(1)}
            >
              Moderate Query 1
            </Link>
          </h5>
          <h5>
            <Link
              to="/dashboard/moderatequery2"
              className="d-flex justify-content-center align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
              onClick={() => handleModerateClick(2)}
            >
              Moderate Query 2
            </Link>
          </h5>
          <h5>
            <Link
              to="/dashboard/moderatequery3"
              className="d-flex justify-content-center align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
              onClick={() => handleModerateClick(3)}
            >
              Moderate Query 3
            </Link>
          </h5>
          <h5>
            <Link
              to="/dashboard/moderatequery4"
              className="d-flex justify-content-center align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
              onClick={() => handleModerateClick(3)}
            >
              Moderate Query 4
            </Link>
          </h5>
        </div>
      </div>
      <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-25">
        <div className="text-center pb-1">
          <h4>Difficult</h4>
        </div>
        <hr />
        <div className="text-center">
          <h5>
            <Link
              to="/dashboard/difficultquery1"
              className="d-flex justify-content-center align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
              onClick={() => handleDifficultClick(1)}
            >
              Difficult Query 1
            </Link>
          </h5>
          <h5>
            <Link
              to="/dashboard/difficultquery2"
              className="d-flex justify-content-center align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
              onClick={() => handleDifficultClick(2)}
            >
              Difficult Query 2
            </Link>
          </h5>
          <h5>
            <Link
              to="/dashboard/difficultquery3"
              className="d-flex justify-content-center align-items-center pb-3 mb-md-1 mt-md-3 me-md-auto text-white text-decoration-none"
              onClick={() => handleDifficultClick(3)}
            >
              Difficult Query 3
            </Link>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default Queries;
