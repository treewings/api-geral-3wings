import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

//models
import Company from 'App/Models/Company'

export default class CompanySeeder extends BaseSeeder {
  public async run () {

    // await Company.truncate(true)

    await Company.createMany([
      {
        description: 'Hospital Santa Tereza',
        access_key: 'a55a4ds6a5s4d',
        i_code: '1',
      },
      {
        description: 'Concierge - Hospital Real Português',
        access_key: 'aaa222222',
        i_code: '1',
      },
    ])
  }
}
