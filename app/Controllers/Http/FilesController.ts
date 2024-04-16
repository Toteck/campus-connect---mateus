import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import fs from 'fs'
import Drive from '@ioc:Adonis/Core/Drive'

export default class FilesController {
  public async upload({ request, response }: HttpContextContract) {
    const image = request.file('image')
    if (image !== null) {
      const fileName = `${Date.now()}.${image.extname}`
      const fileStream = fs.createReadStream(image.tmpPath!)
      await Drive.putStream(fileName, fileStream, {
        contentType: image.headers['content-type'],
      })
    }
  }

  public async getImageUrl({ params, response }: HttpContextContract) {
    const filePath = 'public/images' + params.name + '.png'
    const url = await Drive.getSignedUrl(filePath)
    return response.ok({ url: 'http://localhost:3333' + url })
  }
}
