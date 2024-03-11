import Route from '@ioc:Adonis/Core/Route'

// Session
Route.post('/sessions', 'SessionsController.store') // Login
Route.get('/events', 'EventsController.index').middleware(['auth', 'acl:student,server adm'])
// User
Route.post('/users', 'UsersController.store')

// Classe
// Rota para adicionar estudante a uma turma
Route.post('/classes/:classId/students/:studentId', 'ClassesController.addStudent').middleware([
  'auth',
  'acl:student',
])

Route.group(() => {
  // Session
  Route.delete('/sessions', 'SessionsController.destroy')

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
  Route.post('/events/send/:id', 'EventsController.sendEventToClass')
  Route.post('/events/send-to-course/', 'EventsController.sendEventByCourse')
  Route.patch('/events/:id', 'EventsController.update')
  Route.delete('/events/:id', 'EventsController.destroy')
}).middleware(['auth', 'acl:server adm'])
