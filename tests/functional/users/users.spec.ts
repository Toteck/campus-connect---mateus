/* eslint-disable prettier/prettier */
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('User', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create an user student', async ({ client, assert }) => {
    const userPayload = {
      name: 'mateus',
      register: '20222SPI.TMN0011',
      email: 'test@gmail.com',
      password: '12345678',
      profile: 'student',
      photo: 'https://i.pinimg.com/564x/eb/87/89/eb878994e94c2cfe7575a02a82b487d6.jpg',
    }
    const response = await client.post('/users').json(userPayload)

    const { password, photo, ...expected } = userPayload

    response.assertStatus(201)
    response.assertBodyContains({ user: expected })
    assert.notExists(response.body().user.password, 'Password defined')
  })

  test('it should create an server adm', async ({ client, assert }) => {
    const userPayload = {
      name: 'João',
      register: '20202ADM.TMN0007',
      email: 'adm@gmail.com',
      password: '12345678',
      profile: 'server adm',
      photo: 'https://i.pinimg.com/564x/eb/87/89/eb878994e94c2cfe7575a02a82b487d6.jpg',
    }
    const response = await client.post('/users').json(userPayload)

    const { password, photo, ...expected } = userPayload

    response.assertStatus(201)
    response.assertBodyContains({ user: expected })
    assert.notExists(response.body().user.password, 'Password defined')
  })

  test('it should create an parent', async ({ client, assert }) => {
    const userPayload = {
      name: 'Maria',
      register: '20203PRT.TMN0012',
      email: 'maria@gmail.com',
      password: '12345678',
      profile: 'parent',
      photo: 'https://i.pinimg.com/564x/eb/87/89/eb878994e94c2cfe7575a02a82b487d6.jpg',
    }
    const response = await client.post('/users').json(userPayload)

    const { password, photo, ...expected } = userPayload

    response.assertStatus(201)
    response.assertBodyContains({ user: expected })
    assert.notExists(response.body().user.password, 'Password defined')
  })

  test('it should create an professor', async ({ client, assert }) => {
    const userPayload = {
      name: 'Abilio',
      register: '20192PRF.TMN0012',
      email: 'abilio@gmail.com',
      password: '12345678',
      profile: 'professor',
      photo: 'https://i.pinimg.com/564x/eb/87/89/eb878994e94c2cfe7575a02a82b487d6.jpg',
    }
    const response = await client.post('/users').json(userPayload)

    // Removendo (desestruturando password e photo) e todo o resto é o que eu espero (expected)
    const { password, photo, ...expected } = userPayload

    response.assertStatus(201)
    response.assertBodyContains({ user: expected })
    assert.notExists(response.body().user.password, 'Password defined')
    console.log(response.body().user)
  })

  test('it should update an user', async ({ client }) => {
    const userPayload = {
      name: 'Abilio',
      register: '20192PRF.TMN0012',
      email: 'abilio@gmail.com',
      password: '12345678',
      profile: 'professor',
      photo: 'https://i.pinimg.com/564x/eb/87/89/eb878994e94c2cfe7575a02a82b487d6.jpg',
    }
    const response = await client.post('/users').json(userPayload)
    response.assertStatus(201)
    console.log(response.body().user)
    const abilio = response.body().user

    const response2 = await client
      .patch(`/users/update/${abilio.id}`)
      .json({ email: 'abilio@gmail.com', password: '12345678', register: '1845623' })
      .loginAs(response.body().user)

    console.log(response2.body().user)
  })

  test('it should try to update a user with a record from another user', async ({ client }) => {
    const professor1 = {
      name: 'ABILIO SOARES COELHO',
      register: '1845623',
      email: 'prof.abilio.coelho@acad.ifma.edu.br',
      password: '12345678',
      profile: 'professor',
    }

    const professor2 = {
      name: 'IGO COUTINHO MOURA',
      register: '1106075',
      email: 'prof.igo.moura@acad.ifma.edu.br',
      password: '12345678',
      profile: 'professor',
    }

    const response1 = await client.post('/users').json(professor1)
    response1.assertStatus(201)
    const professorAbilio = response1.body().user

    const response2 = await client.post('/users').json(professor2)
    response2.assertStatus(201)
    const professorIgor = response2.body().user

    const response3 = await client
      .patch(`/users/update/${professorIgor.id}`)
      .json({ email: 'prof.igo.moura@acad.ifma.edu.br', password: '12345678', register: '1845623' })
      .loginAs(response1.body().user)
    response3.assertStatus(409)
    console.log(response3.body())
  })

  test('it should try create an invalid profile', async ({ client, assert }) => {
    const userPayload = {
      name: 'teste',
      register: '00000AAA.TMN0000',
      email: 'test@gmail.com',
      password: '12345678',
      profile: 'test',
      photo: 'https://i.pinimg.com/564x/eb/87/89/eb878994e94c2cfe7575a02a82b487d6.jpg',
    }
    const response = await client.post('/users').json(userPayload)
    console.log(response.body())
    const body = response.body()
    response.assertStatus(422)
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 422)
  })
})
