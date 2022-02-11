import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

// #models
import Sector from 'App/Models/Sector'
import HospitalBed from 'App/Models/HospitalBed'

export default class InpatientUnit extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sector_id: number

  @column()
  public i_code: string

  @column()
  public description: string

  @column()
  public is_active: boolean

  @belongsTo(() => Sector, {
    foreignKey: 'sector_id'
  })
  public sector: BelongsTo<typeof Sector>

  @hasMany(() => HospitalBed, {
    foreignKey: 'inpatient_unit_id'
  })
  public beds: HasMany<typeof HospitalBed>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
