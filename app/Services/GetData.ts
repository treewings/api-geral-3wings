import axios from 'axios'
import builder from 'xmlbuilder'
import xmlParser from 'xml2js'

// Interfaces
import { IGetData } from 'App/Interfaces/IServices'

export default class GetData {
  public async xmlService(data: IGetData) {

    //let obj;

    let body = {
      "soapenv:Envelope": {
      "@xmlns:soapenv": "http://schemas.xmlsoap.org/soap/envelope/",
      "soapenv:Header": "",
      "soapenv:Body": {
        "Atendimento": {
          "Atendimento": {
            "CdAtendimento": 3060323
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
      xmlParser.parseString(res.data,options,(err, result) => {
        if(err) {
            throw err;
        }

        console.log(`Paciente: ${result.Envelope.Body.AtendimentoResponse.AtendimentoResult.paciente.nm_paciente}`)
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
