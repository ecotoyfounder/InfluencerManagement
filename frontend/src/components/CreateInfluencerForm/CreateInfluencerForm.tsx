import React, { useState } from 'react';
import { SocialMediaAccount } from '../../interfaces/Influencer';
import { SocialMediaPlatform } from '../../interfaces/SocialMedia';
import Selector from '../Selector/Selector';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import './CreateInfluencerForm.css';

interface InfluencerFormProps {
  label: string;
  onSubmit: (influencerData: {
    firstName: string;
    lastName: string;
    socialMediaAccounts: SocialMediaAccount[];
  }) => Promise<void>;
}

const CreateInfluencerForm: React.FC<InfluencerFormProps> = ({
  label,
  onSubmit,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [socialMediaAccounts, setSocialMediaAccounts] = useState<
    SocialMediaAccount[]
  >([{ platform: 'Instagram', username: '' }]);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const addSocialMediaAccount = () => {
    const existingPlatforms = socialMediaAccounts.map(
      (account) => account.platform,
    );

    const duplicatePlatform = existingPlatforms.find(
      (platform, index, arr) => arr.indexOf(platform) !== index,
    );

    if (duplicatePlatform) {
      setModalMessage(`A profile for ${duplicatePlatform} already exists!`);
      setIsError(true);
      return;
    }

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

  const hasDuplicateAccounts = (): boolean => {
    const accounts = socialMediaAccounts.map((account) =>
      `${account.platform}-${account.username}`.toLowerCase(),
    );
    const uniqueAccounts = new Set(accounts);
    return uniqueAccounts.size !== accounts.length;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!firstName || !lastName) {
      setModalMessage('First Name and Last Name are required!');
      return;
    }
    if (hasDuplicateAccounts()) {
      setModalMessage('Duplicate social media accounts are not allowed!');
      return;
    }

    try {
      await onSubmit({ firstName, lastName, socialMediaAccounts });
      setModalMessage('Influencer created successfully!');
      setIsError(false);
    } catch (err) {
      setModalMessage(
        (err as { message?: string }).message ||
          'An error occurred while creating the influencer.',
      );
      setIsError(true);
    }
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setSocialMediaAccounts([{ platform: 'Instagram', username: '' }]);
  };

  const closeModal = () => {
    setModalMessage(null);
    !isError && resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="form-content">
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
        <div className="platform-container">
          <h3>Social Media Accounts</h3>
          {socialMediaAccounts.map((account, index) => (
            <div key={index} className="platform-item">
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
          <Button
            onClick={addSocialMediaAccount}
            type="button"
            disabled={socialMediaAccounts.length >= 2}
          >
            Add Social Media Account
          </Button>
        </div>
        <Button type="submit" className="primary-btn">
          Save
        </Button>
        <Modal
          title={isError ? 'Error' : 'Success'}
          message={modalMessage || ''}
          isVisible={!!modalMessage}
          onClose={closeModal}
        />
      </div>
    </form>
  );
};

export default CreateInfluencerForm;
