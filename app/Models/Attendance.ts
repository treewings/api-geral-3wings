import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

// #models
import Client from 'App/Models/Client'

export default class Attendance extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public client_id: number

  @column()
  public i_code: number

  @column()
  public type: number

  @column()
  public start_date: DateTime

  @column()
  public end_date: DateTime

  @column()
  public origin: string

  @column()
  public sector: string

  @belongsTo(() => Client, {
    foreignKey: 'company_id'
  })
  public client: BelongsTo<typeof Client>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
