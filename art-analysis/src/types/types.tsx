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
  ID_task: number;
  ExpertsCount: number;
}

export interface Breadcrumb {
    label: string;
    path?: string;
    active?: boolean;
}