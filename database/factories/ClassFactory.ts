import Class from 'App/Models/Class'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Class, ({ faker }) => {
  return {
    name: 'Tec. em Sistemas de Internet 2022.2',
    year: '2022',
    period: '2',
    shift: 'vespertino',
    courseId: 1,
  }
}).build()
