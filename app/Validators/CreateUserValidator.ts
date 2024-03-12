import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}),
    register: schema.string({}),
    email: schema.string.optional({}, [rules.email()]),
    password: schema.string({}, [rules.minLength(8)]),
    profile: schema.enum(['student', 'parent', 'server adm', 'professor'] as const),
    photo: schema.string.optional({}, [rules.url()]),
  })

  public messages: CustomMessages = {
    'name.required': 'O nome é obrigatório',
    'register.required': 'O registro é obrigatório',
    'email.email': 'O e-mail deve ser um endereço de e-mail válido',
    'password.required': 'A senha é obrigatória',
    'password.minLength': 'A senha deve ter pelo menos 8 caracteres',
    'profile.enum': 'O perfil deve ser um dos seguintes: student, parent, server adm, professor',
  }
}
