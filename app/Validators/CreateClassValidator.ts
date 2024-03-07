import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateClassValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}),
    year: schema.string({}),
    period: schema.string({}),
    shift: schema.string({}),
    courseId: schema.number(),
  })

  public messages: CustomMessages = {
    'name.required': 'O nome é obrigatório',
    'year.required': 'O ano é obrigatório',
    'period.required': 'O período é obrigatório',
    'shift.required': 'O turno é obrigatório',
    'courseId.required': 'O curso da turma é obrigatório',
  }
}
