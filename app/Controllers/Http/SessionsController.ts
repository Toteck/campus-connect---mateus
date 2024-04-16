import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SessionsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])
    try {
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '2hours',
      })
      return response.created({ user: auth.user, token })
    } catch (error) {
      return response.badRequest({ message: 'The provided email or password is incorrect' })
    }
  }

  public async destroy({ response, auth }: HttpContextContract) {
    await auth.logout()

    return response.ok({})
  }
}
