/* eslint-disable prettier/prettier */
import User from 'App/Models/User'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(User, ({ faker }) => {
  return {
    name: 'Mateus Weslley de Oliveira Freitas',
    register: '20222ADM.TMN0011',
    email: 'mateusweslley@acad.ifma.edu.br',
    password: faker.internet.password({ length: 8 }),
    profile: 'server adm' as const,
    photo: faker.image.url(),
  }
}).build()
