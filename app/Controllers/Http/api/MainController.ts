import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Controllers
import CompaniesController from 'App/Controllers/Http/CompaniesController'
import ClientsController from 'App/Controllers/Http/ClientsController'
import AttendancesController from 'App/Controllers/Http/AttendancesController'
import OriginsController from 'App/Controllers/Http/OriginsController'
import SectorsController from 'App/Controllers/Http/SectorsController'
import InpatientUnitsController from 'App/Controllers/Http/InpatientUnitsController'
import HospitalBedsController from 'App/Controllers/Http/HospitalBedsController'
import HealthInsurancesController from 'App/Controllers/Http/HealthInsurancesController'


export default class MainController {
  public async index({ request, response } :HttpContextContract) {

    const { company, access_key } = request.headers()

    //#region validation headers
    if (!company || !access_key){
      return response.status(500).json(
        {
          message: !company ? 'Company not found' : 'access_key not found',
        }
      )
    }

    const dataCompany = await new CompaniesController().show(company)

    if (!dataCompany){
      return response.status(500).json(
        {
          message: 'Company not found in database',
        }
      )
    }

    if (dataCompany.access_key != access_key){
      return response.status(500).json(
        {
          message: `Incorret access_key for company_id: ${company}`,
        }
      )
    }
    //#endregion headers

    //#region body
      // body variables allocation

      let objAttendance = {
        company_id: dataCompany.id,
        client_id: 0,
        origin_id: 0,
        sector_id: 0,
        inpatientUnit_id: 0,
        heathInsurance_id: 0,
        hospitalBed_id: 0
      }

      const {
        paciente: {
          cd_paciente: i_code,
          nm_paciente: name,
          dt_nascimento: birth_date,
          sn_vip: is_vip,
          telefone: phone_number,
        },
        atendimento: {
          tp_atendimento: type_attendance,
          dt_atendimento: start_date,
          hr_atendimento: start_hour,
          nr_attendance: i_code_attendance,
          dt_alta: end_date,
          origem: {
            cd_ori_ate: i_code_origin,
            ds_ori_ate: ds_origin,
            tp_origem: type_origin,
          },
          convenio: {
            cd_convenio: i_code_health_insurance,
            ds_convenio: ds_health_insurance
          },
          setor: {
            cd_setor: i_code_sector,
            nm_setor: ds_sector,
          },
          unidade_internacao: {
            cd_unid_int: i_code_impatient_unit,
            ds_unid_int: ds_inpatient_units
          },
          leito:{
            cd_leito: i_code_hospital_bed,
            cd_tip_acomodacao: cd_type_accomodation,
            ds_tip_acomodacao: ds_type_accomodation,
            ds_resumo_leito: abstract_description,
            tp_ocupacao: type_ocuppation,
          }
        }
      } = request.body()

      //#region store client
      const returnClientStore =
        await new ClientsController().store({
          birth_date,
          i_code,
          is_vip,
          name,
          phone_number,
          company_id: dataCompany.id
        })
      //#endregion store client

      //#region store attendance
      if(returnClientStore){
        objAttendance.client_id = returnClientStore.id

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
            return response.status(500).json({
              message: 'Error in creating Origin'
            })
          }

          objAttendance.origin_id = createDataOrigin.id

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
            return response.status(500).json({
              message: 'Error in creating Health Insurance'
            })
          }

          objAttendance.heathInsurance_id = createDataHealthInsurance.id

        }else{
          objAttendance.heathInsurance_id = dataHealthInsurance.id
        }

        // #endregion health insurance

        // sector
        const dataSector =
          await new SectorsController().show({ i_code_sector, dataCompany.id })
        if (dataSector){
          // update
        }else{
          // create
        }

        // unid_int
        const dataImpatientUnit =
          await new InpatientUnitsController().show({ i_code_impatient_unit, dataCompany.id })
        if (dataImpatientUnit){
          // update
        }else{
          // create
        }

        // hospital bed
        const dataHospitalBed =
          await new HospitalBedsController().show({ i_code_hospital_bed, dataCompany.id })
        if (dataHospitalBed){
          // update
        }else{
          // create
        }


        // attendance
        const dataAttendance =
          await new AttendancesController().show(i_code_attendance, dataCompany.id)

          if (dataAttendance){
            // update
          }else{
            // create
          }
      }
      //#endregion store attendance

      //#endregion body



  }
}
