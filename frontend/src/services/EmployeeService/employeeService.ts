import { Employee } from '../../interfaces/Employee';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const getEmployees = async (): Promise<Employee[]> => {
  const response = await fetch(`${API_URL}/employees`);
  return response.json();
};

export const assignEmployeeToInfluencer = async (
  influencerId: number,
  employeeId: number,
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/influencers/${influencerId}/assign`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employee_id: employeeId }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to assign employee');
  }
};

export const unassignEmployeeToInfluencer = async (
  influencerId: number,
): Promise<void> => {
  const response = await fetch(
    `${API_URL}/influencers/${influencerId}/unassign`,
    {
      method: 'POST',
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to unassign manager');
  }
};
