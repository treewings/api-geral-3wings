// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// Controllers
import Companies from "App/Controllers/Http/CompaniesController";

// Services
import GetData from "App/Services/GetData"

export default class GetDataController {
  public async index() {

    // reading active companies
    const dataCompanies = await new Companies().list()

    let companies: any = [];

    dataCompanies.forEach(e => {
      companies.push({
        endpoint: e.endpoint_attendance, company_id: e.id, nr_attendance: 3060323
      })
    });

    await new GetData().xmlService({
      endpoint: companies[0].endpoint,
      company_id:companies[0].company_id,
      nr_attendance:companies[0].nr_attendance
    })
  }
}
