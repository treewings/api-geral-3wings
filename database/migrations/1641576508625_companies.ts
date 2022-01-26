import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Companies extends BaseSchema {
  protected tableName = 'companies'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('i_code')
      table.string('description')
      table.string('access_key')
      table.boolean('invoked_api').comment('if client API needs to be invoked')
      table.enum('content_type', [ 'application/json', 'text/xml' ])
      table.string('soap_action').nullable()
      table.boolean('is_active').defaultTo(true)
      table.string('endpoint_attendance').nullable()
      table.string('endpoint_tables').nullable()

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
