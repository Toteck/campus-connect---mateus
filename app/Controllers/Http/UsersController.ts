import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async store({ response, request }: HttpContextContract) {
    const userPayload = await request.validate(CreateUserValidator)

    const user = await User.create(userPayload)

    return response.created({ user })
  }

  public async update({ response, request }: HttpContextContract) {
    // Para atualizar o usuário é necessário
    const { email, password } = await request.validate(UpdateUserValidator)
    // ID para encontrar o evento
    const id = request.param('id')

    // Encontramos o usuário pelo ID
    const user = await User.findOrFail(id)

    // Informações para atualizar o evento
    const payload = request.all()

    const userByEmail = await User.query().where('email', email).whereNot('id', user.id).first()

    if (userByEmail) {
      throw new BadRequestException('Email already in use by another user', 409)
    }

    if (payload.register) {
      const userByRegister = await User.query()
        .where('register', payload.register)
        .whereNot('id', user.id)
        .first()

      if (userByRegister) {
        throw new BadRequestException('Register already in use by another user', 409)
      }
    }

    // Realiza a atualização do evento
    const updatedUser = await user.merge(payload).save()

    return response.ok({ user: updatedUser })
  }
}
