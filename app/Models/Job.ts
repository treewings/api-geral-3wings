import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import CompanyModel from 'App/Models/Company'

export default class Job extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public company_id: number

  @column()
  public i_code: number

  @column()
  public consult: string

  @column()
  public is_active: boolean

  @belongsTo(() => CompanyModel, {
    foreignKey: 'company_id'
  })
  public company: BelongsTo<typeof CompanyModel>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
