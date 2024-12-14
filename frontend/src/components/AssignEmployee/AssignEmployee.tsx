import React, { useState } from 'react';
import Selector from '../Selector/Selector';
import Button from '../Button/Button';
import { Employee } from '../../interfaces/Employee';
import './AssignEmployee.css';
import Modal from '../Modal/Modal';

interface AssignEmployeeProps {
  employees: Employee[];
  influencerId: number;
  currentManager?: Employee | null;
  onAssign: (influencerId: number, employeeId: number) => void;
}

const AssignEmployee: React.FC<AssignEmployeeProps> = ({
  employees,
  influencerId,
  currentManager,
  onAssign,
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(
    currentManager?.id || null,
  );
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [, setIsError] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>(
    undefined,
  );

  const handleAssign = async () => {
    if (selectedEmployee === null) {
      setModalMessage('Please select an employee');
      setIsError(true);
      setOnConfirm(undefined);
      setIsModalVisible(true);
      return;
    }

    setModalMessage('Are you sure you want to assign this employee?');
    setIsError(false);
    setOnConfirm(() => confirmAssign);
    setIsModalVisible(true);
  };

  const confirmAssign = async () => {
    if (selectedEmployee === null) return;

    try {
      await onAssign(influencerId, selectedEmployee);
      setModalMessage('Employee assigned successfully!');
      setIsError(false);
      setOnConfirm(undefined);
    } catch (err: unknown) {
      setModalMessage(
        (err as { message?: string }).message || 'Failed to assign employee',
      );
      setIsError(true);
    } finally {
      setIsModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalMessage(null);
    setIsModalVisible(false);
    setOnConfirm(undefined);
  };

  const getSelectedEmployeeName = () => {
    const employee = employees.find((e) => e.id === selectedEmployee);
    return employee ? `${employee.first_name} ${employee.last_name}` : '';
  };

  const handleEmployeeChange = (name: string) => {
    const selected = employees.find(
      (e) => `${e.first_name} ${e.last_name}` === name,
    );
    setSelectedEmployee(selected ? selected.id : null);
  };

  return (
    <div className="assign-employee">
      <Selector<string>
        value={getSelectedEmployeeName()}
        options={employees.map((e) => `${e.first_name} ${e.last_name}`)}
        onChange={handleEmployeeChange}
        placeholder="Select an employee ..."
      />
      <Button onClick={handleAssign}>Assign</Button>
      <Modal
        title="Confirmation"
        message={modalMessage || ''}
        isVisible={isModalVisible}
        onClose={closeModal}
        onConfirm={onConfirm}
        confirmButtonLabel="Confirm"
        confirmButtonStyle="success-btn"
      />
    </div>
  );
};

export default AssignEmployee;
