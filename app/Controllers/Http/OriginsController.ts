import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Models
import OriginModel from 'App/Models/Origin'

// Interface
import { IOriginShow, IOriginStore } from 'App/Interfaces/IOrigin'

export default class OriginsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store(data: IOriginStore) {
    const iData = await OriginModel.create({
      i_code: data.i_code,
      description: data.description,
      company_id: data.company_id
     });

     return iData.$isPersisted ? iData: false;
  }

  public async show(data: IOriginShow) {
    const sData =
      await OriginModel
        .query()
        .where('i_code', data.i_code)
        .where('company_id', data.company_id)
        .first()

    return sData ? sData : false
  }

  public async edit() {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
