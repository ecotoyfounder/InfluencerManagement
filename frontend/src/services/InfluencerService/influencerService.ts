import { Influencer, InfluencerPayload } from '../../interfaces/Influencer';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const getInfluencers = async (): Promise<Influencer[]> => {
  const response = await fetch(`${API_URL}/influencers`);
  return response.json();
};

export const createInfluencer = async (
  influencer: InfluencerPayload,
): Promise<Influencer> => {
  const response = await fetch(`${API_URL}/influencers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(influencer),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to create influencer');
  }

  return response.json();
};

export const deleteInfluencer = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/influencers/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete influencer');
  }
};
