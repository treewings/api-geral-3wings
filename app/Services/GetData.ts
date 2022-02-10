import axios from 'axios'
import builder from 'xmlbuilder'
import Moment from 'moment'
import Log from 'debug'

// Interfaces
import { IGetData, IDataGetAttendance, IDataGetTables } from 'App/Interfaces/IServices'

// Controlllers
import ProcessDataController from 'App/Controllers/Http/api/ProcessDataController'
import CompaniesController from 'App/Controllers/Http/Tables/CompaniesController'
import AttendancesController from 'App/Controllers/Http/Tables/AttendancesController'
import ExternalApis from 'App/Controllers/Http/Tables/ExternalApisController'

// helpers
import Helpers from 'App/Helpers/Index'

export default class GetData {

  public async xmlService(data: IGetData) {

    const log = Log('getData:xmlService')

    if (!data.company_id){
      return {
        status: 404,
        Body: {error: `The parameter 'company_id' not found`}
      };
    }

    const dataCompany = await new CompaniesController().show(data.company_id)

    if (!dataCompany){
      return {
        status: 404,
        Body: {error: `Company not found in database`}
      };
    }

    if (data.consult === `attendance` || data.consult === `tables`){

      const dataConfigApi = await new ExternalApis().show(dataCompany.id, data.consult);

      if (!dataConfigApi){
        return {
          status: 404,
          Body: { error: `not found apis for company_id: ${dataCompany.id}` }
        };
      }

      let returnDataXml: IDataGetTables | IDataGetAttendance;

      let body = dataConfigApi.body
      // trocando o parametro default `0` pelo data.nr_attendance
      body = JSON.parse(body.replace(`0`, `${data.i_code}`))
      let headers = JSON.parse(dataConfigApi.headers)

      //#region get data from api

      const xml = builder.create(body).end({ pretty: true })

      const retAxios = await axios.post(dataConfigApi.url, xml, {
        headers: headers
      })
      .then( async (res) => {
        if (res.status === 200) {

          const ret: any = await new Helpers().parseStringXml(res.data)

          returnDataXml = ret.Envelope.Body;

          const keyString: any = dataConfigApi.data_field;
          //const keyString: any = 'AtendimentoResponse.AtendimentoResult';

          returnDataXml =
            !keyString
            ? returnDataXml
            : new Helpers().getObjectsValueByStringKey(returnDataXml, keyString)


          if (data.consult === `attendance`){
            await new ProcessDataController().attendance(
              returnDataXml,
              dataCompany,
              data.i_code
            );

          }else if (data.consult === `tables`){
            //log(`Return Data (tables): ${JSON.stringify(returnData)}`)
            await new ProcessDataController().tables(
              returnDataXml,
              dataCompany,
            );
          }

        if (data.consult === `attendance`){

          let formatedRet = await new Helpers().formatObject(returnDataXml, `attendance`)

          log('Yep! Get data attendance of external API')
          return {
            status: 200,
            Body: formatedRet
          };

        }else if (data.consult === 'tables'){

          let formatedRet = await new Helpers().formatObject(returnDataXml, `tables`)

          log('Yep! Get data tables of external API')
          return {
            status: 200,
            Body: formatedRet
          };
        }


      }

      }).catch(async (err)=>{
        log(`Message error of external API: ${err.message}`);

        // procurando dados na base local
        try {
          const attendanceLocal = await new AttendancesController().showFromCompany({
            company_id: data.company_id,
            i_code: data.i_code.toString(),
          });

          if (!attendanceLocal){
            log(`Record not found from the internal database`)
            return {
              status: 404,
              Body: {error: `Record not found from the internal database`}
            };
          }

          const {
            type: tp_atendimento,
            start_date: dt_atendimento,
            end_date: dt_alta,
            client: {
              i_code: cd_paciente,
              name: nm_paciente,
              birth_date: dt_nascimento,
              is_vip: sn_vip,
              phone_number: telefone
            },
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
          } = attendanceLocal

          let startDateFormated: string =
            Moment(dt_atendimento).format(`YYYY-MM-DD`);

          let startHourFormated: string =
            Moment(dt_atendimento).format(`HH:mm:ss`);

          let endDateFormated = dt_alta != null ?
            Moment(dt_alta).format(`YYYY-MM-DD`) : null;

          let endHourFormated = dt_alta != null ?
            Moment(dt_alta).format(`HH:mm:ss`) : null;

          let birthDateFormated =
            Moment(dt_nascimento).format(`YYYY-MM-DD HH:mm:ss`);

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
                  dt_alta: endDateFormated,
                  hr_alta: endHourFormated,
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

          log('Yep! Get data of internal database')
          return {
            status: 200,
            Body: objAttendance
          };

        } catch (error) {
          log(`Error message when trying to get information from the internal database: ${error.message}`)
          return {
            status: 500,
            Body: {error: `Trying to get information from the internal database`}
          };
        }
      });

      return {
        status: retAxios?.status,
        Body: retAxios?.Body
      };

    //#endregion get data from api

    }else{
      log(`The parameter 'TABLE' is not valid`)

      return {
        status: 500,
        Body: {info: `The parameter 'TABLE' is not valid`}
      }
    }

  }

