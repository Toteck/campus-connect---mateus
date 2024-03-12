import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateEventValidator from 'App/Validators/CreateEventValidator'
import Event from 'App/Models/Event'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Class from 'App/Models/Class'
import SendEventValidator from 'App/Validators/SendEventValidator'
import Course from 'App/Models/Course'
import SendToCourseValidator from 'App/Validators/SendToCourseValidator'
import SendToUserValidator from 'App/Validators/SendToUserValidator'
import User from 'App/Models/User'

export default class EventsController {
  public async store({ response, request }: HttpContextContract) {
    const eventPayload = await request.validate(CreateEventValidator)

    // Busco no banco de dados se já existe um evento com esse título
    const eventByTitle = await Event.findBy('title', eventPayload.title)

    if (eventByTitle) {
      throw new BadRequestException('Title is already being used by another event', 409)
    }

    if (eventPayload.category === 'edital' && eventPayload.status === undefined) {
      throw new BadRequestException('Notice-type events must have a status', 422)
    }

    const event = await Event.create(eventPayload)

    // Associa o evento às classes

    await event.load('publisherUser')

    return response.created({ event })
  }

  public async sendEventToClass({ response, request }: HttpContextContract) {
    const { ['event_id']: eventsIds, ['class_id']: classIds } =
      await request.validate(SendEventValidator)

    const events: Event[] = [] // Array para armazenar os eventos

    for (const eventId of eventsIds) {
      // 1) Verifico se o evento existe
      const event = await Event.findOrFail(eventId)

      for (const classId of classIds) {
        // 2) Atribuo o evento as turmas
        const classe = await Class.findOrFail(classId)
        await event.related('classes').attach([classe.id])
      }
      // Carrego os relacionamentos do evento
      await event.load('classes')
      await event.load('publisherUser')
      events.push(event) // Adiciona o evento ao array de eventos
    }

    return response.created({ events })
  }

  public async sendEventByCourse({ response, request }: HttpContextContract) {
    const { ['events_id']: eventsIds, ['courses_id']: coursesIds } =
      await request.validate(SendToCourseValidator)

    const events: Event[] = [] // Array para armazenar os eventos

    for (const eventId of eventsIds) {
      // 1) Verifico se o evento existe
      const event = await Event.findOrFail(eventId)

      for (const courseId of coursesIds) {
        // Verifico se o curso existe
        const course = await Event.findOrFail(courseId)

        // Busca todas as turmas associadas ao curso especificado
        const classes = await Class.query().where('course_id', course.id)

        // Se não encontrar turmas, pode optar por devolver um erro ou apenas finalizar a função
        if (classes.length === 0) {
          throw new BadRequestException('No classes found for the specified course', 404)
        }

        // Para cada turma encontrada, associa o evento
        for (const classe of classes) {
          await event.related('classes').attach([classe.id])
        }
        // Carrega os relacionamentos para resposta
        await event.load('classes')
        await event.load('publisherUser')
      }

      events.push(event) // Adiciona o evento ao array de eventos
    }

    // Devolve a lista de eventos com as turmas atualizadas
    return response.ok({ events })
  }

  public async sendEventByUser({ response, request }: HttpContextContract) {
    const { ['events_ids']: eventsIds, ['users_ids']: usersIds } =
      await request.validate(SendToUserValidator)

    console.log(eventsIds, usersIds)

    const events: Event[] = [] // Array para armezenar os eventos
    const users: User[] = [] // Array para armezenar os eventos

    for (const eventId of eventsIds) {
      const event = await Event.findOrFail(eventId)

      for (const userId of usersIds) {
        const user = await User.findOrFail(userId)

        await user.related('events').attach([event.id])

        // await user.load('events')

        //events.push(event)
      }
      await event.load('users')
      events.push(event)
      //users.push(event)
    }

    return response.created({ events })
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
