import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Sectors extends BaseSchema {
  protected tableName = 'sectors'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('i_code')
      table.string('description')
      table.boolean('is_active').defaultTo(true)
      table.integer('company_id').unsigned().references('id').inTable('companies')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
