/* eslint-disable prettier/prettier */
import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import AdmFactory from 'Database/factories/AdmFactory'
import ClassFactory from 'Database/factories/ClassFactory'
import CourseFactory from 'Database/factories/CourseFactory'
import EventFactory from 'Database/factories/EventFactory'
import StudentFactory from 'Database/factories/StudentFactory'

test.group('Events', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it should create an event', async ({ client }) => {
    const userAdm = await AdmFactory.create()
    const student = await StudentFactory.create()
    const course = await CourseFactory.create()
    const sistemasParaInternet = await ClassFactory.merge({ courseId: course.id }).create()

    const eventPayload = {
      title:
        'Edital nº 4/2024 - Seleção de Alunas para o Programa Mulheres MIL - Gestor de Microempresas 2024',
      description:
        'Seleção de Alunas para o Curso de Formação Inicial e Continuada (FIC) de GESTOR DE MICROEMPRESA do Programa Mulheres Mil.',
      date: '2024-01-31',
      category: 'edital',
      anexo: [
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTQ5MWYyMmUxYjFmMDNmODUyNjk3ZTA2Njc2MDRmY1t8XTAwM19TZWxldGl2b19BbHVub19UTU5fNF8yMDI0LnBkZg==',
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTIyMDlhMDNiY2QwZWMzYzA4OTc2ZGZmMGU1MzE5N1t8XTAwMl9TZWxldGl2b19BbHVub19UTU5fNF8yMDI0LnBkZg==',
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQWNhYzEyZGU3ZDhiNzBhOGJhMWY1MzM1YzkzZDRlZVt8XTAwMV9TZWxldGl2b19BbHVub19UTU5fNF8yMDI0LnBkZg==',
      ],
      publisher: userAdm.id,
    }

    // Primeiro cria o evento
    const response = await client.post('/events').json(eventPayload).loginAs(userAdm)

    response.assertStatus(201)
    console.log(response.body().event)
  })

  test('it should create an event and send it to the classes', async ({ client }) => {
    const userAdm = await AdmFactory.create()
    const student = await StudentFactory.create()
    const course = await CourseFactory.create()
    const course2 = await CourseFactory.merge({
      degree: 'médio técnico',
      name: 'Administração',
    }).create()
    console.log({ course2 })
    // const sistemasParaInternet = await ClassFactory.merge({ courseId: course.id }).create()
    // const administracao = await ClassFactory.merge({ courseId: course2.id }).create()

    // const eventPayload = {
    //   title:
    //     'Edital nº 4/2024 - Seleção de Alunas para o Programa Mulheres MIL - Gestor de Microempresas 2024',
    //   description:
    //     'Seleção de Alunas para o Curso de Formação Inicial e Continuada (FIC) de GESTOR DE MICROEMPRESA do Programa Mulheres Mil.',
    //   date: '2024-01-31',
    //   category: 'edital',
    //   anexo: [
    //     'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTQ5MWYyMmUxYjFmMDNmODUyNjk3ZTA2Njc2MDRmY1t8XTAwM19TZWxldGl2b19BbHVub19UTU5fNF8yMDI0LnBkZg==',
    //     'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTIyMDlhMDNiY2QwZWMzYzA4OTc2ZGZmMGU1MzE5N1t8XTAwMl9TZWxldGl2b19BbHVub19UTU5fNF8yMDI0LnBkZg==',
    //     'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQWNhYzEyZGU3ZDhiNzBhOGJhMWY1MzM1YzkzZDRlZVt8XTAwMV9TZWxldGl2b19BbHVub19UTU5fNF8yMDI0LnBkZg==',
    //   ],
    //   publisher: userAdm.id,
    // }

    // // Primeiro cria o evento
    // const response = await client.post('/events').json(eventPayload).loginAs(userAdm)
    // response.assertStatus(201)

    // // Envia o evento para as turmas
    // // evento e turmas que eu vou enviar
    // const eventsToClasses = {
    //   event_id: response.body().event.id,
    //   class_id: [sistemasParaInternet.id, administracao.id],
    // }
    // const response2 = await client
    //   .post(`/events/send/${response.body().event.id}`)
    //   .json(eventsToClasses)
    //   .loginAs(userAdm)
    // response2.assertStatus(201)
    // console.log(response2.body().event)
  })

  test('it should try to create an event with an already existing title', async ({
    client,
    assert,
  }) => {
    const user = await AdmFactory.create()
    const eventPayload = {
      title:
        'Edital nº 12 - Processo Seletivo Simplificado para Monitoria nos Cursos de Graduação - IFMA TIMON',
      description:
        'Processo Seletivo Simplificado para o Programa de Monitoria referente ao primeiro semestre de 2024 para os Cursos Superiores do IFMA Campus Timon.',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response = await client.post('/events').json(eventPayload).loginAs(user)
    response.assertStatus(201)

    // Tentando criar outro evento com o mesmo título
    const eventPayload2 = {
      title:
        'Edital nº 12 - Processo Seletivo Simplificado para Monitoria nos Cursos de Graduação - IFMA TIMON',
      description:
        'Processo Seletivo Simplificado para o Programa de Monitoria referente ao primeiro semestre de 2024 para os Cursos Superiores do IFMA Campus Timon.',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response2 = await client.post('/events').json(eventPayload2).loginAs(user)

    response2.assertStatus(409)

    const body = response2.body()
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  // Implementação do teste para tentar atualizar um evento
  test('it should update an event', async ({ client, assert }) => {
    const event = await EventFactory.create()
    const user = await AdmFactory.create()
    const eventPayload = {
      title: 'test',
      description: 'test',
      date: '2024-02-01',
      category: 'edital',
    }

    const response = await client.patch(`/events/${event.id}`).json(eventPayload).loginAs(user)

    const body = response.body()

    response.assertStatus(200)
    assert.exists(body.event, 'Event undefined')
    assert.equal(body.event.title, eventPayload.title)
    assert.equal(body.event.description, eventPayload.description)
    assert.equal(body.event.date, eventPayload.date)
    assert.equal(body.event.category, eventPayload.category)
  })

  // Implementação do teste para tentar atualizar um evento com outro título já existente em outro evento.
  test('should try to update an event with an already existing title in another event', async ({
    client,
    assert,
  }) => {
    const event = await EventFactory.create()
    const event2 = await EventFactory.create()
    const user = await AdmFactory.create()

    // Iremos tentar atualizar o evento 1 com o título do evento 2.
    // Deve ocorrer um erro informando que o título está sendo utilizado por outro evento!
    const eventPayload = {
      title: event2.title,
      description: 'test',
      date: '2024-02-01',
      category: 'edital',
    }

    const response = await client.patch(`/events/${event.id}`).json(eventPayload).loginAs(user)

    const body = response.body()

    response.assertStatus(409)
    assert.exists(body.message)
    assert.exists(body.code)
    assert.exists(body.status)
    assert.equal(body.code, 'BAD_REQUEST')
    assert.equal(body.status, 409)
  })

  // Retorna todos os eventos
  test('it should return all events', async ({ client, assert }) => {
    const admUser = await AdmFactory.create()
    const student = await StudentFactory.create()

    for (let i = 0; i < 6; i++) {
      await EventFactory.create()
    }

    const response = await client.get('/events').loginAs(student)

    response.assertStatus(200)

    console.log(response.body())
    console.log(response.body().events.data)
  })

  // Retorna todos os eventos por título
  test('it should return all events by title', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    // Criação de um evento
    const eventPayload = {
      title:
        'Edital nº 12 - Processo Seletivo Simplificado para Monitoria nos Cursos de Graduação - IFMA TIMON',
      description: 'teste',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response = await client.post('/events').json(eventPayload).loginAs(user)
    response.assertStatus(201)

    // Criação de um evento
    const eventPayload2 = {
      title: 'Edital nº 10 - Processo Seletivo Qualquer coisa - IFMA TIMON',
      description: 'qualquer coisa',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response2 = await client.post('/events').json(eventPayload2).loginAs(user)
    response2.assertStatus(201)

    // Busca do evento pelo título "Monitoria"
    const response3 = await client.get(`/events?text=Monitoria`).loginAs(user)
    response3.assertStatus(200)

    console.log(response3.body())
  })

  // Retorna todos os eventos por descrição
  test('it should return all events by description', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    // Criação de um evento
    const eventPayload = {
      title:
        'Edital nº 12 - Processo Seletivo Simplificado para Monitoria nos Cursos de Graduação - IFMA TIMON',
      description: 'teste',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response = await client.post('/events').json(eventPayload).loginAs(user)
    response.assertStatus(201)

    // Criação de um evento
    const eventPayload2 = {
      title: 'Edital nº 10 - Processo Seletivo - IFMA TIMON',
      description: 'qualquer coisa',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response2 = await client.post('/events').json(eventPayload2).loginAs(user)
    response2.assertStatus(201)

    // Busca do evento pelo título "Monitoria"
    const response3 = await client.get(`/events?text=qualquer coisa`).loginAs(user)
    response3.assertStatus(200)

    console.log(response3.body())
  })

  // Retorna todos os eventos por categoria
  test('it should return all events by category', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    for (let i = 0; i < 3; i++) {
      await EventFactory.merge({ category: 'notícia' }).create()
    }

    for (let i = 0; i < 3; i++) {
      await EventFactory.merge({ category: 'edital' }).create()
    }

    const response = await client.get(`/events?category=edital`).loginAs(user)

    response.assertStatus(200)

    console.log(response.body())
  })

  // Retorna todos os eventos por categoria e título ou descrição
  test('it should return all events by category and title or description', async ({
    client,
    assert,
  }) => {
    const user = await AdmFactory.create()
    // Criação de um evento
    const eventPayload = {
      title:
        'Edital nº 12 - Processo Seletivo Simplificado para Monitoria nos Cursos de Graduação - IFMA TIMON',
      description: 'teste',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response = await client.post('/events').json(eventPayload).loginAs(user)
    response.assertStatus(201)

    // Criação de outro evento
    const eventPayload2 = {
      title: 'Edital nº 10 - Processo Seletivo - IFMA TIMON',
      description: 'qualquer coisa',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response2 = await client.post('/events').json(eventPayload2).loginAs(user)
    response2.assertStatus(201)

    // Busca do evento pelo título "Monitoria" na categoria edital
    const response3 = await client.get(`/events?category=edital&text=monitoria`).loginAs(user)
    response3.assertStatus(200)

    console.log(response3.body())
  })

  // Deve deletar um evento
  test('it should delete an event', async ({ client, assert }) => {
    const user = await AdmFactory.create()
    const eventPayload = {
      title:
        'Edital nº 12 - Processo Seletivo Simplificado para Monitoria nos Cursos de Graduação - IFMA TIMON',
      description:
        'Processo Seletivo Simplificado para o Programa de Monitoria referente ao primeiro semestre de 2024 para os Cursos Superiores do IFMA Campus Timon.',
      date: '2024-02-01',
      category: 'edital',
      thumbnail: 'https://portal.ifma.edu.br/wp-content/uploads/2024/02/CERTEC-Parceria-EBC-5.jpg',
      anexo:
        'https://portal.ifma.edu.br/concursos-e-seletivos/?d=KyMzdWRdMEtRIkMmUENcRX5oc0B6RHxGZFdEQUNHVXNTRVBBUkFET1JASUZNQTAyMTE1M2FlZmJiMzg1YWNhZjk2MzkzNTIxMWQ3M1t8XTAwMV9TZWxldGl2b19BbHVub19UTU5fMTJfMjAyNC5wZGY=',
    }

    const response = await client.post('/events').json(eventPayload).loginAs(user)
    response.assertStatus(201)

    const event = response.body().event

    const response2 = await client.delete(`/events/${event.id}`).loginAs(user)

    response2.assertStatus(200)

    // Como nossa API não retorna nada precisamos verificar no banco de dados se foi removida
    const emptyEvent = await Database.query().from('events').where('id', event.id)

    assert.isEmpty(emptyEvent)
  })

  test('it should return 404 when providing an unexisting group for deletion', async ({
    client,
    assert,
  }) => {
    const user = await AdmFactory.create()
    const response = await client.delete(`/events/1`).loginAs(user)
    response.assertStatus(404)

    console.log(response.body())
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, '404')
  })
})
