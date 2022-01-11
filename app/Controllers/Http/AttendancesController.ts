import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Models
import AttendanceModel from 'App/Models/Attendance'

export default class AttendancesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show(id) {
    const data = await AttendanceModel.find(id)
    return data
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
