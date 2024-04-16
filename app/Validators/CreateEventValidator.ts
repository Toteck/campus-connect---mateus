import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateEventValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string({ trim: true }),
    description: schema.string({ trim: true }),
    thumbnail: schema.file.optional(),
  })

  public messages: CustomMessages = {
    'title.required': 'O título é obrigatório',
    'description.required': 'A descrição é obrigatório',
    'date.required': 'A data é obrigatória',
    'category.required': 'A categoria é obrigatória',
  }
}

//anexo: schema.object.optional().members({ url: schema.string({}) })
