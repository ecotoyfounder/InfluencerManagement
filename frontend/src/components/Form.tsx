import React, { useState } from 'react';
import { SocialMediaAccount } from '../interfaces/Influencer';
import { SocialMediaPlatform } from '../interfaces/SocialMedia';
import Selector from './Selector';
import TextInput from './Input';
import Button from './Button';

interface InfluencerFormProps {
  label: string;
  onSubmit: (influencerData: {
    firstName: string;
    lastName: string;
    socialMediaAccounts: SocialMediaAccount[];
  }) => void;
}

const InfluencerForm: React.FC<InfluencerFormProps> = ({ label, onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [socialMediaAccounts, setSocialMediaAccounts] = useState<
    SocialMediaAccount[]
  >([{ platform: 'Instagram', username: '' }]);

  const addSocialMediaAccount = () => {
    setSocialMediaAccounts([
      ...socialMediaAccounts,
      { platform: 'Instagram', username: '' },
    ]);
  };

  const handlePlatformChange = (
    index: number,
    platform: SocialMediaPlatform,
  ) => {
    const updatedAccounts = [...socialMediaAccounts];
    updatedAccounts[index].platform = platform;
    setSocialMediaAccounts(updatedAccounts);
  };

  const handleUsernameChange = (index: number, username: string) => {
    const updatedAccounts = [...socialMediaAccounts];
    updatedAccounts[index].username = username;
    setSocialMediaAccounts(updatedAccounts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName) {
      alert('First Name and Last Name are required!');
      return;
    }
    onSubmit({ firstName, lastName, socialMediaAccounts });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{label}</h1>
      <TextInput
        label="First Name:"
        value={firstName}
        onChange={setFirstName}
        maxLength={50}
        required
      />
      <TextInput
        label="Last Name:"
        value={lastName}
        onChange={setLastName}
        maxLength={50}
        required
      />
      <div>
        <h3>Social Media Accounts</h3>
        {socialMediaAccounts.map((account, index) => (
          <div key={index}>
            <Selector<SocialMediaPlatform>
              value={account.platform}
              options={['Instagram', 'TikTok']}
              onChange={(platform) => handlePlatformChange(index, platform)}
            />
            <TextInput
              placeholder="Username"
              value={account.username}
              onChange={(username) => handleUsernameChange(index, username)}
              required
            />
          </div>
        ))}
        <Button onClick={addSocialMediaAccount} type="button">
          Add Social Media Account
        </Button>
      </div>
      <Button type="submit" className="primary-btn">
        Save
      </Button>
    </form>
  );
};

export default InfluencerForm;
