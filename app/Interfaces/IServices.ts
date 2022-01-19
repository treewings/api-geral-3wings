export interface IGetData{
  endpoint: string;
  company_id: number;
  nr_attendance: number;
}

export interface IDataGetAttendance{
  paciente: {
    cd_paciente: number;
    nm_paciente: string;
    idade: string;
    dt_nascimento: string;
    sn_vip: string;
    telefone: string;
  },
  atendimento: {
    tp_atendimento: string;
    dt_atendimento: string;
    hr_atendimento: string;
    origem: {
      cd_ori_ate: number;
      ds_ori_ate: string;
      tp_origem: string;
    },
    setor: {
      cd_setor: number;
      ds_setor: string;
    },
    unidade_internacao: {
      cd_unid_int: number;
      ds_unid_int: string;
    },
    convenio: {
      cd_convenio: number;
      nm_convenio: string;
    },
    leito: {
      cd_leito: number;
      ds_leito: string;
      cd_tip_acomodacao: number;
      ds_tip_acomodacao: string;
      tp_acomodacao: string;
      ds_resumo_leito: string;
      tp_ocupacao: string;
    }
  }
}

