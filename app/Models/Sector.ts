import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'

// #models
import Company from 'App/Models/Company'
import InPatientUnitModel from 'App/Models/InpatientUnit'

export default class Sector extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public i_code: string

  @column()
  public description: string

  @column()
  public is_active: boolean

  @column()
  public company_id: number

  @belongsTo(() => Company, {
    foreignKey: 'company_id'
  })
  public company: BelongsTo<typeof Company>

  @hasMany(() => InPatientUnitModel, {
    foreignKey: 'sector_id'
  })
  public inpatient_units: HasMany<typeof InPatientUnitModel>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

}
