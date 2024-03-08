import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Class from './Class'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public category: 'notícia' | 'edital' | 'evento' | 'reunião'

  @column()
  public status?: 'andamento' | 'concluído' | 'suspenso'

  @column()
  public thumbnail: string | null

  @column()
  public anexo: string[] | null

  @column()
  public publisher: number

  @belongsTo(() => User, {
    foreignKey: 'publisher',
  })
  public publisherUser: BelongsTo<typeof User>

  @manyToMany(() => Class, {
    pivotTable: 'classes_events',
  })
  public classes: ManyToMany<typeof Class>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
