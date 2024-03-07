import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('name', 255).notNullable()
      table.string('register', 255).notNullable().unique()
      table.string('email', 255).notNullable().unique()
      table.string('password', 12).notNullable()
      table.enum('profile', ['student', 'parent', 'server adm', 'professor']).notNullable()
      table.string('photo', 255).nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
