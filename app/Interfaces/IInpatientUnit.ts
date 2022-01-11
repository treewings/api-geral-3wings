export interface IInpatientUnitStore{
  i_code: string;
  description: string;
  is_active?: boolean;
  sector_id: number;
}

export interface IInpatientUnitEdit{
  i_code: string;
  description: string;
  is_active?: boolean;
  sector_id: number;
}

export interface IInpatientUnitShow{
  i_code: string;
  sector_id: number;
}





