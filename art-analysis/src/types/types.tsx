export interface IArtExpert {
  id_artcenter: number;
  title: string;
  description: string;
  status: boolean;
  name: string;
  algorithm: string;
  img_url: string;
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