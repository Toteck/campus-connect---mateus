import Event from 'App/Models/Event'
import Factory from '@ioc:Adonis/Lucid/Factory'
import { DateTime } from 'luxon'

// Definindo explicitamente o tipo do array para corresponder aos valores aceitos pela categoria
const categories: ('notícia' | 'edital' | 'evento' | 'reunião')[] = [
  'notícia',
  'edital',
  'evento',
  'reunião',
]

const status: ('andamento' | 'concluído' | 'suspenso' | undefined)[] = [
  'andamento',
  'concluído',
  'suspenso',
  undefined,
]

export default Factory.define(Event, ({ faker }) => {
  return {
    title: faker.lorem.lines(1),
    description: faker.lorem.sentence(),
    // Aqui nós garantimos que o arrayElement retorne especificamente um dos tipos aceitos,
    // o que deve eliminar o erro do TypeScript
    category: faker.helpers.arrayElement(categories) as 'notícia' | 'edital' | 'evento' | 'reunião',
    status: faker.helpers.arrayElement(status) as
      | 'andamento'
      | 'concluído'
      | 'suspenso'
      | undefined,
    thumbnail: faker.internet.url(),
    anexo: [faker.internet.url().toString()],
  }
}).build()
