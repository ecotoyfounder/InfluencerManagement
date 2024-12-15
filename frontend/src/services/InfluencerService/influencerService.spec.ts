import {
  getInfluencers,
  createInfluencer,
  deleteInfluencer,
} from './influencerService';

global.fetch = jest.fn();

describe('Influencer Service', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Очистка моков после каждого теста
  });

  test('getInfluencers', async () => {
    const mockData = [{ id: 1, first_name: 'John', last_name: 'Doe' }];
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockData),
    });

    const influencers = await getInfluencers();

    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/influencers');
    expect(influencers).toEqual(mockData);
  });

  test('createInfluencer', async () => {
    const newInfluencer = {
      first_name: 'Jane',
      last_name: 'Smith',
      social_media_accounts: [],
    };
    const mockResponse = { id: 2, ...newInfluencer };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    const result = await createInfluencer(newInfluencer);

    expect(fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/influencers',
      expect.any(Object),
    );
    expect(result).toEqual(mockResponse);
  });

  test('deleteInfluencer', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    await deleteInfluencer(1);

    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/influencers/1', {
      method: 'DELETE',
    });
  });

  test('createInfluencer', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ detail: 'Failed to create' }),
    });

    const newInfluencer = {
      first_name: 'Error',
      last_name: 'Test',
      social_media_accounts: [],
    };

    await expect(createInfluencer(newInfluencer)).rejects.toThrow(
      'Failed to create',
    );
  });
});
