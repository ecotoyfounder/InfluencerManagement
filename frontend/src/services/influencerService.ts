import { Influencer, InfluencerPayload } from '../interfaces/Influencer';

const API_URL = 'http://127.0.0.1:8000';

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
  return response.json();
};
