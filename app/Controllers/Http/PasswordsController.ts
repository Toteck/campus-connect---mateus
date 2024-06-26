import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import { randomBytes } from 'crypto'
import { promisify } from 'util'
import ForgotPassword from 'App/Validators/ForgotPasswordValidator'
import ResetPassword from 'App/Validators/ResetPasswordValidator'
import TokenExpired from 'App/Exceptions/TokenExpiredException'

export default class PasswordsController {
  public async forgotPassword({ request, response }: HttpContextContract) {
    const { email, resetPasswordUrl } = await request.validate(ForgotPassword)

    const user = await User.findByOrFail('email', email)

    const random = await promisify(randomBytes)(24)

    const token = random.toString('hex')

    await user.related('tokens').updateOrCreate({ userId: user.id }, { token })

    const resetPasswordUrlWithToken = `${resetPasswordUrl}?token=${token}`

    await Mail.send((message) => {
      message
        .from('no-reply@campusconnect.com')
        .to(email)
        .subject('CampusConnect: Recuperação de senha')
        .htmlView('email/forgotpassword', {
          productName: 'CampusConnect',
          name: user.name,
          resetPasswordUrl: resetPasswordUrlWithToken,
        })
    })
    return response.noContent()
  }

  public async resetPassword({ request, response }: HttpContextContract) {
    const { token, password } = await request.validate(ResetPassword)

    const userByToken = await User.query()
      .whereHas('tokens', (query) => {
        query.where('token', token)
      })
      .preload('tokens')
      .firstOrFail()

    await userByToken.load('tokens')
    const tokenAge = Math.abs(userByToken.tokens[0].createdAt.diffNow('hours').hours)

    if (tokenAge > 2) {
      throw new TokenExpired()
    }

    userByToken.password = password

    await userByToken.save()

    await userByToken.tokens[0].delete()

    return response.noContent()
  }
}
