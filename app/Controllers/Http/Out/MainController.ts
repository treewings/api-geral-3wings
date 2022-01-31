import Log from 'debug'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CompaniesController from 'App/Controllers/Http/Tables/CompaniesController'
import GetDataService from 'App/Controllers/Http/services/GetDataController'

export default class MainController{
  public async index({
    request,
    response
  }: HttpContextContract){

    const log = Log('out:main')
    try {



      // #region ctx
      const {
        nr_attendance,
        company_id,
        consult
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

      if (!consult){
        return response.status(500).json(
          {
            message: `table is required`,
          }
        )
      }

      //#endregion validations

      // #region GetData
      const retDataService = await new GetDataService().index({
        company_id,
        nr_attendance,
        consult,
      })
      // #endregion GetData
      if (retDataService){

        return response.status(200).json(
          {
            message: retDataService,
          }
        )

      }else{
        return response.status(500).json(
          {
            message: 'Unknown error',
          }
        )
      }

    } catch (error) {
      log(error)
      return response.status(500).json(
        {
          message: error,
        }
      )
    }

  }
}
