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
  manager_id?: number;
}

export interface InfluencerPayload {
  first_name: string;
  last_name: string;
  social_media_accounts: SocialMediaAccount[];
}
