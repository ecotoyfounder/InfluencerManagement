import { Employee } from './Employee';

export interface SocialMediaAccount {
  platform: 'Instagram' | 'TikTok';
  username: string;
}

export interface Influencer {
  id: number;
  temp_id?: string;
  first_name: string;
  last_name: string;
  social_media_accounts: SocialMediaAccount[];
  manager?: Employee | null;
}

export interface InfluencerPayload {
  first_name: string;
  last_name: string;
  social_media_accounts: SocialMediaAccount[];
}
