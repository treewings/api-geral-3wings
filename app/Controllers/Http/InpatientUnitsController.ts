import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Models
import InpatientUnitModel from 'App/Models/InpatientUnit'

// Interface
import { IInpatientUnitShow, IInpatientUnitStore  } from 'App/Interfaces/IInpatientUnit'

export default class InpatientUnitsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store(data: IInpatientUnitStore) {
    const iData = await InpatientUnitModel.create({
      i_code: data.i_code,
      description: data.description,
      sector_id: data.sector_id
     });

     return iData.$isPersisted ? iData: false;
  }

  public async show(data: IInpatientUnitShow) {
    const sData =
    await InpatientUnitModel
      .query()
      .where('i_code', data.i_code)
      .where('sector_id', data.sector_id)
      .first()

    return sData ? sData : false
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
