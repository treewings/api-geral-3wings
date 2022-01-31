import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ExternalApis extends BaseSchema {
  protected tableName = 'external_apis'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.integer('company_id').unsigned().references('id').inTable('companies')
      table.string('description')
      table.string('url')
      table.string('content_type')
      table.json('body').nullable()
      table.json('headers').nullable()
      table.json('query_params').nullable()
      table.boolean('active').defaultTo(true)
      table.string('data_field').nullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
