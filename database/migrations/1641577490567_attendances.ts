import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Attendances extends BaseSchema {
  protected tableName = 'attendances'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('client_id').unsigned().references('id').inTable('clients')
      table.string('i_code')
      table.string('type')
      table.timestamp('start_date')
      table.timestamp('end_date')
      table.integer('origin_id').unsigned().references('id').inTable('origins')
      table.integer('sector_id').unsigned().references('id').inTable('sectors')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
