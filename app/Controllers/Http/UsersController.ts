import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'

export default class UsersController {
  public async store({ response, request }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator)

    const user = await User.create(userPayload)

    return response.created({ user })
  }
}
