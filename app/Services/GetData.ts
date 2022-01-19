import axios from 'axios'
import builder from 'xmlbuilder'
import xmlParser from 'xml2js'

// Interfaces
import { IGetData, IDataGetAttendance } from 'App/Interfaces/IServices'


// Controlllers
import ProcessDataController from 'App/Controllers/Http/api/ProcessDataController'
import CompaniesController from 'App/Controllers/Http/CompaniesController'

export default class GetData {
  public async xmlService(data: IGetData) {

    console.log(data)

    if (!data.company_id){
      return {
        message: 'Company not found'
      }
    }

    const dataCompany = await new CompaniesController().show(data.company_id)

    if (!dataCompany){
      return {
        message: 'Company not found in database'
      }
    }

    let dataAttendance: IDataGetAttendance;

    let body = {
      "soapenv:Envelope": {
      "@xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
      "soapenv:Header": "",
      "soapenv:Body": {
        "Atendimento": {
          "Atendimento": {
            "CdAtendimento": data.nr_attendance
          }
        }
      }
     }
    }

  const xml = builder.create(body).end({ pretty: true })

  axios.post(data.endpoint, xml, {
    headers: {
      'Content-Type': 'text/xml',
      'SOAPAction': "/ACSC.Negocios.Atendimento.Wings.WS.Service.Atendimento"
    }
  })
  .then( (res) => {
    if (res.status === 200) {
      console.info(1)

      // read data xml
      const options = {
        tagNameProcessors: [xmlParser.processors.stripPrefix],
        explicitArray: false
    };
      xmlParser.parseString(res.data,options, async (err, result) => {
        if(err) {
          throw err;
        }

        dataAttendance = result.Envelope.Body.AtendimentoResponse.AtendimentoResult

        const retProcessAttendance =
          await new ProcessDataController().attendance(dataAttendance, dataCompany, data.nr_attendance)

          console.log(retProcessAttendance)

      });
      // end read data xml



    }

  }).catch(err=>{
    console.error(`error: ${err}`)
  });

  }

  public async jsonService() {
    return true;
  }
}
