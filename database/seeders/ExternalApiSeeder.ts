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
        data_field: 'AtendimentoResponse.AtendimentoResult',
        company_id: 1,
      },
      {
        description: 'tables',
        url: 'http://ensemblehomol.acsc.org.br:8940/csp/healthshare/cristiane_mello/services/ACSC.Negocios.Atendimento.Wings.WS.Service.cls',
        content_type: 'text/xml',
        body: bodyTables,
        headers: headersTables,
        data_field: 'SetoresResponse.SetoresResult',
        company_id: 1,
      },
      {
        description: 'attendance',
        url: 'http://10.0.38.39/tascom/prd/tascomPanel/public/api/attendance',
        content_type: 'application/json',
        body: '{"atendimento": 0, "token": "ghjr4925ddrnnlpo56c6d5hj6d5b2e9aqz6494adadhjkghudsdf4d54mlo9kyrscnznx"}',
        data_field: 'message',
        company_id: 2,
      },
      {
        description: 'tables',
        url: 'http://10.0.38.39/tascom/prd/tascomPanel/public/api/tables',
        content_type: 'application/json',
        body: '{"cd_multi_empresa": 0,"token": "ghjr4925ddrnnlpo56c6d5hj6d5b2e9aqz6494adadhjkghudsdf4d54mlo9kyrscnznx"}',
        data_field: 'message',
        company_id: 2,
      },
    ])
  }
}
