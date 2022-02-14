import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

//models
import Job from 'App/Models/Job'

export default class JobSeeder extends BaseSeeder {
  public async run () {

    // await Company.truncate(true)

    await Job.createMany([
      {
        company_id: 2,
        consult: 'tables',
        i_code: 1,
      },
      {
        company_id: 1,
        consult: 'tables',
        i_code: 3,
      },
    ])
  }
}
