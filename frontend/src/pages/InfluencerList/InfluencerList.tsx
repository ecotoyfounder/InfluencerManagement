import React, { useEffect, useState } from 'react';
import {
  deleteInfluencer,
  getInfluencers,
} from '../../services/influencerService';
import {
  getEmployees,
  assignEmployeeToInfluencer,
} from '../../services/employeeService';
import { Influencer } from '../../interfaces/Influencer';
import { Employee } from '../../interfaces/Employee';
import InfluencerCard from '../../components/InfluencerCard/InfluencerCard';
import Selector from '../../components/Selector/Selector';
import Button from '../../components/Button/Button';
import './InfluencerList.css';
import Input from '../../components/Input/Input';

const InfluencerList: React.FC = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Для поиска
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>(
    [],
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const updateInfluencerManager = (
    influencerId: number,
    manager: Employee | null,
  ) => {
    setInfluencers((prev) =>
      prev.map((influencer) =>
        influencer.id === influencerId
          ? { ...influencer, manager }
          : influencer,
      ),
    );
  };

  const handleDeleteInfluencer = async (id: number) => {
    try {
      await deleteInfluencer(id);
      setInfluencers((prev) =>
        prev.filter((influencer) => influencer.id !== id),
      );
      alert('Influencer deleted successfully!');
    } catch (err) {
      console.error('Failed to delete influencer', err);
      alert('Failed to delete influencer');
    }
  };

  const handleAssignEmployee = async (influencerId: number) => {
    if (!selectedEmployee) {
      alert('Please select an employee');
      return;
    }

    try {
      await assignEmployeeToInfluencer(influencerId, selectedEmployee);
      const manager = employees.find((e) => e.id === selectedEmployee);
      updateInfluencerManager(influencerId, manager || null);
      alert('Employee assigned successfully!');
    } catch (err) {
      console.error('Failed to assign employee', err);
      alert('Failed to assign employee');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [influencersData, employeesData]: [Influencer[], Employee[]] =
          await Promise.all([getInfluencers(), getEmployees()]);
        setInfluencers(influencersData);
        setEmployees(employeesData);
        setFilteredInfluencers(influencersData);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = influencers.filter(
      (influencer) =>
        `${influencer.first_name} ${influencer.last_name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        influencer.manager?.first_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        influencer.manager?.last_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()),
    );
    setFilteredInfluencers(filtered);
  }, [searchTerm, influencers]);

  const handleEmployeeChange = (name: string) => {
    const selected = employees.find(
      (e) => `${e.first_name} ${e.last_name}` === name,
    );
    setSelectedEmployee(selected ? selected.id : null);
  };

  const getSelectedEmployeeName = () => {
    if (selectedEmployee) {
      const employee = employees.find((e) => e.id === selectedEmployee);
      return employee ? `${employee.first_name} ${employee.last_name}` : '';
    }
    return '';
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h1>Influencer List</h1>

      <Input
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search ..."
      />

      <div className="container">
        {filteredInfluencers && filteredInfluencers.length > 0 ? (
          filteredInfluencers.map((influencer) => (
            <div key={influencer.id} className="item-container">
              <InfluencerCard influencer={influencer} />
              <div className="actions">
                <Selector<string>
                  value={getSelectedEmployeeName()}
                  options={employees.map(
                    (e) => `${e.first_name} ${e.last_name}`,
                  )}
                  onChange={handleEmployeeChange}
                  placeholder="Select an employee ..."
                />
                <Button onClick={() => handleAssignEmployee(influencer.id)}>
                  Assign
                </Button>
                <Button
                  className="remove-btn"
                  onClick={() => handleDeleteInfluencer(influencer.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>No influencers found.</p>
        )}
      </div>
    </div>
  );
};

export default InfluencerList;
