/* eslint-disable prettier/prettier */
import Mail from '@ioc:Adonis/Addons/Mail'
import Database from '@ioc:Adonis/Lucid/Database'
import { assert } from '@japa/preset-adonis'
import { test } from '@japa/runner'
import StudentFactory from 'Database/factories/StudentFactory'

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
})
