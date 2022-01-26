import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Models
import AttendanceModel from 'App/Models/Attendance'

// Interfaces
import { IAttendanceStore, IAttendanceUpdate, IAttendanceShow } from 'App/Interfaces/IAttendance'

export default class AttendancesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store(data: IAttendanceStore) {

    console.log(data)

    const iData = await AttendanceModel.create({
     client_id: data.client_id,
     start_date: data.start_date,
     end_date: data.end_date,
     i_code: data.i_code,
     origin_id: data.origin_id,
     sector_id: data.sector_id,
     type: data.type,
    });

    return iData.$isPersisted ? iData : false;
  }

  public async show(data: IAttendanceShow) {
    const sData =
    await AttendanceModel
      .query()
      .where('i_code', data.i_code)
      .where('client_id', data.client_id || 0)
      .first()

    return sData ? sData : false
  }

  public async showFromCompany(data: IAttendanceShow) {

    const sData = await AttendanceModel
      .query()
      .where('i_code', data.i_code)
      .where('company_id', data.company_id || 0)
      .preload('origin')
      .preload('sector')
      .preload('client')
      .first()

    return sData ? sData : false
  }

  public async edit() {

  }

  public async update(data: IAttendanceUpdate) {
    const eData =
      await AttendanceModel
        .query()
        .where('i_code', data.i_code)
        .where('client_id', data.client_id)
        .first();

    if (eData){
      eData.type        = data.type
      eData.start_date  = data.start_date
      eData.end_date    = data.end_date
      eData.origin_id   = data.origin_id
      eData.sector_id   = data.sector_id
      eData.save();

      return eData.$isPersisted ? true : false;

    }

    return false
  }

  public async destroy({}: HttpContextContract) {}
}
