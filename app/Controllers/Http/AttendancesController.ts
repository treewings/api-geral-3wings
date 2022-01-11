import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Models
import AttendanceModel from 'App/Models/Attendance'

// Interfaces
import { IAttendanceStore, IAttendanceEdit, IAttendanceShow } from 'App/Interfaces/IAttendance'

export default class AttendancesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store(data: IAttendanceStore) {
    const iData = await AttendanceModel.create({
     client_id: data.client_id,
     start_date: data.start_date,
     end_date: data.end_date,
     i_code: data.i_code,
     origin_id: data.origin_id,
     sector_id: data.sector_id,
     type: data.type,
    });

    return iData.$isPersisted ? true : false;
  }

  public async show(data: IAttendanceShow) {
    const sData = await AttendanceModel.find(data.i_code)
    return sData
  }

  public async edit(data: IAttendanceEdit) {
    const eData = await AttendanceModel.find(data.i_code)

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

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
