export interface IArtExpert {
  ID_artcenter: number;
  Title: string;
  Description: string;
  Status: boolean;
  Image: string | null;
  Name: string;
  Algorithm: string;
}

export interface DraftTaskInfo {
  OrderID: number;
  ExpertsCount: number;
}

export interface Breadcrumb {
    label: string;
    path?: string;
    active?: boolean;
}