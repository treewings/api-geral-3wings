import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Controllers
import CompaniesController from 'App/Controllers/Http/CompaniesController'
import ProcessDataController from 'App/Controllers/Http/api/ProcessDataController'


export default class MainController {
  public async index({ request, response } :HttpContextContract) {

  try {


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

    const { atendimento: {
      cd_atendimento
    } } = request.body()

    const retProcessAttendance =
      await new ProcessDataController().attendance(request.body(), dataCompany, cd_atendimento)

      return response.status(200).json(retProcessAttendance);

  } catch (error) {
    return response.status(500).json(error);
  }

  }
}
