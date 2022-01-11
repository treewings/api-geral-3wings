export interface ISectorStore{
  i_code: string;
  description: string;
  is_active?: boolean;
  company_id: number;
}

export interface ISectorEdit{
  i_code: string;
  description: string;
  is_active?: boolean;
  company_id: number;
}

export interface ISectorShow{
  i_code: string;
  company_id: number;
}




