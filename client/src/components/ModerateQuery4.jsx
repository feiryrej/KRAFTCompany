import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModerateQuery4 = () => {
  const [educationLevels, setEducationLevels] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEducationLevels();
  }, []);

  const fetchEducationLevels = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/education_levels');
      if (response.data.status === 'Success') {
        setEducationLevels(response.data.educationLevels);
        setError('');
      } else {
        setError(response.data.error || 'Failed to fetch education levels');
      }
    } catch (error) {
      console.error('Error fetching education levels:', error);
      setError('Failed to fetch education levels');
    }
  };

  return (
    <div className="p-3 d-flex flex-column align-items-center mt-3 text-white">
      <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-50 mb-3">
        <div className="text-center pb-1">
          <h4>Moderate Query 4</h4>
        </div>
        <hr />
        <div>
          <p>Which education levels do our applicants have, and how many applicants belong to each level?</p>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>

      <div className="table-responsive w-50">
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Education Level</th>
              <th>Applicant Count</th>
            </tr>
          </thead>
          <tbody>
            {educationLevels.map((level, index) => (
              <tr key={index}>
                <td>{level.Education_Level}</td>
                <td>{level.Applicant_Count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModerateQuery4;
