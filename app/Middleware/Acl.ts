import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Acl {
  public async handle(
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    allowedRules: string[]
  ) {
    const user = await auth.authenticate()

    if (!allowedRules.includes(user.profile)) {
      return response.unauthorized({ error: { meessage: 'access denied' } })
    }
    await next()
  }
}
