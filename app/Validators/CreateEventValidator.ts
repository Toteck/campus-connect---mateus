import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateEventValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }),
    description: schema.string({ trim: true }),
    date: schema.date({}),
    category: schema.enum(['notícia', 'edital', 'evento', 'reunião'] as const),
    thumbnail: schema.string.optional(),
    anexo: schema.array().members(schema.string()),
    publisher: schema.number(),
  })

  public messages: CustomMessages = {
    'title.required': 'O título é obrigatório',
    'description.required': 'A descrição é obrigatório',
    'date.required': 'A data é obrigatória',
    'category.required': 'A categoria é obrigatória',
  }
}
