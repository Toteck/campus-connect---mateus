import Route from '@ioc:Adonis/Core/Route'
import { DateTime } from 'luxon'
import Application from '@ioc:Adonis/Core/Application'
// Session
Route.group(() => {
  Route.post('/', 'SessionsController.store').as('login') // Login
  Route.delete('/', 'SessionsController.destroy').middleware(['auth']).as('logout')
}).prefix('sessions')

// Rota para listar todos os eventos
Route.get('/events', 'EventsController.index').middleware(['auth'])

// User
Route.post('/users', 'UsersController.store') // Rota para criação de contas
Route.patch('/users/update/:id', 'UsersController.update').middleware(['auth']) // Rota para atualização de dados do usuário

// Classe
// Rota para adicionar estudante a uma turma! O estudante seleciona a turma no qual ele participa
Route.post('/classes/:classId/students/:studentId', 'ClassesController.addStudent').middleware([
  'auth',
])

// Passwords
Route.post('/forgot-password', 'PasswordsController.forgotPassword').as('forgotPassword')
Route.post('/reset-password', 'PasswordsController.resetPassword').as('resetPassword')

// Rotas pertecentens somente ao usuário adm
Route.group(() => {
  // Course

  // Route.group(() => {
  //   Route.post('/create', 'CoursesController.store').as('create')
  //   Route.get('/:page?', 'CoursesController.index')
  //     .as('index')
  //     .where('page', Route.matchers.number())
  //   Route.put('/:id', 'CoursesController.update').as('update')
  //   Route.delete('/:id', 'CoursesController.destroy').as('destroy')
  // })
  //   .prefix('/course')
  //   .as('course')

  // // Classes
  // Route.group(() => {
  //   Route.post('/store', 'ClassesController.store').as('store')
  //   Route.put('/:id', 'ClassesController.update').as('update')
  //   Route.get('/?:page', 'ClassesController.index')
  //     .as('index')
  //     .where('page', Route.matchers.number())
  // })
  //   .prefix('/classes')
  //   .as('classes')

  Route.post('/assets', 'AssetsController.store').as('studio.assets.store')
  Route.delete('/assets/:id', 'AssetsController.destroy').as('studio.assets.destroy')

  // Events
  Route.group(() => {
    Route.post('/store', 'EventsController.store').as('store')
    Route.post('/send-to-class', 'EventsController.sendEventToClass').as('send-to-class')
    Route.post('/send-to-course', 'EventsController.sendEventByCourse').as('send-to-course')
    Route.post('/send-to-user', 'EventsController.sendEventByUser').as('send-to-user')
    Route.put('/:id', 'EventsController.update').as('update').as('update')
    Route.delete('/:id', 'EventsController.destroy').as('destroy')
  })
    .prefix('events')
    .as('events')
    .middleware(['role:admin'])
})
  .prefix('studio')
  .as('studio')
  .middleware('auth')

// Rota para gerenciamento de imagens
Route.post('/upload', 'FilesController.upload')

Route.post('images', async ({ request, response }) => {
  const image = request.file('image')

  // Lê os dados do arquivo
  const imageName = DateTime.now().toFormat('yyyyLLddHHmmss') + '.' + image!.extname

  if (image) {
    await image.move(Application.publicPath('images'), {
      name: imageName,
    })
  }

  return response.ok({})
})
