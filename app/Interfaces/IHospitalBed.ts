export interface IHospitalBedStore{
  i_code: string;
  description: string;
  is_active?: boolean;
  inpatient_unit_id: number;
  cd_type_accomodation: string;
  ds_type_accomodation: string;
  abstract_description: string;
  type_ocuppation: string;
}

export interface IHospitalBedEdit{
  i_code: string;
  description: string;
  is_active?: boolean;
  inpatient_unit_id: number;
  cd_type_accomodation: string;
  ds_type_accomodation: string;
  abstract_description: string;
  type_ocuppation: string;
}

export interface IHospitalBedShow{
  i_code: string;
  inpatient_unit_id: number;
}