  public async jsonService(data: IGetData) {

    const log = Log('getData:jsonService')

    if (!data.company_id){
      return {
        status: 404,
        Body: {error: `The parameter 'company_id' not found`}
      };
    }

    const dataCompany = await new CompaniesController().show(data.company_id)

    if (!dataCompany){
      return {
        status: 404,
        Body: {error: `Company not found in database`}
      };
    }

    if (data.consult === `attendance` || data.consult === `tables`){

      const dataConfigApi = await new ExternalApis().show(dataCompany.id, data.consult);

      if (!dataConfigApi){
        return {
          status: 404,
          Body: { error: `not found apis for company_id: ${dataCompany.id}` }
        };
      }

      let returnData: IDataGetAttendance;

      let body = dataConfigApi.body
      // trocando o parametro default `0` pelo data.nr_attendance
      body = !body ? null : JSON.parse(body.replace(`0`, `${data.i_code}`))
      let headers = dataConfigApi.headers ? JSON.parse(dataConfigApi.headers) : null

      //#region get data from api
      const retAxios = await axios.post(dataConfigApi.url, body, {
        headers: headers
      })
      .then( async (res) => {
        if (res.status === 200) {

          //const keyString: any = 'message';
          const keyString: any = dataConfigApi.data_field;

          returnData =
            !keyString
            ? returnData
            : new Helpers().getObjectsValueByStringKey(res.data, keyString)

          if (data.consult === `attendance`){
            await new ProcessDataController().attendance(
              returnData,
              dataCompany,
              data.i_code
            );

          }else if (data.consult === `tables`){
            //log(`Return Data (tables): ${JSON.stringify(returnData)}`)
            await new ProcessDataController().tables(
              returnData,
              dataCompany,
            );
          }

          //log(`Return Data (tables, JSON): ${JSON.stringify(returnData)}`)

          //let ret: any = res.data

          if (data.consult === `attendance`){

            let formatedRet = await new Helpers().formatObject(returnData, `attendance`)

            log('Yep! Get data attendance of external API')
            return {
              status: 200,
              Body: formatedRet
            };

          }else if (data.consult === 'tables'){

            let formatedRet = await new Helpers().formatObject(returnData, `tables`)

            log('Yep! Get data tables of external API')
            return {
              status: 200,
              Body: formatedRet
            };
          }


      }

      }).catch(async (err)=>{
        log(`Message error of external API: ${err.message}`);

        // procurando dados na base local
        try {
          const attendanceLocal = await new AttendancesController().showFromCompany({
            company_id: data.company_id,
            i_code: data.i_code.toString(),
          });

          if (!attendanceLocal){
            log(`Record not found from the internal database`)
            return {
              status: 404,
              Body: {error: `Record not found from the internal database`}
            };
          }

          const {
            type: tp_atendimento,
            start_date: dt_atendimento,
            end_date: dt_alta,
            client: {
              i_code: cd_paciente,
              name: nm_paciente,
              birth_date: dt_nascimento,
              is_vip: sn_vip,
              phone_number: telefone
            },
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
          } = attendanceLocal

          let startDateFormated: string =
            Moment(dt_atendimento).format(`YYYY-MM-DD`);

          let startHourFormated: string =
            Moment(dt_atendimento).format(`HH:mm:ss`);

          let endDateFormated = dt_alta != null ?
            Moment(dt_alta).format(`YYYY-MM-DD`) : null;

          let endHourFormated = dt_alta != null ?
            Moment(dt_alta).format(`HH:mm:ss`) : null;

          let birthDateFormated =
            Moment(dt_nascimento).format(`YYYY-MM-DD HH:mm:ss`);

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
                  dt_alta: endDateFormated,
                  hr_alta: endHourFormated,
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

          log('Yep! Get data of internal database')
          return {
            status: 200,
            Body: objAttendance
          };

        } catch (error) {
          log(`Error message when trying to get information from the internal database: ${error.message}`)
          return {
            status: 500,
            Body: {error: `Trying to get information from the internal database`}
          };
        }
      });

      return {
        status: retAxios?.status,
        Body: retAxios?.Body
      };

    //#endregion get data from api

    }else{
      log(`The parameter 'CONSULT' is not valid`)

      return {
        status: 500,
        Body: {info: `The parameter 'CONSULT' is not valid`}
      }
    }

  }

}
