import { DateTime } from "luxon";

export interface IClientStore{
  i_code: string;
  name: string;
  company_id: number;
  birth_date: DateTime;
  is_vip: boolean;
  phone_number: string;
}

export interface IClientShow{
  i_code: string;
  company_id: number;
}

