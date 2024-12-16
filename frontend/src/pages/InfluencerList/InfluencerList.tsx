import React, { useEffect, useState } from 'react';
import {
  deleteInfluencer,
  getInfluencers,
} from '../../services/InfluencerService/influencerService';
import {
  getEmployees,
  assignEmployeeToInfluencer,
  unassignEmployeeToInfluencer,
} from '../../services/EmployeeService/employeeService';
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

  const handleUnassignEmployee = async (influencerId: number) => {
    try {
      await unassignEmployeeToInfluencer(influencerId);
      updateInfluencerManager(influencerId, null);
    } catch (err) {
      console.error('Failed to unassign manager', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [influencersData, employeesData]: [Influencer[], Employee[]] =
          await Promise.all([getInfluencers(), getEmployees()]);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setInfluencers(influencersData || []);
        setEmployees(employeesData || []);
      } catch (err) {
        console.error('Fetch error:', err);
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
    <div className={`${loading ? 'main-container loading' : 'container'}`}>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="page-header">
            <h1>Influencer List</h1>

            <Input
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search ..."
            />
          </div>
          <div className="inner-container">
            {filteredInfluencers && filteredInfluencers.length > 0 ? (
              filteredInfluencers.map((influencer) => (
                <div key={influencer.id} className="influencer-container">
                  <div className="item-container">
                    <InfluencerCard influencer={influencer} />
                    <div className="actions">
                      <AssignEmployee
                        employees={employees}
                        influencerId={influencer.id}
                        currentManager={influencer.manager}
                        onAssign={handleAssignEmployee}
                        onUnassign={handleUnassignEmployee}
                      />
                      <Button
                        className="svg-btn"
                        onClick={() => openDeleteModal(influencer.id)}
                      >
                        <svg
                          width="31"
                          height="31"
                          viewBox="0 0 31 31"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="bin-icon"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M13.8299 5.96748C13.4548 5.96748 13.1229 6.20705 12.9986 6.5618L12.3198 8.50028H8.78566C8.29574 8.50028 7.90378 8.90269 7.90378 9.39264C7.90378 9.88259 8.29574 10.285 8.78566 10.285H9.56675V21.6302C9.56675 23.2325 11.0249 24.3689 12.4224 24.3689H19.6957C20.4059 24.3689 21.1773 24.089 21.774 23.6673C22.3522 23.2588 22.971 22.5624 22.971 21.6302V10.285H23.1785C23.6684 10.285 24.0603 9.8826 24.0603 9.39264C24.0603 8.90269 23.6684 8.50028 23.1785 8.50028H20.2178L19.539 6.5618C19.4148 6.20705 19.0829 5.96748 18.7078 5.96748H13.8299ZM14.1911 8.50023L14.453 7.75221H18.0847L18.3466 8.50023H14.1911ZM11.3305 21.6302V10.3371H21.2073V21.6302C21.2073 21.7193 21.1295 21.9459 20.7641 22.2041C20.4153 22.4506 19.9899 22.5842 19.6957 22.5842H12.4224C12.1278 22.5842 11.852 22.4604 11.6493 22.2729C11.4447 22.0836 11.3305 21.8453 11.3305 21.6302ZM14.2407 12.4295C13.7508 12.4295 13.3588 12.8319 13.3588 13.3219V19.7839C13.3588 20.2739 13.7508 20.6763 14.2407 20.6763C14.7306 20.6763 15.1226 20.2739 15.1226 19.7839V13.3219C15.1226 12.8319 14.7306 12.4295 14.2407 12.4295ZM18.7866 12.4295C18.2966 12.4295 17.9047 12.8319 17.9047 13.3219V19.7839C17.9047 20.2739 18.2966 20.6763 18.7866 20.6763C19.2765 20.6763 19.6684 20.2739 19.6684 19.7839V13.3219C19.6684 12.8319 19.2765 12.4295 18.7866 12.4295Z"
                            fill="var(--red-color)"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                  <hr />
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
