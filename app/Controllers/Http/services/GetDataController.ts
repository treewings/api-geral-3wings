// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Controllers
import Companies from "App/Controllers/Http/CompaniesController";

// Services
import GetData from "App/Services/GetData"

// Interfaces
import { IGetData } from "App/Interfaces/IServices";

export default class GetDataController {
  public async index(data: IGetData) {

    const dataC = {
      endpoint: data.endpoint,
      company_id: data.company_id,
      nr_attendance: data.nr_attendance,
      type: data.type
    }

    const dataCompany = await new Companies().show(data.company_id);

    if (dataCompany){
      if (dataCompany.content_type == 'application/json') {
        let retJson = await new GetData().jsonService(dataC);
        return retJson;

      }else if (dataCompany.content_type == 'text/xml'){
        let retXML = await new GetData().xmlService(dataC);
        return retXML;
      }
    }

    return {
      error: `error`
    }

  }
}
