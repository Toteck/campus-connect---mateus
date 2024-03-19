/* eslint-disable prettier/prettier */
import Hash from '@ioc:Adonis/Core/Hash'
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import StudentFactory from 'Database/factories/StudentFactory'
import { DateTime, Duration } from 'luxon'

test.group('Password', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return Database.rollbackGlobalTransaction()
  })

  test('it should send an email with forgot password instructions', async ({ assert, client }) => {
    const student = await StudentFactory.create()

    const response = await client
      .post('/forgot-password')
      .json({ email: student.email, resetPasswordUrl: 'url' })
    response.assertStatus(204)
  })

  test('it should create a reset password token', async ({ assert, client }) => {
    const student = await StudentFactory.create()

    const response = await client
      .post('/forgot-password')
      .json({ email: student.email, resetPasswordUrl: 'url' })
    response.assertStatus(204)

    const tokens = await student.related('tokens').query()

    console.log(tokens[0])

    assert.isNotEmpty(tokens)
  })

  test('it should return 422 when required data is not provided or data is invalid', async ({
    assert,
    client,
  }) => {
    const response = await client.post('/forgot-password').json({})
    response.assertStatus(422)

    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })

  test('it should be able reset password', async ({ assert, client }) => {
    const student = await StudentFactory.create()

    const { token } = await student.related('tokens').create({ token: 'token' })

    const response = await client
      .post('/reset-password')
      .json({ token, password: 'abcde123456789' })
    response.assertStatus(204)

    await student.refresh()

    const checkPassword = await Hash.verify(student.password, 'abcde123456789')

    assert.isTrue(checkPassword)
  })

  test('reset-passord: it should return 422 when required data is not provided or data is invalid', async ({
    client,
    assert,
  }) => {
    const response = await client.post('/reset-password').json({})
    response.assertStatus(422)
  })

  test('it should return 404 when using the same token twice', async ({ client, assert }) => {
    const student = await StudentFactory.create()

    const { token } = await student.related('tokens').create({ token: 'token' })

    const response = await client
      .post('/reset-password')
      .json({ token, password: 'abcde123456789' })
    response.assertStatus(204)

    const response2 = await client.post('/reset-password').json({ token, password: '12345678' })

    assert.equal(response2.body().code, 'BAD_REQUEST')
    assert.equal(response2.body().status, 404)
  })

  test('it cannot reset password when token is expired after 2 hours', async ({
    assert,
    client,
  }) => {
    const student = await StudentFactory.create()

    const date = DateTime.now().minus(Duration.fromISOTime('02:01')) // Agora eu tenho a data de 2 horas e 1 minuto atrás em que meu token vai estar expirado

    const { token } = await student.related('tokens').create({ token: 'token', createdAt: date })

    const response = await client
      .post('/reset-password')
      .json({ token, password: 'abcde123456789' })
    response.assertStatus(410)

    assert.equal(response.body().code, 'TOKEN_EXPIRED')
    assert.equal(response.body().status, 410)
    assert.equal(response.body().message, 'token has expired')
  })
})
