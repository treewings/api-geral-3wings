import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import cron from 'node-cron'
import moment from 'moment'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
  }

  public async ready () {
    // App is ready

    // invoke controller for consume api

    cron.schedule('* * * * *', async () => {

      console.log(`[${moment().format('MM-DD-YYYY H:mm:ss')}]: Consumindo API externa`)

      const { default: GetDataController } = await import(
        'App/Controllers/Http/services/GetDataController'
      )
      await new GetDataController().index()
    });
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
