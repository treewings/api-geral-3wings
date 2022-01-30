import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CompaniesController from 'App/Controllers/Http/CompaniesController'
import GerDataService from 'App/Controllers/Http/services/GetDataController'
import Log from 'debug'
export default class MainController{
  public async index({
    request,
    response
  }: HttpContextContract){

    try {

      const log = Log('out:attendance')

      // #region ctx
      const {
        nr_attendance,
        company_id,
        type
      } = request.body()

      const {
        access_key
      } = request.headers()

      // #endregion ctx

      //#region validations
      if (!company_id){
        return response.status(500).json(
          {
            message: 'Company_id is required',
          }
        )
      }
      const dataCompany = await new CompaniesController().show(company_id)

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
            message: `Incorret access_key for company_id: ${company_id}`,
          }
        )
      }

      if (!nr_attendance){
        return response.status(500).json(
          {
            message: `nr_attendance is required`,
          }
        )
      }

      if (!type){
        return response.status(500).json(
          {
            message: `type is required`,
          }
        )
      }

      //#endregion validations

      // #region GetData
      const retDataService = await new GerDataService().index({
        endpoint: dataCompany.endpoint_attendance,
        company_id,
        nr_attendance,
        type
      })
      // #endregion GetData
      log(retDataService)
      return response.status(200).json(
        {
          message: retDataService,
        }
      )

    } catch (error) {
      return response.status(500).json(
        {
          message: error,
        }
      )
    }

  }
}
