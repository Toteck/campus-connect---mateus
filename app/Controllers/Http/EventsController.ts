import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateEventValidator from 'App/Validators/CreateEventValidator'
import Event from 'App/Models/Event'
import { DateTime } from 'luxon'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Class from 'App/Models/Class'
import SendEventValidator from 'App/Validators/SendEventValidator'

export default class EventsController {
  public async store({ response, request }: HttpContextContract) {
    const eventPayload = await request.validate(CreateEventValidator)

    // Busco no banco de dados se já existe um evento com esse título
    const eventByTitle = await Event.findBy('title', eventPayload.title)

    if (eventByTitle) {
      throw new BadRequestException('Title is already being used by another event', 409)
    }

    const event = await Event.create(eventPayload)

    // Associa o evento às classes

    await event.load('publisherUser')

    return response.created({ event })
  }

  public async sendEvent({ response, request }: HttpContextContract) {
    const { ['event_id']: eventId, ['class_id']: classIds } =
      await request.validate(SendEventValidator)

    const event = await Event.findOrFail(eventId)
    for (const classId of classIds) {
      const classe = await Class.findOrFail(classId)
      await event.related('classes').attach([classe.id])
    }
    // const classe = await Class.findOrFail(classId)
    // await event.related('classes').attach([classe.id])
    await event.load('classes')
    await event.load('publisherUser')

    return response.created({ event })
  }

  public async update({ request, response }: HttpContextContract) {
    // ID para encontrar o evento
    const id = request.param('id')

    // Informações para atualizar o evento
    const payload = request.all()

    // Encontramos o evento pelo ID
    const event = await Event.findOrFail(id)

    // Verifica se há outro evento com o mesmo título
    const existingEvent = await Event.query()
      .where('title', payload.title)
      .whereNot('id', id)
      .first()

    if (existingEvent) {
      throw new BadRequestException('Title is already being used by another event', 409)
    }

    // Realiza a atualização do evento
    const updatedEvent = await event.merge(payload).save()

    return response.ok({ event: updatedEvent })
  }

  public async index({ request, response }: HttpContextContract) {
    const { text, ['category']: category } = request.qs()

    const page = request.input('page', 1)
    const limit = request.input('limit', 5)

    const eventsQuery = this.filterByQueryString(category, text) // Quando pegamos esse resultado sem o await está sendo retornado uma query de busca
    const events = await eventsQuery.paginate(page, limit)

    return response.ok({ events })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')

    const group = await Event.findOrFail(id)

    await group.delete()

    return response.ok({})
  }

  private filterByQueryString(category: string, text: string) {
    if (category && text) return this.filterByCategoryAndText(category, text)
    else if (category) return this.filterByCategory(category)
    else if (text) return this.filterByText(text)
    else return this.all()
  }

  private all() {
    return Event.query()
  }

  private filterByCategory(category: string) {
    return Event.query().where('category', category)
  }

  private filterByText(text: string) {
    return Event.query()
      .where('title', 'LIKE', `%${text}%`)
      .orWhere('description', 'LIKE', `%${text}%`)
  }

  private filterByCategoryAndText(category: string, text: string) {
    let query = Event.query()

    if (category) {
      query = query.where('category', category)
    }

    if (text) {
      query = query.where((builder) => {
        builder.where('title', 'LIKE', `%${text}%`).orWhere('description', 'LIKE', `%${text}%`)
      })
    }

    return query
  }
}
