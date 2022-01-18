import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Models
import CompanyModel from 'App/Models/Company'

export default class CompaniesController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show(id: any) {
    const data = await CompanyModel.find(id)
    return data
  }

  public async list() {
    const data = 
      await CompanyModel
        .query()
        .where('is_active', true)
    return data
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
