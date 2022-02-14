import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Log from 'debug'
import moment from 'moment'

//controllers
import GetDataController from 'App/Controllers/Http/services/GetDataController'

//models
import JobModel from 'App/Models/Job'

export default class MainController {
  public async index() {

    const log = Log('jobs:index')

    const data =  await JobModel.query().where('is_active', true)

    if (data)
    for await (const job of data){

      log(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Init, Job: ${job.id}`)

      const ret = await new GetDataController().index({
        company_id: job.company_id,
        i_code: job.i_code,
        consult: job.consult
      })

      if (ret){
        log(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Yep, Job: ${job.id}, successfully`)
      }

    }

    return;

  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
