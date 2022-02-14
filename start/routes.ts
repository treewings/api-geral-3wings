/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.post('api/in/attendance', async (ctx) => {

  const { default: MainController } = await import(
    'App/Controllers/Http/api/MainController'
  )

  return new MainController().index(ctx)
})


Route.post('api/out', async (ctx) => {

  const { default: MainController } = await import(
    'App/Controllers/Http/Out/MainController'
  )

  return new MainController().index(ctx)
})

Route.post('api/in', async (ctx) => {

  const { default: MainController } = await import(
    'App/Controllers/Http/In/MainController'
  )

  return new MainController().index(ctx)
})

