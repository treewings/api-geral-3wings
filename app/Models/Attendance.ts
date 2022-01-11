import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

// #models
import ClientModel from 'App/Models/Client'
import OriginModel from 'App/Models/Origin'
import SectorModel from 'App/Models/Sector'

export default class Attendance extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public client_id: number

  @column()
  public i_code: string

  @column()
  public type: string

  @column()
  public start_date: DateTime

  @column()
  public end_date: DateTime

  @column()
  public origin_id: number

  @column()
  public sector_id: number

  @belongsTo(() => ClientModel, {
    foreignKey: 'client_id'
  })
  public client: BelongsTo<typeof ClientModel>

  @belongsTo(() => OriginModel, {
    foreignKey: 'origin_id'
  })
  public origin: BelongsTo<typeof OriginModel>

  @belongsTo(() => SectorModel, {
    foreignKey: 'sector_id'
  })
  public sector: BelongsTo<typeof SectorModel>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
