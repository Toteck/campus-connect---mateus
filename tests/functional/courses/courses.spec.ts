/* eslint-disable prettier/prettier */
import { test } from '@japa/runner'

import Database from '@ioc:Adonis/Lucid/Database'
import { assert } from '@japa/preset-adonis'
import AdmFactory from 'Database/factories/AdmFactory'
import StudentFactory from 'Database/factories/StudentFactory'

test.group('Group', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create a course', async ({ client }) => {
    const admUser = await AdmFactory.create()
    const student = await StudentFactory.create()
    const coursePayload = {
      degree: 'médio técnico',
      name: 'Informática',
    }

    const response = await client.post('/course').json(coursePayload).loginAs(admUser)

    const { ...expected } = coursePayload
    response.assertStatus(201)
    response.assertBodyContains({ course: expected })
  })

  test('Try to create a course with a name already used by another course', async ({
    client,
    assert,
  }) => {
    const user = await AdmFactory.create()
    const coursePayload = {
      degree: 'médio técnico',
      name: 'Informática',
    }

    const response = await client.post('/course').json(coursePayload).loginAs(user)
    response.assertStatus(201)

    const response2 = await client.post('/course').json(coursePayload).loginAs(user)
    response2.assertStatus(409)
    const body = response2.body()
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  test('it should return a course', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    const coursePayload = {
      degree: 'médio técnico',
      name: 'Informática',
    }

    const response = await client.post('/course').json(coursePayload).loginAs(user)
    response.assertStatus(201)

    const response2 = await client.get(`/course/${response.body().course.id}`)

    console.log(response2.body().course)
  })

  test('should try to return a course with an invalid id', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    const response = await client.get('/course/1').loginAs(user)
    const body = response.body()
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 404)
  })

  test('it should return all courses', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    const informatica = {
      degree: 'médio técnico',
      name: 'Informática',
    }
    const edificacoes = {
      degree: 'médio técnico',
      name: 'edificações',
    }
    const administracao = {
      degree: 'médio técnico',
      name: 'administracão',
    }

    const response = await client.post('/course').json(informatica).loginAs(user)
    response.assertStatus(201)
    const response2 = await client.post('/course').json(edificacoes).loginAs(user)
    response2.assertStatus(201)
    const response3 = await client.post('/course').json(administracao).loginAs(user)
    response3.assertStatus(201)

    const response4 = await client.get('/course').loginAs(user)

    console.log(response4.body().courses.data)
  })

  // Retorna todos os cursos por nome
  test('it should return all courses by name', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    const informatica = {
      degree: 'médio técnico',
      name: 'Informática',
    }
    const edificacoes = {
      degree: 'médio técnico',
      name: 'edificações',
    }
    const administracao = {
      degree: 'médio técnico',
      name: 'administracão',
    }

    const response = await client.post('/course').json(informatica).loginAs(user)
    response.assertStatus(201)
    const response2 = await client.post('/course').json(edificacoes).loginAs(user)
    response2.assertStatus(201)
    const response3 = await client.post('/course').json(administracao).loginAs(user)
    response3.assertStatus(201)

    const response4 = await client.get('/course?name=ica').loginAs(user)
    response4.assertStatus(200)

    console.log(response4.body().courses.data)
  })

  test('it should return all courses by degree', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    const sistemasParaInternet = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }
    const biologia = {
      degree: 'superior',
      name: 'Biologia',
    }
    const administracao = {
      degree: 'médio técnico',
      name: 'administracão',
    }

    const response = await client.post('/course').json(sistemasParaInternet).loginAs(user)
    response.assertStatus(201)
    const response2 = await client.post('/course').json(biologia).loginAs(user)
    response2.assertStatus(201)
    const response3 = await client.post('/course').json(administracao).loginAs(user)
    response3.assertStatus(201)

    const response4 = await client.get('/course?degree=médio técnico').loginAs(user)
    response4.assertStatus(200)

    console.log(response4.body().courses.data)
  })

  test('it should return all courses by name and degree', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    const sistemasParaInternet = {
      degree: 'superior',
      name: 'Sistemas de Internet',
    }
    const biologia = {
      degree: 'superior',
      name: 'Biologia',
    }

    const administracao = {
      degree: 'médio técnico',
      name: 'administracão',
    }

    const edificacoes = {
      degree: 'médio técnico',
      name: 'edificacões',
    }

    const response = await client.post('/course').json(sistemasParaInternet).loginAs(user)
    response.assertStatus(201)
    const response2 = await client.post('/course').json(biologia).loginAs(user)
    response2.assertStatus(201)
    const response3 = await client.post('/course').json(administracao).loginAs(user)
    response3.assertStatus(201)
    const response4 = await client.post('/course').json(edificacoes).loginAs(user)
    response4.assertStatus(201)

    const response5 = await client.get('/course?name=Internet&degree=superior').loginAs(user)
    response5.assertStatus(200)

    console.log(response5.body().courses.data)
  })

  // it should return all class by course
  // test('it should return all class by course', async ({ client, assert }) => {})

  test('it should update a course', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    const biologia = {
      degree: 'médio técnico',
      name: 'Biologia',
    }

    const response = await client.post('/course').json(biologia).loginAs(user)
    response.assertStatus(201)

    console.log(response.body().course)

    const updatedBiologia = {
      degree: 'superior',
      name: 'Biologia',
    }
    const response2 = await client
      .patch(`/course/${response.body().course.id}`)
      .json(updatedBiologia)
      .loginAs(user)

    response2.assertStatus(200)

    console.log(response2.body().course)
  })

  // Tenta atualizar o nome de curso para outro que já está sendo usado por outro curso
  test('should try to update a course with the name being used by another course', async ({
    client,
    assert,
  }) => {
    const user = await AdmFactory.create()
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

    const response2 = await client.post('/course').json(biologia).loginAs(user)
    response2.assertStatus(201)

    const response3 = await client
      .patch(`/course/1`)
      .json({ ...sistemasParaInternet, name: 'Biologia' })
      .loginAs(user)

    console.log(response3.body())
  })

  test('it should try update a course with invalid id', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    const response = await client.patch(`/course/1}`).json({}).loginAs(user)

    response.assertStatus(404)

    assert.exists(response.body().message)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 404)
  })

  test('should return 422 when required course data is not provided', async ({
    client,
    assert,
  }) => {
    const user = await AdmFactory.create()
    const response = await client.post('/course').json({}).loginAs(user)
    response.assertStatus(422)

    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })

  test('it should delete a course', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    const coursePayload = {
      degree: 'médio técnico',
      name: 'Informática',
    }

    const response = await client.post('/course').json(coursePayload).loginAs(user)
    response.assertStatus(201)
    const curso = response.body().course

    const response2 = await client.delete(`/course/${curso.id}`).loginAs(user)
    response2.assertStatus(200)

    // verificando no banco de dados se o curso realmente deletado
    const emptyCourse = await Database.query().from('courses').where('id', curso.id)

    assert.isEmpty(emptyCourse)
  })

  test('it should try delete a course with invalid id', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    const response = await client.delete(`/course/1`).loginAs(user)
    response.assertStatus(404)

    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 404)
  })
})
