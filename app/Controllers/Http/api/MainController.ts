import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Controllers
import CompaniesController from 'App/Controllers/Http/CompaniesController'
import ClientsController from 'App/Controllers/Http/ClientsController'
import AttendancesController from 'App/Controllers/Http/AttendancesController'


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
          nr_attendance: nr_attendance,
          dt_alta: end_date,
          origem: {
            cd_ori_ate: cd_origin,
            ds_ori_ate: ds_origin,
            tp_origem: tp_origin,
          },
          setor: {
            cd_setor: cd_sector,
            nm_setor: ds_sector,
          },
          unidade_internacao: {
            cd_unid_int: cd_inpatient_units
            ds_unid_int: ds_inpatient_units
          },
          convenio: {
            cd_convenio: cd_health_insurance,
            ds_convenio: ds_health_insurance
          },
          leito:{
            cd_leito: cd_hospital_bed,
            cd_tip_acomodacao: cd_type_accomodation,
            ds_tip_acomodacao: ds_type_accomodation,
            ds_resumo_leito: abstract_description,
            tp_ocupadao: type_ocuppation,
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
        const dataAttendance =
          await new AttendancesController().show(nr_attendance)
      }
      //#endregion store attendance

      //#endregion body



  }
}
