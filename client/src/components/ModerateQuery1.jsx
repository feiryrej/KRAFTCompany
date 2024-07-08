// ModerateQuery1.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModerateQuery1 = () => {
  const [applicationCounts, setApplicationCounts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplicationCounts();
  }, []);

  const fetchApplicationCounts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/application_counts');
      if (response.data.status === 'Success') {
        setApplicationCounts(response.data.applicationCounts);
        setError('');
      } else {
        setError(response.data.error || 'Failed to fetch application counts');
      }
    } catch (error) {
      console.error('Error fetching application counts:', error);
      setError('Failed to fetch application counts');
    }
  };

  return (
    <div className="p-3 d-flex flex-column align-items-center mt-3 text-white">
      <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-50 mb-3">
        <div className="text-center pb-1">
          <h4>Moderate Query 1</h4>
        </div>
        <hr />
        <div>
          <p>How many applications are there for each position?</p>
          <p style={{ textAlign: 'center' }}>SELECT Position, COUNT() AS Application_Count FROM job_application GROUP BY Position;</p>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>

      <div className="table-responsive w-50">
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Position</th>
              <th>Application Count</th>
            </tr>
          </thead>
          <tbody>
            {applicationCounts.map((item, index) => (
              <tr key={index}>
                <td>{item.Position}</td>
                <td>{item.Application_Count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModerateQuery1;
