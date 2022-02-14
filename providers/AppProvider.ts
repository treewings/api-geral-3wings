import { ApplicationContract } from '@ioc:Adonis/Core/Application'

import cron from 'node-cron'
//import moment from 'moment'

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

    cron.schedule('20 * * * *', async () => {
      const { default: JobsController } = await import(
        'App/Controllers/Http/Jobs/MainController'
      )
      await new JobsController().index()
    });
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
