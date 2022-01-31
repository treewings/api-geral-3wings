// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Controllers
//import Companies from "App/Controllers/Http/Tables/CompaniesController";
import ExternalApis from "App/Controllers/Http/Tables/ExternalApisController";

// Services
import GetData from "App/Services/GetData"

// Interfaces
import { IGetData } from "App/Interfaces/IServices";

export default class GetDataController {
  public async index(data: IGetData) {

    const dataC = {
      company_id: data.company_id,
      nr_attendance: data.nr_attendance,
      consult: data.consult,
    }

    const dataExternalApis = await new ExternalApis().show(data.company_id, data.consult);

    if (dataExternalApis){
      if (dataExternalApis.content_type == 'application/json') {
        let retJson = await new GetData().jsonService(dataC);
        return retJson;

      }else if (dataExternalApis.content_type == 'text/xml'){
        let retXML = await new GetData().xmlService(dataC);
        return retXML;
      }
    }

    return {
      error: `error`
    }

  }
}
