// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Companies from "App/Controllers/Http/CompaniesController";

export default class GetDataController {
  public async index() {
    
    // reading active companies
    const dataCompanies = await new Companies().list()

    let endpoints: string[] = [];

    dataCompanies.forEach(e => {
      endpoints.push(e.endpoint_attendance)  
    });

    console.log(endpoints)
  }
}
