import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SendToUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    events_ids: schema.array().members(schema.number()),
    users_ids: schema.array().members(schema.number()),
  })

  public messages: CustomMessages = {}
}
