import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import { DateTime } from 'luxon'
import Application from '@ioc:Adonis/Core/Application'
import Asset from 'App/Models/Asset'
import Drive from '@ioc:Adonis/Core/Drive'
import fs from 'fs'
export default class AssetsController {
  public async store({ request, response }: HttpContextContract) {
    const image = request.file('file')
    const { eventId } = request.only(['eventId'])
    if (!image) {
      throw new BadRequestException('No file was uploaded')
    }

    const options = {
      visibility: 'public', // Define a visibilidade do arquivo (pública)
      contentType: image.headers['content-type'], // Define o tipo de conteúdo da imagem
    }

    try {
      // Lê os dados do arquivo
      const imageName = DateTime.now().toFormat('yyyyLLddHHmmss') + '.' + image!.extname

      const fileStream = fs.createReadStream(image.tmpPath!)
      await Drive.putStream(imageName, fileStream, options)

      const asset = await Asset.create({
        filename: imageName,
      })

      if (eventId) await asset.related('events').attach(eventId)

      return response.json({ isSuccess: true, status: 'Image was successfully uploaded', asset })
    } catch (error) {
      console.error(error)
      return response.status(500).send({ error: 'Failed to upload image' })
    }
  }

  public async destroy({ request, response, params }: HttpContextContract) {
    const asset = await Asset.findOrFail(params.id)

    await asset.related('events').detach()
    await asset.delete()

    return response.status(200).json({
      status: 200,
      message: 'Image has been successfully deleted',
    })
  }
}
