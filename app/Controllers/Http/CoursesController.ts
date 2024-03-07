import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Course from 'App/Models/Course'
import CreateCourseValidator from 'App/Validators/CreateCourseValidator'

export default class CoursesController {
  public async index({ request, response }: HttpContextContract) {
    const { ['name']: name, ['degree']: degree } = request.qs()

    const page = request.input('page', 1)
    const limit = request.input('limit', 5)

    const coursesByQuery = this.filterByQueryString(degree, name)
    const courses = await coursesByQuery.paginate(page, limit)

    return response.ok({ courses })
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')

    const course = await Course.findOrFail(id)

    return response.ok({ course })
  }

  public async store({ response, request }: HttpContextContract) {
    // Validação dos dados passados na requisição
    const coursePayload = await request.validate(CreateCourseValidator)

    // Já esse existe um curso com esse nome?
    const courseByName = await Course.findBy('name', coursePayload.name)

    // Se sim então retorne 409
    if (courseByName) {
      throw new BadRequestException('There is already another course with that name', 409)
    }

    // Criação do curso
    const course = await Course.create(coursePayload)

    return response.created({ course })
  }

  public async update({ response, request }: HttpContextContract) {
    const id = request.param('id')

    const payload = request.all()

    const curso = await Course.findOrFail(id)

    const existingCourse = await Course.query()
      .where('name', payload.name)
      .whereNot('id', id)
      .first()

    if (existingCourse) {
      throw new BadRequestException('Name is already being used by another course', 409)
    }

    const updatedCourse = await curso.merge(payload).save()

    return response.ok({ course: updatedCourse })
  }

  public async destroy({ response, request }: HttpContextContract) {
    const id = request.param('id')
    const curso = await Course.findOrFail(id)
    await curso.delete()
    return response.ok({})
  }

  private filterByQueryString(degree: string, name: string) {
    if (degree && name) return this.filterByNameAndDegree(degree, name)
    else if (degree) return this.filterByDegree(degree)
    else if (name) return this.filterByName(name)
    else return this.all()
  }

  public async classesByCourse({ request, response }: HttpContextContract) {
    const courseId = request.param('id')

    // Encontrar o curso pelo ID
    const course = await Course.findOrFail(courseId)

    // Carregar todas as turmas associadas a este curso
    await course.load('classes')

    return response.ok({ classes: course.classes })
  }

  private all() {
    return Course.query()
  }

  private filterByDegree(degree: string) {
    return Course.query().where('degree', degree)
  }

  private filterByName(name: string) {
    return Course.query().where('name', 'LIKE', `%${name}%`)
  }

  private filterByNameAndDegree(degree: string, name: string) {
    return Course.query().where('degree', degree).andWhere('name', 'LIKE', `%${name}%`)
  }
}
