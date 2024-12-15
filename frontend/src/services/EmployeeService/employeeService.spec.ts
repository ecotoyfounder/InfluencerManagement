import {
  getEmployees,
  assignEmployeeToInfluencer,
  unassignEmployeeToInfluencer,
} from './employeeService';

global.fetch = jest.fn();

describe('Employee Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getEmployees', async () => {
    const mockData = [{ id: 1, first_name: 'John', last_name: 'Doe' }];
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const employees = await getEmployees();

    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/employees');
    expect(employees).toEqual(mockData);
  });

  test('assignEmployeeToInfluencer', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    await assignEmployeeToInfluencer(1, 2);

    expect(fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/influencers/1/assign',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: 2 }),
      },
    );
  });

  test('unassignEmployeeToInfluencer', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    await unassignEmployeeToInfluencer(1);

    expect(fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/influencers/1/unassign',
      {
        method: 'POST',
      },
    );
  });
});
