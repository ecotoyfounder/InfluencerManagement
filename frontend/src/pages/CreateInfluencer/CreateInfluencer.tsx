import React from 'react';
import { createInfluencer } from '../../services/influencerService';
import Form from '../../components/CreateInfluencerForm/CreateInfluencerForm';

const CreateInfluencer: React.FC = () => {
  const handleSubmit = async (data: {
    firstName: string;
    lastName: string;
    socialMediaAccounts: {
      platform: 'Instagram' | 'TikTok';
      username: string;
    }[];
  }) => {
    const payload = {
      first_name: data.firstName,
      last_name: data.lastName,
      social_media_accounts: data.socialMediaAccounts,
    };

    await createInfluencer(payload);
  };

  return <Form label="Create Influencer" onSubmit={handleSubmit} />;
};

export default CreateInfluencer;
