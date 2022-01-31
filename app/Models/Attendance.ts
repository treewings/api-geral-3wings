import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

// #models
import ClientModel from 'App/Models/Client'
import CompanyModel from 'App/Models/Company'
import OriginModel from 'App/Models/Origin'
import SectorModel from 'App/Models/Sector'
import InpatientUnitModel from 'App/Models/InpatientUnit'
import HealthInsuranceModel from 'App/Models/HealthInsurance'
import HospitalBedModel from 'App/Models/HospitalBed'

export default class Attendance extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public client_id: number

  @column()
  public i_code: string

  @column()
  public type: string

  @column()
  public start_date: string

  @column()
  public end_date: string | null

  @column()
  public origin_id: number

  @column()
  public health_insurance_id: number

  @column()
  public hospital_bed_id: number

  @column()
  public company_id: number

  @column()
  public sector_id: number

  @column()
  public inpatient_unit_id: number

  @belongsTo(() => ClientModel, {
    foreignKey: 'client_id'
  })
  public client: BelongsTo<typeof ClientModel>

  @belongsTo(() => OriginModel, {
    foreignKey: 'origin_id'
  })
  public origin: BelongsTo<typeof OriginModel>

  @belongsTo(() => SectorModel, {
    foreignKey: 'sector_id'
  })
  public sector: BelongsTo<typeof SectorModel>

  @belongsTo(() => InpatientUnitModel, {
    foreignKey: 'inpatient_unit_id'
  })
  public inpatient_unit: BelongsTo<typeof InpatientUnitModel>

  @belongsTo(() => HealthInsuranceModel, {
    foreignKey: 'health_insurance_id'
  })
  public health_insurance: BelongsTo<typeof HealthInsuranceModel>

  @belongsTo(() => HospitalBedModel, {
    foreignKey: 'hospital_bed_id'
  })
  public hospital_bed: BelongsTo<typeof HospitalBedModel>

  @belongsTo(() => CompanyModel, {
    foreignKey: 'company_id'
  })
  public company: BelongsTo<typeof CompanyModel>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
