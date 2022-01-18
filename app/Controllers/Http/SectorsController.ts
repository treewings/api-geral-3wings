import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Models
import SectorModel from 'App/Models/Sector'

// Interface
import { ISectorShow, ISectorStore  } from 'App/Interfaces/ISector'

export default class SectorsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store(data: ISectorStore) {
    const iData = await SectorModel.create({
      i_code: data.i_code,
      description: data.description,
      company_id: data.company_id
     });

     return iData.$isPersisted ? iData: false;
  }

  public async show(data: ISectorShow) {
    const sData =
    await SectorModel
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
