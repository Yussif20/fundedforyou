export type Announcement_T = {
  id: string;

  title: string;
  description: string;
  thumbnailUrl: string;
  redirectUrl: string;
  date: string;
  firmId: string;
  firm: string;

  mobileFontSize?: number | null;

  createdAt: string;
  updatedAt: string;
};
