import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

// #models
import InpatientUnit from 'App/Models/InpatientUnit'

export default class HospitalBed extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public i_code: string

  @column()
  public description: string

  @column()
  public is_active: string

  @column()
  public cd_type_accomodation: string

  @column()
  public ds_type_accomodation: string

  @column()
  public abstract_description: string

  @column()
  public type_ocuppation: string

  @column()
  public inpatient_unit_id: number

  @belongsTo(() => InpatientUnit, {
    foreignKey: 'inpatient_unit_id'
  })
  public sector: BelongsTo<typeof InpatientUnit>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
