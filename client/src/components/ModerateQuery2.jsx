import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModerateQuery2 = () => {
  const [avgSalariesByPosition, setAvgSalariesByPosition] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvgSalariesByPosition();
  }, []);

  const fetchAvgSalariesByPosition = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/avg_salary_by_position');
      if (response.data.status === 'Success') {
        setAvgSalariesByPosition(response.data.avgSalariesByPosition);
        setError('');
      } else {
        setError(response.data.error || 'Failed to fetch average salaries by position');
      }
    } catch (error) {
      console.error('Error fetching average salaries by position:', error);
      setError('Failed to fetch average salaries by position');
    }
  };

  return (
    <div className="p-3 d-flex flex-column align-items-center mt-3 text-white">
      <div className="floating-panel px-3 pt-2 pb-3 border shadow-sm w-50 mb-3">
        <div className="text-center pb-1">
          <h4>Moderate Query 2</h4>
        </div>
        <hr />
        <div>
          <p>Determine the average salary offered for each employment position</p>
          <p style={{ textAlign: 'center' }}>SELECT Employment_Position, 
            AVG(Employment_Salary) AS Avg_Salary 
            FROM Employment_History 
            GROUP BY Employment_Position;</p>
          {error && <div className="alert alert-danger">{error}</div>}
        </div>
      </div>

      <div className="floating-panel table-responsive w-50">
        <table className="table table-striped table-dark">
          <thead>
            <tr>
              <th>Employment Position</th>
              <th>Average Salary</th>
            </tr>
          </thead>
          <tbody>
            {avgSalariesByPosition.map((item, index) => (
              <tr key={index}>
                <td>{item.Employment_Position}</td>
                <td>{item.Avg_Salary.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModerateQuery2;
