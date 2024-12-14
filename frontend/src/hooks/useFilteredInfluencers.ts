import { useEffect, useState } from 'react';
import { Influencer } from '../interfaces/Influencer';

const useFilteredInfluencers = (
  influencers: Influencer[],
  searchTerm: string,
): Influencer[] => {
  const [filteredInfluencers, setFilteredInfluencers] = useState<Influencer[]>(
    [],
  );

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

  return filteredInfluencers;
};

export default useFilteredInfluencers;
