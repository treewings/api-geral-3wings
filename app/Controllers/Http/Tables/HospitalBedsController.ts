import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Models
import HospitalBedtModel from 'App/Models/HospitalBed'

// Interface
import { IHospitalBedShow, IHospitalBedShowFromSectorCompany, IHospitalBedStore } from 'App/Interfaces/IHospitalBed'

export default class HospitalBedsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store(data: IHospitalBedStore) {
    const iData = await HospitalBedtModel.create({
      i_code: data.i_code,
      description: data.description,
      inpatient_unit_id: data.inpatient_unit_id,
      abstract_description: data.abstract_description,
      type_ocuppation: data.type_ocuppation,
      cd_type_accomodation: data.cd_type_accomodation,
      ds_type_accomodation: data.ds_type_accomodation,
      is_active: data.is_active,
     });

     return iData.$isPersisted ? iData: false;
  }

  public async storeOrUpdate(data: IHospitalBedStore) {

    const searchPayload = {
      i_code: data.i_code,
      inpatient_unit_id: data.inpatient_unit_id,
    }

    const persistancePayload = {
      i_code: data.i_code,
      description: data.description,
      inpatient_unit_id: data.inpatient_unit_id,
      abstract_description: data.abstract_description,
      type_ocuppation: data.type_ocuppation,
      cd_type_accomodation: data.cd_type_accomodation,
      ds_type_accomodation: data.ds_type_accomodation,
      is_active: data.is_active,
    }

    const ret =
    await HospitalBedtModel.updateOrCreate(searchPayload, persistancePayload);

    return ret.$isPersisted ? ret : false
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

  public async showFromSectorCompany(data: IHospitalBedShowFromSectorCompany) {
    const sData =
    await HospitalBedtModel
      .query()
      .preload('inpatientUnit', (inpatientUnit) => {
        inpatientUnit.preload('sector', (query) => {
          query.where('company_id', data.company_id)
        })
      })

    return sData ? sData : false
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
