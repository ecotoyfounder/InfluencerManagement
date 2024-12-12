export type SocialMediaPlatform = 'Instagram' | 'TikTok';

export interface SocialMediaAccount {
  id: number;
  platform: SocialMediaPlatform;
  username: string;
  influencer_id: number;
}
