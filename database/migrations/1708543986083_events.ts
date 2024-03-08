import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title', 255).notNullable().unique()
      table.text('description').notNullable()
      table.enum('category', ['notícia', 'edital', 'evento', 'reunião'] as const).notNullable()
      table.enum('status', ['andamento', 'conclúido', 'suspenso'] as const).nullable()
      table.string('thumbnail', 255).nullable()
      table.json('anexo').nullable()
      table.integer('publisher').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
