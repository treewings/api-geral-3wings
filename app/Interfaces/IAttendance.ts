export interface IAttendanceStore{
  client_id: number;
  i_code: string;
  type: string;
  start_date: string;
  end_date: string | null;
  origin_id: number;
  sector_id: number;
  inpatient_unit_id: number;
  health_insurance_id: number;
  hospital_bed_id: number;
  company_id: number;
}

export interface IAttendanceUpdate{
  i_code: string;
  client_id: number;
  type: string;
  start_date: string;
  end_date: string | null;
  origin_id: number;
  sector_id: number;
  inpatient_unit_id: number;
  health_insurance_id: number;
  hospital_bed_id: number;
  company_id: number;
}

export interface IAttendanceShow{
  i_code: string;
  client_id?: number;
  company_id?: number;
}


