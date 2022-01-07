import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

// #models
import Company from 'App/Models/Company'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public i_code: string

  @column()
  public company_id: string
  
  @column()
  public name: string

  @column()
  public birth_date: DateTime

  @column()
  public is_vip: boolean

  @column()
  public phone_number: string

  @belongsTo(() => Company, {
    foreignKey: 'company_id'
  })
  public company: BelongsTo<typeof Company>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
