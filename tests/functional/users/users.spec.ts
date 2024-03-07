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
