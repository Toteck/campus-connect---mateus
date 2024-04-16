import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  ManyToMany,
  belongsTo,
  column,
  computed,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import PostType from 'App/Enums/PostType'
import Status from 'App/Enums/Status'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import Asset from './Asset'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['title'],
  })
  public slug: string

  @column()
  public description: string

  @column()
  public videoUrl: string | null

  @column()
  public postType: PostType

  @column()
  public status: Status

  @column()
  public thumbnail: string | null

  @column()
  public publisher: number

  @belongsTo(() => User, {
    foreignKey: 'publisher',
  })
  public publisherUser: BelongsTo<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'users_events',
  })
  public users: ManyToMany<typeof User>

  @manyToMany(() => Asset, {
    pivotTable: 'asset_events',
  })
  public assets: ManyToMany<typeof Asset>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
