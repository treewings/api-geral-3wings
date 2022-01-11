import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo} from '@ioc:Adonis/Lucid/Orm'

// Models
import CompanyModel from 'App/Models/Company'

export default class HealthInsurance extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public description: string

  @column()
  public i_code: string

  @column()
  public company_id: number

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
