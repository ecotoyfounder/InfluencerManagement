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
import AssignEmployee from '../../components/AssignEmployee/AssignEmployee';
import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import useFilteredInfluencers from '../../hooks/useFilteredInfluencers';
import './InfluencerList.css';
import Modal from '../../components/Modal/Modal';
import Loader from '../../components/Loader/Loader';

const InfluencerList: React.FC = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [selectedInfluencerId, setSelectedInfluencerId] = useState<
    number | null
  >(null);

  const filteredInfluencers = useFilteredInfluencers(influencers, searchTerm);

  const handleError = (message: string, error?: unknown) => {
    console.error(message, error);
    setError(message);
    setModalMessage(message);
  };

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

  const openDeleteModal = (id: number) => {
    setSelectedInfluencerId(id);
    setModalMessage('You are trying to delete this account. Are you sure?');
  };

  const handleDeleteInfluencer = async () => {
    if (!selectedInfluencerId) return;
    try {
      await deleteInfluencer(selectedInfluencerId);
      setInfluencers((prev) =>
        prev.filter((influencer) => influencer.id !== selectedInfluencerId),
      );
      closeModal();
    } catch (err) {
      handleError('Failed to delete influencer', err);
    } finally {
      setSelectedInfluencerId(null);
    }
  };

  const handleAssignEmployee = async (
    influencerId: number,
    employeeId: number,
  ) => {
    try {
      await assignEmployeeToInfluencer(influencerId, employeeId);
      const manager = employees.find((e) => e.id === employeeId);
      updateInfluencerManager(influencerId, manager || null);
    } catch (err) {
      handleError('Failed to assign employee', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [influencersData, employeesData]: [Influencer[], Employee[]] =
          await Promise.all([getInfluencers(), getEmployees()]);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setInfluencers(influencersData);
        setEmployees(employeesData);
      } catch (err) {
        handleError('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const closeModal = () => {
    setModalMessage(null);
    setSelectedInfluencerId(null);
  };

  return (
    <div className={`main-container ${loading ? 'loading' : ''}`}>
      {loading ? (
        <Loader />
      ) : (
        <>
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
                    <AssignEmployee
                      employees={employees}
                      influencerId={influencer.id}
                      currentManager={influencer.manager}
                      onAssign={handleAssignEmployee}
                    />
                    <Button
                      className="remove-btn"
                      onClick={() => openDeleteModal(influencer.id)}
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

          <Modal
            title="Confirmation"
            message={modalMessage || ''}
            isVisible={!!modalMessage}
            onClose={closeModal}
            onConfirm={handleDeleteInfluencer}
            confirmButtonLabel="Delete"
            confirmButtonStyle="remove-btn"
          />
        </>
      )}
    </div>
  );
};

export default InfluencerList;
