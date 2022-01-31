import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ExternalApiModel from 'App/Models/ExternalApi'

export default class ExternalApisController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show(company_id: number, description: string) {
    const data =
      await ExternalApiModel
      .query()
      .where('company_id', company_id)
      .where('description', description)
      .first()

    return data
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
