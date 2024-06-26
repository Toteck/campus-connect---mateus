import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Assets extends BaseSchema {
  protected tableName = 'asset_events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('event_id')
        .unsigned()
        .references('id')
        .inTable('events')
        .notNullable()
        .onDelete('CASCADE')
      table.integer('asset_id').unsigned().references('id').inTable('assets').notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
