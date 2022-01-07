import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class HospitalBeds extends BaseSchema {
  protected tableName = 'hospital_beds'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('inpatient_unit_id').unsigned().references('id').inTable('inpatient_units')
      table.string('i_code')
      table.string('description')
      table.boolean('is_active')
      table.string('cd_type_accomodation')
      table.string('ds_type_accomodation')  
      table.string('abstract_description')
      table.string('type_ocuppation')
      
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
