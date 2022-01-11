export interface IHealthInsuranceStore{
  i_code: string;
  description: string;
  is_active?: boolean;
  company_id: number;
}

export interface IHealthInsuranceEdit{
  i_code: string;
  description: string;
  is_active?: boolean;
  company_id: number;
}

export interface IHealthInsuranceShow{
  i_code: string;
  company_id: number;
}


