import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class HealthInsurances extends BaseSchema {
  protected tableName = 'health_insurances'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string('i_code')
      table.string('description')
      table.boolean('is_active').defaultTo(true)
      table.integer('company_id').unsigned().references('id').inTable('company')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
