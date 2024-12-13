import React, { useState } from 'react';
import { SocialMediaAccount } from '../../interfaces/Influencer';
import { SocialMediaPlatform } from '../../interfaces/SocialMedia';
import Selector from '../Selector/Selector';
import Input from '../Input/Input';
import Button from '../Button/Button';
import './Form.css';

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
    <form onSubmit={handleSubmit} className="form">
      <h1>{label}</h1>
      <Input
        label="First Name:"
        value={firstName}
        onChange={setFirstName}
        maxLength={50}
        required
      />
      <Input
        label="Last Name:"
        value={lastName}
        onChange={setLastName}
        maxLength={50}
        required
      />
      <div className="sn-container">
        <h3>Social Media Accounts</h3>
        {socialMediaAccounts.map((account, index) => (
          <div key={index} className="sn-item">
            <Selector<SocialMediaPlatform>
              value={account.platform}
              options={['Instagram', 'TikTok']}
              onChange={(platform) => handlePlatformChange(index, platform)}
              placeholder="Select a platform ..."
            />
            <Input
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
