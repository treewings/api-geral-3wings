import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'


import ExternalApiModel from 'App/Models/ExternalApi'

export default class ExternalApiSeederSeeder extends BaseSeeder {
  public async run () {

    const bodyAttendance = '{"soapenv:Envelope": { "@xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/", "soapenv:Header": "", "soapenv:Body": {"Atendimento": { "Atendimento": { "CdAtendimento": 0 } } }}}';

    const headersAttendance = '{"Content-Type": "text/xml", "SOAPAction": "/ACSC.Negocios.Atendimento.Wings.WS.Service.Atendimento"}';

    const bodyTables = '{"soapenv:Envelope": { "@xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/", "soapenv:Header": "", "soapenv:Body": {"Setores": { "Setores": { "CdMultiEmpresa": 0 } } }}}';

    const headersTables = '{"Content-Type": "text/xml", "SOAPAction": "/ACSC.Negocios.Atendimento.Wings.WS.Service.Setores"}';

    await ExternalApiModel.createMany([
      {
        description: 'attendance',
        url: 'http://ensemblehomol.acsc.org.br:8940/csp/healthshare/cristiane_mello/services/ACSC.Negocios.Atendimento.Wings.WS.Service.cls',
        content_type: 'text/xml',
        body: bodyAttendance,
        headers: headersAttendance,
        company_id: 1,
      },
      {
        description: 'tables',
        url: 'http://ensemblehomol.acsc.org.br:8940/csp/healthshare/cristiane_mello/services/ACSC.Negocios.Atendimento.Wings.WS.Service.cls',
        content_type: 'text/xml',
        body: bodyTables,
        headers: headersTables,
        company_id: 1,
      },
    ])
  }
}
