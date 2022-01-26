import axios from 'axios'
import builder from 'xmlbuilder'
import xmlParser from 'xml2js'

// Interfaces
import { IGetData, IDataGetAttendance } from 'App/Interfaces/IServices'

// Controlllers
import ProcessDataController from 'App/Controllers/Http/api/ProcessDataController'
import CompaniesController from 'App/Controllers/Http/CompaniesController'
import AttendancesController from 'App/Controllers/Http/AttendancesController'

export default class GetData {

  public async xmlService(data: IGetData) {

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

    const retAxios = await axios.post(data.endpoint, xml, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': "/ACSC.Negocios.Atendimento.Wings.WS.Service.Atendimento"
      }
    })
    .then( async (res) => {
      if (res.status === 200) {

        const options = {
          tagNameProcessors: [xmlParser.processors.stripPrefix],
          explicitArray: false,
        };


        async function parse(res) {
          const promise = await new Promise((resolve, reject) => {
            const parser = new xmlParser.Parser(options);

            parser.parseString(res.data, async (error, result) => {
              if (error) reject(error);
              else resolve(result);

              dataAttendance =
                result.Envelope.Body.AtendimentoResponse.AtendimentoResult;

                await new ProcessDataController().attendance(
                  dataAttendance,
                  dataCompany,
                  data.nr_attendance
                );

            });

          });
          return promise;
        }

        return parse(res);

    }



  }).catch(async (err)=>{
    console.error(`error: ${err}, retornando dados da ultima atualizacao`)

    // procurando dados na base local

    const attendanceLocal = await new AttendancesController().showFromCompany({
      company_id: data.company_id,
      i_code: data.nr_attendance.toString(),
    });

    if (!attendanceLocal){
      return false;
    }

    let objAttendance = {
      paciente: attendanceLocal.client,
      atendimento: attendanceLocal,
    }

    return objAttendance;

  });

  return retAxios;

  }

  public async jsonService(data: IGetData) {
    return true;
  }
}
