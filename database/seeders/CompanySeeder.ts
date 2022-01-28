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
        endpoint_attendance: 'http://ensemblehomol.acsc.org.br:8940/csp/healthshare/cristiane_mello/services/ACSC.Negocios.Atendimento.Wings.WS.Service.cls',
        endpoint_tables: 'http://ensemblehomol.acsc.org.br:8940/csp/healthshare/cristiane_mello/services/ACSC.Negocios.Setores.Wings.WS.Service.cls',
        i_code: '1',
        invoked_api: true,
        content_type: 'text/xml'
      },
      {
        description: 'Concierge - Hospital Real Português',
        access_key: 'aaa222222',
        endpoint_attendance: 'http://10.0.38.39/tascom/prd/tascomPanel/public/api/whatsapp',
        i_code: '1',
        invoked_api: true,
        content_type: 'application/json'
      },
    ])
  }
}
