import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

//models
import ClientModel from 'App/Models/Client'
import CompanyModel from 'App/Models/Company'
import SectortModel from 'App/Models/Sector'
import InpatientUnitModel from 'App/Models/InpatientUnit'
import HospitalBedModel from 'App/Models/HospitalBed'
import OriginModel from 'App/Models/Origin'
import HealthInsuranceModel from 'App/Models/HealthInsurance'
import AttendanceModel from 'App/Models/Attendance'

export default class TruncateAllTablesSeeder extends BaseSeeder {
  public async run () {

    await AttendanceModel.truncate(true)
    await HealthInsuranceModel.truncate(true)
    await OriginModel.truncate(true)
    await HospitalBedModel.truncate(true)
    await InpatientUnitModel.truncate(true)
    await SectortModel.truncate(true)
    await ClientModel.truncate(true)
    await CompanyModel.truncate(true)

  }
}
