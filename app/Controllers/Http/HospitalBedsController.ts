import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Models
import HospitalBedtModel from 'App/Models/HospitalBed'

// Interface
import { IHospitalBedShow, IHospitalBedStore } from 'App/Interfaces/IHospitalBed'

export default class HospitalBedsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store(data: IHospitalBedStore) {
    const iData = await HospitalBedtModel.create({
      i_code: data.i_code,
      description: data.description,
      inpatient_unit_id: data.inpatient_unit_id
     });

     return iData.$isPersisted ? iData: false;
  }

  public async show(data: IHospitalBedShow) {
    const sData =
    await HospitalBedtModel
      .query()
      .where('i_code', data.i_code)
      .where('inpatient_unit_id', data.inpatient_unit_id)
      .first()

    return sData ? sData : false
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
