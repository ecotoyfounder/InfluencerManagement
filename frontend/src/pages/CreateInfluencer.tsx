import React from 'react';
import { createInfluencer } from '../services/influencerService';
import Form from '../components/Form';

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

    try {
      await createInfluencer(payload);
      alert('Influencer created successfully!');
    } catch (error) {
      console.error('Error creating influencer:', error);
      alert('Error creating influencer');
    }
  };

  return <Form label="Create Influencer" onSubmit={handleSubmit} />;
};

export default CreateInfluencer;
