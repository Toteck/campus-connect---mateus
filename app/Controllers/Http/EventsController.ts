import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateEventValidator from 'App/Validators/CreateEventValidator'
import Event from 'App/Models/Event'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Drive from '@ioc:Adonis/Core/Drive'
import fs from 'fs'

export default class EventsController {
  public async store({ response, request, auth }: HttpContextContract) {
    const eventPayload1 = await request.validate(CreateEventValidator)

    const publisherId = auth.user!.id

    const eventPayload = { ...eventPayload1, publisher: publisherId }

    //Busco no banco de dados se já existe um evento com esse título
    const eventByTitle = await Event.findBy('title', eventPayload.title)

    if (eventByTitle) {
      throw new BadRequestException('Title is already being used by another event', 409)
    }

    let thumbnailFileName: string | null = null
    if (eventPayload.thumbnail !== null) {
      const image = request.file('thumbnail')
      if (image) {
        const fileName = `${Date.now()}.${image.extname}`
        const fileStream = fs.createReadStream(image.tmpPath!)
        await Drive.putStream(fileName, fileStream, {
          contentType: image.headers['content-type'],
        })
        thumbnailFileName = fileName
      }
    }
    const event = await Event.create({ ...eventPayload, thumbnail: thumbnailFileName })
    // Associa o evento ao autor
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

  public async index({ request, response, params }: HttpContextContract) {
    const page = params.page ?? 1

    const events = await Event.query().paginate(page, 5)

    return response.ok({ events })
  }

  public async destroy({ request, response }: HttpContextContract) {
    const id = request.param('id')

    const group = await Event.findOrFail(id)

    await group.delete()

    return response.ok({})
  }
}
