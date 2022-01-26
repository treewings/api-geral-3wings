import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public i_code: string

  @column()
  public description: string

  @column()
  public invoked_api: boolean

  @column()
  public content_type: string

  @column()
  public access_key: string

  @column()
  public is_active: boolean

  @column()
  public endpoint_attendance: string

  @column()
  public endpoint_tables: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
