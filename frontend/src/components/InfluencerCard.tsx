import React, { useState, useEffect } from 'react';
import { Influencer } from '../interfaces/Influencer';
import {
  getEmployees,
  assignEmployeeToInfluencer,
} from '../services/employeeService';
import Button from './Button';
import Selector from './Selector';

interface InfluencerProps {
  influencer: Influencer;
}

const InfluencerCard: React.FC<InfluencerProps> = ({ influencer }) => {
  const [employees, setEmployees] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(
          data.map((emp) => ({
            id: emp.id,
            name: `${emp.first_name} ${emp.last_name}`,
          })),
        );
      } catch (err) {
        console.error('Failed to fetch employees', err);
      }
    };

    fetchEmployees();
  }, []);

  const handleAssign = async () => {
    if (selectedEmployee === null) {
      alert('Please select an employee');
      return;
    }

    try {
      await assignEmployeeToInfluencer(influencer.id, selectedEmployee);
      alert('Employee assigned successfully!');
    } catch (err) {
      console.error('Failed to assign employee', err);
      alert('Failed to assign employee');
    }
  };

  return (
    <div>
      <h2>{`${influencer.first_name} ${influencer.last_name}`}</h2>
      <ul>
        {influencer.social_media_accounts &&
        influencer.social_media_accounts.length > 0 ? (
          influencer.social_media_accounts.map((account, index) => (
            <li key={index}>
              {account.platform}: {account.username}
            </li>
          ))
        ) : (
          <li>No social media accounts found</li>
        )}
      </ul>
      <div>
        <label htmlFor={`employee-select-${influencer.id}`}>
          Assign to Employee:
        </label>
        <Selector<string>
          value={
            selectedEmployee !== null
              ? `${employees.find((e) => e.id === selectedEmployee)?.name || ''}`
              : ''
          }
          options={employees.map((employee) => employee.name)}
          onChange={(name) => {
            const selected = employees.find(
              (employee) => employee.name === name,
            );
            setSelectedEmployee(selected ? selected.id : null);
          }}
        />
        <Button onClick={handleAssign}>Assign</Button>
      </div>
    </div>
  );
};

export default InfluencerCard;
