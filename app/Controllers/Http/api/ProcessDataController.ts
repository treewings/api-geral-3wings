import Moment from 'moment'
import Log from 'debug'

import ClientsController from 'App/Controllers/Http/Tables/ClientsController'
import AttendancesController from 'App/Controllers/Http/Tables/AttendancesController'
import OriginsController from 'App/Controllers/Http/Tables/OriginsController'
import SectorsController from 'App/Controllers/Http/Tables/SectorsController'
import InpatientUnitsController from 'App/Controllers/Http/Tables/InpatientUnitsController'
import HospitalBedsController from 'App/Controllers/Http/Tables/HospitalBedsController'
import HealthInsurancesController from 'App/Controllers/Http/Tables/HealthInsurancesController'

export default class ProcessDataController {
  public async attendance(data, dataCompany, nr_attendance) {
    const log = Log('processData:attendance')
    try {

      log(`Init`)

      const {
        paciente: {
          cd_paciente: i_code_client,
          nm_paciente: name,
          dt_nascimento: birth_date,
          sn_vip: is_vip,
          telefone: phone_number,
        },
        atendimento: {
          tp_atendimento: type_attendance,
          dt_atendimento: start_date,
          hr_atendimento: start_hour,
          dt_alta: end_date,
          hr_alta: end_hour,
          origem: {
            cd_ori_ate: i_code_origin,
            ds_ori_ate: ds_origin,
            tp_origem: type_origin,
          },
          convenio: {
            cd_convenio: i_code_health_insurance,
            nm_convenio: ds_health_insurance
          },
          setor: {
            cd_setor: i_code_sector,
            ds_setor: ds_sector,
          },
          unidade_internacao: {
            cd_unid_int: i_code_inpatient_unit,
            ds_unid_int: ds_inpatient_unit
          },
          leito: {
            cd_leito: i_code_hospital_bed,
            ds_leito: ds_hospital_bed,
            cd_tip_acomodacao: cd_type_accomodation,
            ds_tip_acomodacao: ds_type_accomodation,
            ds_resumo_leito: abstract_description,
            tp_ocupacao: type_ocuppation,
          }
        } } = data

      let i_code_attendance = nr_attendance;

      let objAttendance = {
        company_id: dataCompany.id,
        client_id: 0,
        origin_id: 0,
        sector_id: 0,
        inpatientUnit_id: 0,
        heathInsurance_id: 0,
        hospitalBed_id: 0,
        operations: {
          attendance: 'create',
          origin: 'nothing, already exists',
          healthInsurance: 'nothing, already exists',
          sector: 'nothing, already exists',
          inpatientUnit: 'nothing, already exists',
          hospitalBed: 'nothing, already exists',
        }
      }

      let returnClient;


      const dataClient = await new ClientsController().show({
        i_code: i_code_client, company_id: dataCompany.id
      })

      if (!dataClient) {

        let snVip = is_vip == `S` ? true : false;
        log(`client not exists, creating`)
        returnClient =
          await new ClientsController().store({
            birth_date,
            i_code: i_code_client,
            is_vip: snVip,
            name,
            phone_number,
            company_id: dataCompany.id
          })
      } else {
        log(`client exist, continue`)
        returnClient = dataClient;
      }

      //#endregion client

      //#region store attendance
      if (returnClient) {
        objAttendance.client_id = returnClient.id

        // #region origin
        const dataOrigin =
          await new OriginsController().show({
            i_code: i_code_origin,
            company_id: dataCompany.id
          })

        if (!dataOrigin) {
          const createDataOrigin =
            await new OriginsController().store({
              i_code: i_code_origin,
              company_id: dataCompany.id,
              description: ds_origin,
              type: type_origin
            })

          if (!createDataOrigin) {
            return {
              status: 500,
              message: 'Error in creating Origin'
            }
          }

          objAttendance.origin_id = createDataOrigin.id
          objAttendance.operations.origin = 'create'

        } else {
          objAttendance.origin_id = dataOrigin.id
        }
        // #endregion origin

        // #region health insurance
        const dataHealthInsurance =
          await new HealthInsurancesController().show({
            i_code: i_code_health_insurance,
            company_id: dataCompany.id
          })

        if (!dataHealthInsurance) {
          const createDataHealthInsurance =
            await new HealthInsurancesController().store({
              i_code: i_code_health_insurance,
              company_id: dataCompany.id,
              description: ds_health_insurance,
            })

          if (!createDataHealthInsurance) {
            return {
              status: 500,
              message: 'Error in creating Health Insurance'
            }
          }

          objAttendance.heathInsurance_id = createDataHealthInsurance.id
          objAttendance.operations.healthInsurance = 'create'

        } else {
          objAttendance.heathInsurance_id = dataHealthInsurance.id
        }

        // #endregion health insurance

        // #region sector
        const dataSector =
          await new SectorsController().show({
            i_code: i_code_sector,
            company_id: dataCompany.id
          })

        if (!dataSector) {
          const createDataSector =
            await new SectorsController().store({
              i_code: i_code_sector,
              company_id: dataCompany.id,
              description: ds_sector,
            })

          if (!createDataSector) {
            return {
              status: 500,
              message: 'Error in creating Sector'
            }
          }

          objAttendance.sector_id = createDataSector.id
          objAttendance.operations.sector = 'create'
        } else {
          objAttendance.sector_id = dataSector.id
        }

        // #endregion sector

        // #region inpatientUnit
        const dataImpatientUnit =
          await new InpatientUnitsController().show({
            i_code: i_code_inpatient_unit, sector_id: objAttendance.sector_id
          })

        if (!dataImpatientUnit) {
          const createDataImpatientUnit =
            await new InpatientUnitsController().store({
              i_code: i_code_inpatient_unit,
              sector_id: objAttendance.sector_id,
              description: ds_inpatient_unit,
            })

          if (!createDataImpatientUnit) {
            return {
              status: 500,
              message: 'Error in creating Inpatient Unit'
            }
          }

          objAttendance.inpatientUnit_id = createDataImpatientUnit.id
          objAttendance.operations.inpatientUnit = 'create'

        } else {
          objAttendance.inpatientUnit_id = dataImpatientUnit.id
        }
        // #endregion inpatientUnit

        // #region hospital bed
        const dataHospitalBed =
          await new HospitalBedsController().show({
            i_code: i_code_hospital_bed,
            inpatient_unit_id: objAttendance.inpatientUnit_id
          })

        if (!dataHospitalBed) {
          const createDataHospitalBed =
            await new HospitalBedsController().store({
              i_code: i_code_hospital_bed,
              description: ds_hospital_bed,
              inpatient_unit_id: objAttendance.inpatientUnit_id,
              cd_type_accomodation,
              ds_type_accomodation,
              type_ocuppation,
              abstract_description
            })

          if (!createDataHospitalBed) {
            return {
              status: 500,
              message: 'Error in creating Hospital Bed'
            }
          }

          objAttendance.hospitalBed_id = createDataHospitalBed.id
          objAttendance.operations.hospitalBed = 'create'

        } else {
          objAttendance.hospitalBed_id = dataHospitalBed.id
        }

        // #endregion hospital bed

        // #region attendance
        const dataAttendance =
          await new AttendancesController().show({
            i_code: i_code_attendance,
            client_id: objAttendance.client_id
          })

        // format date attendance

        let startDateFormated: string =
          Moment(start_date).format(`YYYY-MM-DD`) + ` ` + Moment(start_hour).format(`HH:mm:ss`)

        let endDateFormated = end_date != '' ?
          Moment(end_date).format(`YYYY-MM-DD`) + ` ` + Moment(end_hour).format(`HH:mm:ss`) : null

        if (!dataAttendance) {

          const createDataAttendance =
            await new AttendancesController().store({
              i_code: i_code_attendance,
              client_id: objAttendance.client_id,
              end_date: endDateFormated,
              start_date: startDateFormated,
              sector_id: objAttendance.sector_id,
              origin_id: objAttendance.origin_id,
              type: type_attendance,
              inpatient_unit_id: objAttendance.inpatientUnit_id,
              hospital_bed_id: objAttendance.hospitalBed_id,
              health_insurance_id: objAttendance.heathInsurance_id,
              company_id: dataCompany.id
            })

          if (!createDataAttendance) {
            return {
              status: 500,
              message: 'Error in creating attendance'
            }
          }

        } else {

          const updateDataAttendance =
            await new AttendancesController().storeOrUpdate({
              i_code: i_code_attendance,
              client_id: objAttendance.client_id,
              end_date: endDateFormated,
              start_date: startDateFormated,
              sector_id: objAttendance.sector_id,
              origin_id: objAttendance.origin_id,
              type: type_attendance,
              inpatient_unit_id: objAttendance.inpatientUnit_id,
              hospital_bed_id: objAttendance.hospitalBed_id,
              health_insurance_id: objAttendance.heathInsurance_id,
              company_id: dataCompany.id,
            })

          if (!updateDataAttendance) {
            return {
              status: 500,
              message: 'Error in updating attendance'
            }
          }

          objAttendance.operations.attendance = 'update'

        }

        // #endregion attendance

        // #region return
        log(`Data return: ${JSON.stringify(data)}`)
        return {
          status: 'success',
          // message: {
          //   attendance: {
          //   received_code: i_code_attendance,
          //   operation: objAttendance.operations.attendance,
          //   operation_tables: {
          //     origin: objAttendance.operations.origin,
          //     healthInsurance: objAttendance.operations.healthInsurance,
          //     sector: objAttendance.operations.sector,
          //     inpatientUnit:objAttendance.operations.inpatientUnit,
          //     hospitalBed: objAttendance.operations.hospitalBed,
          //     }
          //   },
          // }
          message: data

        };

        // #endregion return
        //#endregion store attendance
      }

    } catch (error) {
      log(error)
      return 0

    }
  }

