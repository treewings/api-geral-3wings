export interface IAttendanceStore{
  client_id: number;
  i_code: string;
  type: string;
  start_date: string;
  end_date: string;
  origin_id: number;
  sector_id: number;
}

export interface IAttendanceUpdate{
  i_code: string;
  client_id: number;
  type: string;
  start_date: string;
  end_date: string;
  origin_id: number;
  sector_id: number;
}

export interface IAttendanceShow{
  i_code: string;
  client_id: number;
}


