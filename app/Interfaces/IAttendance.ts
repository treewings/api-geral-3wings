import { DateTime } from "luxon";

export interface IAttendanceStore{
  client_id: number;
  i_code: string;
  type: string;
  start_date: DateTime;
  end_date: DateTime;
  origin_id: number;
  sector_id: number;
}

export interface IAttendanceEdit{
  client_id: number;
  i_code: string;
  type: string;
  start_date: DateTime;
  end_date: DateTime;
  origin_id: number;
  sector_id: number;
}

export interface IAttendanceShow{
  i_code: string;
}


