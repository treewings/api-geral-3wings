import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Attendances extends BaseSchema {
  protected tableName = 'attendances'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('client_id').unsigned().references('id').inTable('clients')
      table.integer('company_id').unsigned().references('id').inTable('companies')
      table.integer('inpatient_unit_id').unsigned().references('id').inTable('inpatient_units')
      table.integer('health_insurance_id').unsigned().references('id').inTable('health_insurances')
      table.integer('hospital_bed_id').unsigned().references('id').inTable('hospital_beds')
      table.integer('origin_id').unsigned().references('id').inTable('origins')
      table.integer('sector_id').unsigned().references('id').inTable('sectors')
      table.string('i_code')
      table.string('type')
      table.string('start_date')
      table.string('end_date')
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