  public async tables(data, dataCompany) {

    const log = Log('processData:tables')

    //log(`returning Data in processData:tables: ${JSON.stringify(data)}`)

    const {
      setores: {
        setor: sectors
      }
    } = data;

    let objData: any[] = [];

    // #region sector
    for await (let sector of sectors) {

      try {

        let sector_id: any;

        const storeSector =
          await new SectorsController().storeOrUpdate({
            i_code: sector.cd_setor,
            company_id: dataCompany.id,
            description: sector.ds_setor,
            is_active:
              sector.sn_ativo == `S` ||
              sector.sn_ativo == `true` ||
              sector.sn_ativo == true
              ? true : false,
          })

          if (storeSector)
          sector_id = storeSector.id


        log(`setor: ${sector_id}`)

        if (sector.hasOwnProperty(`unidades_internacao`)){
          objData.push({
            unidades_internacao: sector.unidades_internacao,
            sector_id,
            cd_setor: sector.cd_setor,
          })

        }

      } catch (error) {
        log(`error_sector: ${error.message}`)
      }


    }
    // #endregion sector

    let objInpatient: any[] = [];

    // function for execute the generation and map the inpatientUnit
    async function* genInpatients(objData){
      for (const sector of objData){

        if (sector.unidades_internacao)
          sector.unidades_internacao.sector_id = sector.sector_id
          sector.unidades_internacao.cd_setor = sector.cd_setor

          if (Array.isArray(sector.unidades_internacao.unidade_internacao)){

            for await (let element of sector.unidades_internacao.unidade_internacao){
              yield {
                unidade_internacao: element,
                sector_id: sector.sector_id,
                cd_setor: sector.cd_setor
              }
            }

          }else{
            yield sector.unidades_internacao;
          }

      }
    }

    async function fncBeds(dataInpatients){

     //og(`datain: ${JSON.stringify(dataInpatients)}`)
      let arrBed: any[] = [];
      for (const inpatientsFor of dataInpatients){


        //let retBed: any;

        //log(`inpatients: ${JSON.stringify(inpatients)}`)

        if (inpatientsFor.leito){
          inpatientsFor.leito.inpatientUnit_id = inpatientsFor.inpatientUnit_id

          if (Array.isArray(inpatientsFor.leito)){

            // inpatients.leito.forEach(element => {
            //   arrBed.push(element)
            // });

            for (let index = 0; index < inpatientsFor.leito.length; index++) {
              const element = inpatientsFor.leito[index];
              //log(`chegou aqui: ${element.cd_leito}`)
              arrBed.push({
                inpatientUnit_id: inpatientsFor.inpatientUnit_id,
                cd_leito: element.cd_leito,
                ds_leito: element.ds_leito,
                inpatient_unit_id: element.inpatientUnit_id,
                cd_tip_acomodacao: element.cd_tip_acomodacao,
                ds_tip_acomodacao: element.ds_tip_acomodacao,
                tp_ocupacao: element.tp_ocupacao,
                ds_resumo_leito: element.ds_resumo_leito,
                sn_ativo: element.sn_ativo
              })
            }


          }else{
            arrBed.push({
                inpatientUnit_id: inpatientsFor.inpatientUnit_id,
                cd_leito: inpatientsFor.leito.cd_leito,
                ds_leito: inpatientsFor.leito.ds_leito,
                inpatient_unit_id: inpatientsFor.leito.inpatientUnit_id,
                cd_tip_acomodacao: inpatientsFor.leito.cd_tip_acomodacao,
                ds_tip_acomodacao: inpatientsFor.leito.ds_tip_acomodacao,
                tp_ocupacao: inpatientsFor.leito.leitoment.tp_ocupacao,
                ds_resumo_leito: inpatientsFor.leito.ds_resumo_leito,
                sn_ativo: inpatientsFor.leito.sn_ativo
            })
          }


        }


      }

      return arrBed;
    }

    for await (let dataInpatientsFor of genInpatients(objData)){

      try {

        if (Array.isArray(dataInpatientsFor)){
          dataInpatientsFor = dataInpatientsFor[0]
        }


          //log(`chegou no for das unidade_internacao: ${JSON.stringify(dataInpatientsFor[0])}`)
          let inpatientUnit_id;
          log(`data unid int: ${dataInpatientsFor.unidade_internacao.cd_unid_int}, sector_id: ${dataInpatientsFor.sector_id} cd_setor: ${dataInpatientsFor.cd_setor}`)

          const storeInpatientUnit =
            await new InpatientUnitsController().storeOrUpdate({
              i_code: dataInpatientsFor.unidade_internacao.cd_unid_int,
              sector_id: dataInpatientsFor.sector_id,
              description: dataInpatientsFor.unidade_internacao.ds_unid_int,
              is_active:
                dataInpatientsFor.unidade_internacao.sn_ativo == `S` ||
                dataInpatientsFor.unidade_internacao.sn_ativo == `true` ||
                dataInpatientsFor.unidade_internacao.sn_ativo == true
                ? true : false,
            })

            if (storeInpatientUnit)
              inpatientUnit_id = storeInpatientUnit.id


          if (dataInpatientsFor.unidade_internacao.hasOwnProperty(`leitos`)){
            dataInpatientsFor.unidade_internacao.leitos.inpatientUnit_id = inpatientUnit_id
            objInpatient.push(dataInpatientsFor.unidade_internacao.leitos)
          }

      } catch (error) {
        log(`error unid_int: ${error.message}`)
      }

    }

    const retFncBeds = await fncBeds(objInpatient);

    for await (const dataBeds of retFncBeds){
      try {

        log(`data leitos: ${dataBeds.cd_leito}, inpatientUnit_id: ${dataBeds.inpatientUnit_id} ,cd_tip_acomodacao: ${dataBeds.cd_tip_acomodacao}`)

        await new HospitalBedsController().storeOrUpdate({
          i_code: dataBeds.cd_leito,
          description: dataBeds.ds_leito,
          inpatient_unit_id: dataBeds.inpatientUnit_id,
          cd_type_accomodation: dataBeds.cd_tip_acomodacao,
          ds_type_accomodation: dataBeds.ds_tip_acomodacao,
          type_ocuppation: dataBeds.tp_ocupacao,
          abstract_description: dataBeds.ds_resumo_leito,
          is_active:
            dataBeds.sn_ativo == `S` ||
            dataBeds.sn_ativo == `true` ||
            dataBeds.sn_ativo == true
            ? true : false,
        })

      } catch (error) {
        log(`error leito: ${error.message}`)
      }
    }

    return true

  }
}
