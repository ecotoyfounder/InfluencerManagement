import React, { useEffect, useState } from 'react';
import { getInfluencers } from '../services/influencerService';
import { Influencer } from '../interfaces/Influencer';
import InfluencerCard from '../components/InfluencerCard';

const InfluencerList: React.FC = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch influencers on component mount
  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        const data = await getInfluencers();
        setInfluencers(data);
      } catch (err) {
        setError('Failed to fetch influencers');
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers().then((r) => {});
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Influencer List</h1>
      {influencers && influencers.length > 0 ? (
        influencers.map((influencer) => (
          <InfluencerCard key={influencer.id} influencer={influencer} />
        ))
      ) : (
        <p>No influencers found.</p>
      )}
    </div>
  );
};

export default InfluencerList;
