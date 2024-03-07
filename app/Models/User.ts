import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, beforeSave, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Class from './Class'
import Event from './Event'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public register: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public profile: 'student' | 'parent' | 'server adm' | 'professor'

  @column()
  public photo: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

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
