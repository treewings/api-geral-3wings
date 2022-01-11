import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

//Interfaces
import { IClientStore } from 'App/Interfaces/IClients'

// Models
import ClientsModel from 'App/Models/Client'

export default class ClientsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store(data: IClientStore) {

    const iData = await ClientsModel.create({
      company_id: data.company_id,
      birth_date: data.birth_date,
      i_code: data.i_code,
      is_vip: data.is_vip,
      name: data.name,
      phone_number: data.phone_number
    });

    return iData.$isPersisted ? iData : false;
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
