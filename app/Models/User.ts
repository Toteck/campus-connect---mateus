import { DateTime } from 'luxon'
import {
  BaseModel,
  HasMany,
  ManyToMany,
  beforeSave,
  column,
  hasMany,
  manyToMany,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Class from './Class'
import Event from './Event'
import LinkToken from './LinkToken'
import Role from './Role'
//import LinkToken from './LinkToken'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public roleId: number

  @belongsTo(() => Role, {
    foreignKey: 'roleId',
  })
  public role: BelongsTo<typeof Role>

  @column()
  public photo: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => LinkToken, {
    foreignKey: 'userId',
  })
  public tokens: HasMany<typeof LinkToken>

  @manyToMany(() => Class, {
    pivotTable: 'users_classes',
  })
  public classes: ManyToMany<typeof Class>

  @manyToMany(() => Event, {
    pivotTable: 'users_events',
  })
  public events: ManyToMany<typeof Event>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) user.password = await Hash.make(user.password)
  }
}
