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
  public async attendance(data, dataCompany, nr_attendance){

    try {

      const log = Log('processData:attendance')

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
        leito:{
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

      if (!dataClient){

        let snVip = is_vip == `S` ? true : false;

        returnClient =
        await new ClientsController().store({
          birth_date,
          i_code: i_code_client,
          is_vip: snVip,
          name,
          phone_number,
          company_id: dataCompany.id
        })
      }else{
        returnClient = dataClient;
      }

      //#endregion client

      //#region store attendance
      if(returnClient){
        objAttendance.client_id = returnClient.id

        // #region origin
        const dataOrigin =
          await new OriginsController().show({
            i_code: i_code_origin,
            company_id: dataCompany.id
          })

        if (!dataOrigin){
          const createDataOrigin =
          await new OriginsController().store({
            i_code: i_code_origin,
            company_id: dataCompany.id,
            description: ds_origin,
            type: type_origin
          })

          if (!createDataOrigin){
            return {
              status: 500,
              message: 'Error in creating Origin'
            }
          }

          objAttendance.origin_id = createDataOrigin.id
          objAttendance.operations.origin = 'create'

        }else{
          objAttendance.origin_id = dataOrigin.id
        }
        // #endregion origin

        // #region health insurance
        const dataHealthInsurance =
        await new HealthInsurancesController().show({
          i_code: i_code_health_insurance,
          company_id: dataCompany.id
        })

        if (!dataHealthInsurance){
          const createDataHealthInsurance =
          await new HealthInsurancesController().store({
            i_code: i_code_health_insurance,
            company_id: dataCompany.id,
            description: ds_health_insurance,
          })

          if (!createDataHealthInsurance){
            return {
              status: 500,
              message: 'Error in creating Health Insurance'
            }
          }

          objAttendance.heathInsurance_id = createDataHealthInsurance.id
          objAttendance.operations.healthInsurance = 'create'

        }else{
          objAttendance.heathInsurance_id = dataHealthInsurance.id
        }

        // #endregion health insurance

        // #region sector
        const dataSector =
          await new SectorsController().show({
            i_code:i_code_sector,
            company_id: dataCompany.id
          })

        if (!dataSector){
          const createDataSector =
          await new SectorsController().store({
            i_code: i_code_sector,
            company_id: dataCompany.id,
            description: ds_sector,
          })

          if (!createDataSector){
            return {
              status: 500,
              message: 'Error in creating Sector'
            }
          }

          objAttendance.sector_id = createDataSector.id
          objAttendance.operations.sector = 'create'
        }else{
          objAttendance.sector_id = dataSector.id
        }

        // #endregion sector

        // #region inpatientUnit
        const dataImpatientUnit =
          await new InpatientUnitsController().show({
            i_code:i_code_inpatient_unit, sector_id: objAttendance.sector_id
          })

        if (!dataImpatientUnit){
          const createDataImpatientUnit =
          await new InpatientUnitsController().store({
            i_code: i_code_inpatient_unit,
            sector_id: objAttendance.sector_id,
            description: ds_inpatient_unit,
          })

          if (!createDataImpatientUnit){
            return {
              status: 500,
              message: 'Error in creating Inpatient Unit'
            }
          }

          objAttendance.inpatientUnit_id = createDataImpatientUnit.id
          objAttendance.operations.inpatientUnit = 'create'

        }else{
          objAttendance.inpatientUnit_id = dataImpatientUnit.id
        }
        // #endregion inpatientUnit

        // #region hospital bed
        const dataHospitalBed =
          await new HospitalBedsController().show({
            i_code: i_code_hospital_bed,
            inpatient_unit_id: objAttendance.inpatientUnit_id
          })

        if (!dataHospitalBed){
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

          if (!createDataHospitalBed){
            return {
              status: 500,
              message: 'Error in creating Hospital Bed'
            }
          }

          objAttendance.hospitalBed_id = createDataHospitalBed.id
          objAttendance.operations.hospitalBed = 'create'

        }else{
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
            Moment(start_date).format(`YYYY-MM-DD`)+` `+Moment(start_hour).format(`HH:mm:ss`)

          let endDateFormated = end_date != '' ?
            Moment(end_date).format(`YYYY-MM-DD`)+` `+Moment(end_hour).format(`HH:mm:ss`) : null

          if (!dataAttendance){

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

            if (!createDataAttendance){
              return {
                status: 500,
                message: 'Error in creating attendance'
              }
            }

          }else{

            const updateDataAttendance =
            await new AttendancesController().update({
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

            if (!updateDataAttendance){
              return {
                status: 500,
                message:  'Error in updating attendance'
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
    return 0

  }
  }
}
