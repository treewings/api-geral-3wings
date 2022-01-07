import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

// #models
import Company from 'App/Models/Company'

export default class Sector extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public i_code: string

  @column()
  public description: string

  @column()
  public is_active: boolean
  
  @belongsTo(() => Company, {
    foreignKey: 'company_id'
  })
  public company: BelongsTo<typeof Company>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
