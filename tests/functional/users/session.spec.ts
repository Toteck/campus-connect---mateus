/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import AdmFactory from 'Database/factories/AdmFactory'

test.group('Session', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should authenticate an adm user', async ({ client, assert }) => {
    const purePassword = 'test123456'

    const { id, email } = await AdmFactory.merge({ password: purePassword }).create()

    const response = await client.post('/sessions').json({ email, password: purePassword })
    response.assertStatus(201)
    console.log({ user: response.body().user })
    console.log({ user: response.body().token })
    assert.isDefined(response.body().user, 'User undefined')
    assert.equal(response.body().user.id, id)
  })

  test('it should return 400 when credentials are invalid', async ({ client, assert }) => {
    const { id, email } = await AdmFactory.create()

    const response = await client.post('/sessions').json({ email, password: 'test' })
    response.assertStatus(400)
    console.log(response.body())
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 400)
    assert.equal(response.body().message, 'invalid credentials')
  })

  test('it should return 200 when user signs out', async ({ client }) => {
    const plainPassword = 'test123456'

    const { email } = await AdmFactory.merge({ password: plainPassword }).create()

    // Fazendo o login
    const response = await client.post('/sessions').json({ email, password: plainPassword })

    // Pegamos o token
    const apiToken = response.body().token

    const response2 = await client
      .delete('/sessions')
      .header('Authorization', `Bearer ${apiToken.token}`)
    response2.assertStatus(200)
  })

  test('it should revoke token when user signs out', async ({ client, assert }) => {
    const plainPassword = 'test123456'

    const { email } = await AdmFactory.merge({ password: plainPassword }).create()

    // Fazendo o login
    const response = await client.post('/sessions').json({ email, password: plainPassword })
    response.assertStatus(201)

    // Pegamos o token

    const apiToken = response.body().token

    const tokenBeforeSignOut = await Database.query().select('*').from('api_tokens')

    console.log({ tokenBeforeSignOut })

    const response2 = await client
      .delete('/sessions')
      .header('Authorization', `Bearer ${apiToken.token}`)
    response2.assertStatus(200)

    const token = await Database.query().select('*').from('api_tokens')

    console.log({ token })

    assert.isEmpty(token)
  })
})
