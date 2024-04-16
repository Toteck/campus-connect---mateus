import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 255).notNullable()
      table.string('slug', 255).unique().notNullable()
      table.text('description').notNullable()
      table.string('video_url').nullable()
      table.integer('post_type').unsigned().notNullable().defaultTo(1)
      table.integer('status').unsigned().nullable().defaultTo(1)
      table.string('thumbnail').nullable()
      table
        .integer('publisher')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
