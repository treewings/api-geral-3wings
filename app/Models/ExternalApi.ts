import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo} from '@ioc:Adonis/Lucid/Orm'

import CompanyModel from 'App/Models/Company'

export default class ExternalApi extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public company_id: number

  @column()
  public description: string

  @column()
  public url: string

  @column()
  public content_type: string

  @column()
  public data_field: string

  @column()
  public body: string

  @column()
  public headers: string

  @column()
  public query_params: string

  @column()
  public active: string

  @belongsTo(() => CompanyModel, {
    foreignKey: 'company_id'
  })
  public company: BelongsTo<typeof CompanyModel>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
