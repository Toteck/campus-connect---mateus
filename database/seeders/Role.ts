import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
  public async run() {
    await Role.createMany([
      {
        id: 1,
        name: 'Estudante',
        description: 'Estudante',
      },
      {
        id: 2,
        name: 'Professor',
        description: 'Professor',
      },
      {
        id: 3,
        name: 'Pais',
        description: 'Responsável por aluno',
      },
      {
        id: 4,
        name: 'Admin',
        description: 'Super User',
      },
    ])
  }
}
