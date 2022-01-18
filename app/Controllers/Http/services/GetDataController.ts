// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Controllers
import Companies from "App/Controllers/Http/CompaniesController";

// Services
import GetData from "App/Services/GetData"

export default class GetDataController {
  public async index() {

    // reading active companies
    const dataCompanies = await new Companies().list()

    let endpoints: string[] = [];

    dataCompanies.forEach(e => {
      endpoints.push(e.endpoint_attendance)
    });

    await new GetData().xmlService({endpoint: endpoints[0]})
  }
}
