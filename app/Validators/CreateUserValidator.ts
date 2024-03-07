import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    name: schema.string({}),
    register: schema.string({}, [rules.minLength(16)]),
    email: schema.string.optional({}, [rules.email()]),
    password: schema.string({}, [rules.minLength(8)]),
    profile: schema.enum(['student', 'parent', 'server adm', 'professor'] as const),
    photo: schema.string({}, [rules.url()]),
  })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'name.required': 'O nome é obrigatório',
    'register.required': 'O registro é obrigatório',
    'email.email': 'O e-mail deve ser um endereço de e-mail válido',
    'password.required': 'A senha é obrigatória',
    'password.minLength': 'A senha deve ter pelo menos 8 caracteres',
    'profile.enum': 'O perfil deve ser um dos seguintes: student, parent, server adm, professor',
  }
}
