import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Models
import HealthInsuranceModel from 'App/Models/HealthInsurance'

// Interface
import { IHealthInsuranceShow, IHealthInsuranceStore } from 'App/Interfaces/IHeathInsurance'

export default class HealthInsurancesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store(data: IHealthInsuranceStore) {
    const iData = await HealthInsuranceModel.create({
      i_code: data.i_code,
      description: data.description,
      company_id: data.company_id
     });

     return iData.$isPersisted ? iData: false;
  }

  public async show(data: IHealthInsuranceShow) {
    const sData =
    await HealthInsuranceModel
      .query()
      .where('i_code', data.i_code)
      .where('company_id', data.company_id)
      .first()

  return sData ? sData : false
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
