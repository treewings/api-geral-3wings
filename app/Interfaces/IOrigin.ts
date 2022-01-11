export interface IOriginStore{
  i_code: string;
  description: string;
  is_active?: boolean;
  company_id: number;
  type: string;
}

export interface IOriginEdit{
  i_code: string;
  description: string;
  is_active?: boolean;
  company_id: number;
  type: string;
}

export interface IOriginShow{
  i_code: string;
  company_id: number;
}




