/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import AdmFactory from 'Database/factories/AdmFactory'

test.group('Classes', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a class', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    // Para mim criar uma turma eu preciso criar um curso antes
    const coursePayload = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }

    const response = await client.post('/course').json(coursePayload).loginAs(user)
    response.assertStatus(201)
    const course = response.body().course

    // Criação da turma
    const classPayload = {
      name: 'Tec. em Sistemas de Internet 2022.2',
      year: '2022',
      period: '2',
      shift: 'vespertino',
      courseId: course.id,
    }

    const response2 = await client.post('/classes').json(classPayload).loginAs(user)

    response2.assertStatus(201)
    console.log(response2.body().classe)
  })

  test('it should add student to a class', async ({ client, assert }) => {
    const admUser = await AdmFactory.create()
    // Criando um curso
    const coursePayload = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }

    const response = await client.post('/course').json(coursePayload).loginAs(admUser)
    response.assertStatus(201)
    const course = response.body().course

    // Criação da turma
    const classPayload = {
      name: 'Tec. em Sistemas de Internet 2022.2',
      year: '2022',
      period: '2',
      shift: 'vespertino',
      courseId: course.id,
    }

    const response2 = await client.post('/classes').json(classPayload).loginAs(admUser)
    response2.assertStatus(201)
    const classe = response2.body().classe

    // Criando um estudante
    const userPayload = {
      name: 'mateus',
      register: '20222SPI.TMN0011',
      email: 'test@gmail.com',
      password: '12345678',
      profile: 'student',
      photo: 'https://i.pinimg.com/564x/eb/87/89/eb878994e94c2cfe7575a02a82b487d6.jpg',
    }

    const response3 = await client.post('/users').json(userPayload)
    response3.assertStatus(201)

    // Fazendo o login do estudante
    const loginStudent = await client
      .post('/sessions')
      .json({ email: 'test@gmail.com', password: '12345678' })
    loginStudent.assertStatus(201)

    const student = loginStudent.body().user

    // student and class
    const studentClass = {
      student_id: student.id,
      class_id: classe.id,
    }

    // Adicionando o estudante a uma turma
    const response5 = await client
      .post(`/classes/${classe.id}/students/${student.id}`)
      .json(studentClass)
      .loginAs(loginStudent.body().user)
    response5.assertStatus(201)
    console.log(response5.body().classe)
  })

  test('it should try to create a class with data being used by another class', async ({
    client,
    assert,
  }) => {
    const user = await AdmFactory.create()
    // Para mim criar uma turma eu preciso criar um curso antes
    const coursePayload = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }

    const response = await client.post('/course').json(coursePayload).loginAs(user)
    response.assertStatus(201)
    const course = response.body().course

    // Criação da turma
    const classPayload = {
      name: 'Tec. em Sistemas de Internet 2022.2',
      year: '2022',
      period: '2',
      shift: 'vespertino',
      courseId: course.id,
    }

    const response2 = await client.post('/classes').json(classPayload).loginAs(user)
    response2.assertStatus(201)
    const response3 = await client.post('/classes').json(classPayload).loginAs(user)

    console.log(response3.body())
  })

  test('it should return a class', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    // Para mim criar uma turma eu preciso criar um curso antes
    const coursePayload = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }

    const response = await client.post('/course').json(coursePayload).loginAs(user)
    response.assertStatus(201)
    const course = response.body().course

    // Criação da turma
    const classPayload = {
      name: 'Tec. em Sistemas de Internet 2022.2',
      year: '2022',
      period: '2',
      shift: 'vespertino',
      courseId: course.id,
    }

    const response2 = await client.post('/classes').json(classPayload).loginAs(user)

    response2.assertStatus(201)

    const response3 = await client.get(`/classes/${response2.body().classe.id}`).loginAs(user)

    console.log(response3.body().classe)
  })

  test('it should return a class with invalid id', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    const response = await client.get(`/classes/1`).loginAs(user)

    assert.exists(response.body().message)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 404)
  })

  // Retorne todos as turmas
  test('it should return all class', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    // Para mim criar uma turma eu preciso criar um curso antes
    const sistemasParaInternet = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }

    const biologia = {
      degree: 'superior',
      name: 'Biologia',
    }

    const response = await client.post('/course').json(sistemasParaInternet).loginAs(user)
    response.assertStatus(201)
    const course = response.body().course

    const response2 = await client.post('/course').json(biologia).loginAs(user)
    response.assertStatus(201)
    const course2 = response2.body().course

    // Criação da turma de Sistemas para Internet
    const classPayload = {
      name: 'Tec. em Sistemas de Internet',
      year: '2022',
      period: '2',
      shift: 'Verspertino',
      courseId: course.id,
    }

    // Criação da turma de Biologia
    const classPayload2 = {
      name: 'Licenciatura em Biologia',
      year: '2024',
      period: '1',
      shift: 'Integral',
      courseId: course2.id,
    }

    const response3 = await client.post('/classes').json(classPayload).loginAs(user)
    response3.assertStatus(201)

    const response4 = await client.post('/classes').json(classPayload2).loginAs(user)

    response4.assertStatus(201)

    const response5 = await client.get('/classes').loginAs(user)

    console.log(response5.body().classes.data)
  })

  test('it should return all class by name', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    // Para mim criar uma turma eu preciso criar um curso antes
    const sistemasParaInternet = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }

    const biologia = {
      degree: 'superior',
      name: 'Biologia',
    }

    const response = await client.post('/course').json(sistemasParaInternet).loginAs(user)
    response.assertStatus(201)
    const course = response.body().course

    const response2 = await client.post('/course').json(biologia).loginAs(user)
    response.assertStatus(201)
    const course2 = response2.body().course

    // Criação da turma de Sistemas para Internet
    const classPayload = {
      name: 'Tecnólogo em Sistemas de Internet',
      year: '2022',
      period: '2',
      shift: 'Verspertino',
      courseId: course.id,
    }

    // Criação da turma de Biologia
    const classPayload2 = {
      name: 'Licenciatura em Biologia',
      year: '2024',
      period: '1',
      shift: 'Integral',
      courseId: course2.id,
    }

    const response3 = await client.post('/classes').json(classPayload).loginAs(user)
    response3.assertStatus(201)

    const response4 = await client.post('/classes').json(classPayload2).loginAs(user)

    response4.assertStatus(201)

    const response5 = await client.get('/classes?name=Internet').loginAs(user)

    console.log(response5.body().classes.data)
  })

  test('it should update a class', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    // Para mim criar uma turma eu preciso criar um curso antes
    const sistemasParaInternet = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }

    const response = await client.post('/course').json(sistemasParaInternet).loginAs(user)
    response.assertStatus(201)
    const course = response.body().course

    // Criação da turma de Sistemas para Internet
    const classPayload = {
      name: 'Técnico em Sistemas de Internet',
      year: '2022',
      period: '2',
      shift: 'Verspertino',
      courseId: course.id,
    }

    const response3 = await client.post('/classes').json(classPayload).loginAs(user)
    response3.assertStatus(201)

    console.log(response3.body().classe)

    const response5 = await client
      .patch(`/classes/1`)
      .json({ name: 'Técnologo em Sistemas para Internet', year: '2023' })
      .loginAs(user)

    response5.assertStatus(200)
    console.log(response5.body().classe)
  })

  test('it should try update a classe with invalid course id', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    // Para mim criar uma turma eu preciso criar um curso antes
    const sistemasParaInternet = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }

    const response = await client.post('/course').json(sistemasParaInternet).loginAs(user)
    response.assertStatus(201)
    const course = response.body().course

    // Criação da turma de Sistemas para Internet
    const classPayload = {
      name: 'Técnico em Sistemas de Internet',
      year: '2022',
      period: '2',
      shift: 'Verspertino',
      courseId: course.id,
    }

    const response3 = await client.post('/classes').json(classPayload).loginAs(user)
    response3.assertStatus(201)

    const response5 = await client.patch(`/classes/1`).json({ courseId: 5 }).loginAs(user)

    response5.assertStatus(404)
    console.log(response5.body())
    assert.exists(response5.body().message)
    assert.equal(response5.body().code, 'BAD_REQUEST')
    assert.equal(response5.body().status, 404)
  })
})
