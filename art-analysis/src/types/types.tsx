export interface IExpertMedia {
  id_media: number;
  id_artcenter: number;
  media_url: string;
  media_type: 'image' | 'video';
  created_at: string;
}

export interface IArtExpert {
  id_artcenter: number;
  title: string;
  description: string;
  status: boolean;
  name: string;
  algorithm: string;
  img_url: string;
  media?: IExpertMedia[];
}

export interface DraftTaskInfo {
  id_request: number;
  experts_count: number;
}

export interface Breadcrumb {
  label: string;
  path?: string;
  active?: boolean;
}

export interface FilterState {
  searchTerm: string;
}