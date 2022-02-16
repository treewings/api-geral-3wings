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
      company_id: data.company_id,
      is_active: data.is_active,
     });

     return iData.$isPersisted ? iData: false;
  }

  public async storeOrUpdate(data: ISectorStore) {

    const searchPayload = {
      i_code: data.i_code,
      company_id: data.company_id,
    }

    const persistancePayload = {
      i_code: data.i_code,
      description: data.description,
      company_id: data.company_id,
      is_active: data.is_active,
    }

    const ret =
      await SectorModel.updateOrCreate(searchPayload, persistancePayload);

    return ret.$isPersisted ? ret : false

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

  public async showFromCompany(data: { company_id: number }) {
    const sData =
    await SectorModel
      .query()
      .where('company_id', data.company_id)
      .preload('inpatient_units', (inpatients) => {
        inpatients.preload('beds', (beds) => {
          beds.select(
            "i_code",
            "description",
            "is_active",
            "cd_type_accomodation",
            "ds_type_accomodation",
            "abstract_description",
            "type_ocuppation",
          )
          //.where('inpatient_unit_id', 'inpatient_unit.id')
        })
        .select('id', 'i_code', 'description', 'is_active')
      })
      .select('id', 'i_code', 'description', 'is_active')


    return sData ? sData : false
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
