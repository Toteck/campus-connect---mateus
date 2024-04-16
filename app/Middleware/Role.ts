import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UnauthorizedException from 'App/Exceptions/UnauthorizedException'
import RoleEnum from 'App/Enums/Role'

export default class Role {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>, guards: string[]) {
    const guardRoleIds = guards.map((k) => RoleEnum[k.toUpperCase()])

    if (!guardRoleIds.includes(auth.user?.roleId)) {
      throw new UnauthorizedException()
    }
    await next()
  }
}
