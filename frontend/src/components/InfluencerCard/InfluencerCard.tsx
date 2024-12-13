import React from 'react';
import { Influencer } from '../../interfaces/Influencer';
import './InfluencerCard.css';

interface InfluencerProps {
  influencer: Influencer;
}

const InfluencerCard: React.FC<InfluencerProps> = ({ influencer }) => {
  return (
    <div className="card">
      <h2>{`${influencer.first_name} ${influencer.last_name}`}</h2>
      <p>
        <strong>Assigned Employee:</strong>{' '}
        {influencer.manager
          ? `${influencer.manager.first_name} ${influencer.manager.last_name}`
          : 'Not selected'}
      </p>
      <ul className="item">
        {influencer.social_media_accounts &&
        influencer.social_media_accounts.length > 0 ? (
          influencer.social_media_accounts.map((account, index) => (
            <li key={index}>
              {account.platform}: {account.username}
            </li>
          ))
        ) : (
          <li>No social media accounts found</li>
        )}
      </ul>
    </div>
  );
};

export default InfluencerCard;
