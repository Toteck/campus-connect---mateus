import Route from '@ioc:Adonis/Core/Route'

// Session
Route.post('/sessions', 'SessionsController.store') // Login
// Session
Route.delete('/sessions', 'SessionsController.destroy').middleware([
  'auth',
  'acl:student,server adm,parent,professor',
])

// Rota para listar todos os eventos
Route.get('/events', 'EventsController.index').middleware(['auth', 'acl:student,server adm'])

// User
Route.post('/users', 'UsersController.store') // Rota para criação de contas
Route.patch('/users/update/:id', 'UsersController.update').middleware([
  'auth',
  'acl:student,server adm,professor,parent',
]) // Rota para atualização de dados do usuário

// Classe
// Rota para adicionar estudante a uma turma! O estudante seleciona a turma no qual ele participa
Route.post('/classes/:classId/students/:studentId', 'ClassesController.addStudent').middleware([
  'auth',
  'acl:student',
])

// Passwords
Route.post('/forgot-password', 'PasswordsController.forgotPassword')
Route.post('/reset-password', 'PasswordsController.resetPassword')

// Rotas pertecentens somente ao usuário adm
Route.group(() => {
  // Course
  Route.post('/course', 'CoursesController.store')
  Route.get('/course/:id', 'CoursesController.show')
  Route.get('/course', 'CoursesController.index')
  Route.get('/course/:id/classes', 'CoursesController.classesByCourse')
  Route.patch('/course/:id', 'CoursesController.update')
  Route.delete('/course/:id', 'CoursesController.destroy')

  // Classes
  Route.post('/classes', 'ClassesController.store')
  Route.patch('/classes/:id', 'ClassesController.update')
  Route.get('/classes/:id', 'ClassesController.show')
  Route.get('/classes', 'ClassesController.index')

  // Events
  Route.post('/events', 'EventsController.store')
  //Route.post('/events/send/:id', 'EventsController.sendEventToClass')
  Route.post('/events/send-to-class/', 'EventsController.sendEventToClass')
  Route.post('/events/send-to-course/', 'EventsController.sendEventByCourse')
  Route.post('/events/send-to-user/', 'EventsController.sendEventByUser')
  Route.patch('/events/:id', 'EventsController.update')
  Route.delete('/events/:id', 'EventsController.destroy')
}).middleware(['auth', 'acl:server adm'])

Route.post('/upload', 'FilesController.upload')

// Route.post('upload', async ({ request }) => {
//   const image = request.file('image')
//   if (image !== null) {
//     const fileName = `${Date.now()}.${image.extname}`
//     const fileStream = fs.createReadStream(image.tmpPath!)
//     await Drive.putStream(fileName, fileStream, {
//       contentType: image.headers['content-type'],
//     })
//   }
// })
