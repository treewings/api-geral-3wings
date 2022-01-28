import axios from 'axios'
import builder from 'xmlbuilder'
import xmlParser from 'xml2js'
import Moment from 'moment'

// Interfaces
import { IGetData, IDataGetAttendance } from 'App/Interfaces/IServices'

// Controlllers
import ProcessDataController from 'App/Controllers/Http/api/ProcessDataController'
import CompaniesController from 'App/Controllers/Http/CompaniesController'
import AttendancesController from 'App/Controllers/Http/AttendancesController'

export default class GetData {

  public async xmlService(data: IGetData) {

    if (!data.company_id){
      return {
        message: 'Company not found'
      }
    }

    const dataCompany = await new CompaniesController().show(data.company_id)

    if (!dataCompany){
      return {
        message: 'Company not found in database'
      }
    }

    let dataAttendance: IDataGetAttendance;

    let body = {
      "soapenv:Envelope": {
      "@xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
      "soapenv:Header": "",
      "soapenv:Body": {
        "Atendimento": {
          "Atendimento": {
            "CdAtendimento": data.nr_attendance
          }
        }
      }
     }
    }

    const xml = builder.create(body).end({ pretty: true })

    const retAxios = await axios.post(data.endpoint, xml, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': "/ACSC.Negocios.Atendimento.Wings.WS.Service.Atendimento"
      }
    })
    .then( async (res) => {
      if (res.status === 200) {

        const options = {
          tagNameProcessors: [xmlParser.processors.stripPrefix],
          explicitArray: false,
        };


        async function parse(res) {
          const promise = await new Promise((resolve, reject) => {
            const parser = new xmlParser.Parser(options);

            parser.parseString(res.data, async (error, result) => {
              if (error) reject(error);
              else resolve(result);

              dataAttendance =
                result.Envelope.Body.AtendimentoResponse.AtendimentoResult;

                await new ProcessDataController().attendance(
                  dataAttendance,
                  dataCompany,
                  data.nr_attendance
                );

            });

          });
          return promise;
        }

        let ret: any = await parse(res)

        const {
          paciente: {
            cd_paciente,
            nm_paciente,
            dt_nascimento,
            sn_vip,
            telefone
          },
          atendimento: {
            tp_atendimento,
            dt_atendimento,
            hr_atendimento,
            dt_alta,
            hr_alta,
            origem: {
              cd_ori_ate,
              ds_ori_ate,
              tp_origem
            },
            setor: {
              cd_setor,
              ds_setor
            },
            unidade_internacao: {
              cd_unid_int,
              ds_unid_int
            },
            convenio: {
              cd_convenio,
              nm_convenio
            },
            leito: {
              cd_leito,
              ds_leito,
              ds_resumo_leito,
              tp_ocupacao
            }
          }
        } = ret.Envelope.Body.AtendimentoResponse.AtendimentoResult

        let startDateFormated: string =
          Moment(dt_atendimento).format(`YYYY-MM-DD`);

        let startHourFormated: string =
          Moment(hr_atendimento).format(`HH:mm:ss`);

        let endDateFormated: string =
        Moment(dt_alta).format(`YYYY-MM-DD`);

        let endHourFormated: string =
          Moment(hr_alta).format(`HH:mm:ss`);

        let birthDateFormated = Moment(dt_nascimento).format(`YYYY-MM-DD HH:mm:ss`);

        let snVip = sn_vip == `S` ? true : false;

        let formatedRet = {
          dataOrigin: `External API`,
          paciente: {
            cd_paciente,
            nm_paciente,
            dt_nascimento: birthDateFormated,
            sn_vip: snVip,
            telefone
          },
          atendimento: {
            tp_atendimento,
            dt_atendimento: startDateFormated,
            hr_atendimento: startHourFormated,
            dt_alta: endDateFormated  == `Invalid date` ? null : endDateFormated,
            hr_alta: endHourFormated  == `Invalid date` ? null : endHourFormated,
            origem: {
              cd_ori_ate,
              ds_ori_ate,
              tp_origem
            },
            setor: {
              cd_setor,
              ds_setor
            },
            unidade_internacao: {
              cd_unid_int,
              ds_unid_int
            },
            convenio: {
              cd_convenio,
              nm_convenio
            },
            leito: {
              cd_leito,
              ds_leito,
              ds_resumo_leito,
              tp_ocupacao
            }
          }
        };

        return formatedRet;
    }



  }).catch(async (err)=>{
    //console.error(`error: ${err}, retornando dados da ultima atualizacao`)

    // procurando dados na base local
    try {


    const attendanceLocal = await new AttendancesController().showFromCompany({
      company_id: data.company_id,
      i_code: data.nr_attendance.toString(),
    });

    if (!attendanceLocal){
      return `External API not responding or record not found anywhere`;
    }

    const {
      client: {
        i_code: cd_paciente,
        name: nm_paciente,
        birth_date: dt_nascimento,
        is_vip: sn_vip,
        phone_number: telefone
      },

        type: tp_atendimento,
        start_date: dt_atendimento,
        end_date: dt_alta,
        origin: {
          i_code: cd_ori_ate,
          description: ds_ori_ate,
          type: tp_origem
        },
        sector: {
          i_code: cd_setor,
          description: ds_setor
        },
        inpatient_unit: {
          i_code: cd_unid_int,
          description: ds_unid_int
        },
        health_insurance: {
          i_code: cd_convenio,
          description: nm_convenio
        },
        hospital_bed: {
          i_code: cd_leito,
          description: ds_leito,
          abstract_description: ds_resumo_leito,
          type_ocuppation: tp_ocupacao
        }
     } =
    attendanceLocal

    let startDateFormated: string =
      Moment(dt_atendimento).format(`YYYY-MM-DD`);

    let startHourFormated: string =
      Moment(dt_atendimento).format(`HH:mm:ss`);

    let endDateFormated: string =
    Moment(dt_alta).format(`YYYY-MM-DD`);

    let endHourFormated: string =
      Moment(dt_alta).format(`HH:mm:ss`);

    let birthDateFormated = Moment(dt_nascimento).format(`YYYY-MM-DD HH:mm:ss`);

    let snVip = sn_vip == false ? false : true;

    let objAttendance = {
      dataOrigin: `Local database`,
          paciente: {
            cd_paciente,
            nm_paciente,
            dt_nascimento: birthDateFormated,
            sn_vip: snVip,
            telefone
          },
          atendimento: {
            tp_atendimento,
            dt_atendimento: startDateFormated,
            hr_atendimento: startHourFormated,
            dt_alta: endDateFormated == `Invalid date` ? null : endDateFormated,
            hr_alta: endHourFormated == `Invalid date` ? null : endHourFormated,
            origem: {
              cd_ori_ate,
              ds_ori_ate,
              tp_origem
            },
            setor: {
              cd_setor,
              ds_setor
            },
            unidade_internacao: {
              cd_unid_int,
              ds_unid_int
            },
            convenio: {
              cd_convenio,
              nm_convenio
            },
            leito: {
              cd_leito,
              ds_leito,
              ds_resumo_leito,
              tp_ocupacao
            }
          }
    }

    return objAttendance;
  } catch (error) {
    console.error(error)
  }
  });

  return retAxios;

  }

  public async jsonService(data: IGetData) {
    return true;
  }
}
