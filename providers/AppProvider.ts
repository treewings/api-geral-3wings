import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import cron from 'node-cron'

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

    // invoke controller for consume apis

    cron.schedule('* * * * *', async () => {
      const { default: GetDataController } = await import(
        'App/Controllers/Http/services/GetDataController'
      )
      new GetDataController().index()
    });
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
