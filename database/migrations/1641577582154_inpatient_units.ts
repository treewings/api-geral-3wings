import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InpatientUnits extends BaseSchema {
  protected tableName = 'inpatient_units'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('i_code')
      table.integer('sector_id').unsigned().references('id').inTable('sectors')
      table.string('description')
      table.boolean('is_active').defaultTo(true)
      
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
