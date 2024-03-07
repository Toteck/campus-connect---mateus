import Course from 'App/Models/Course'
import Factory from '@ioc:Adonis/Lucid/Factory'

export default Factory.define(Course, ({ faker }) => {
  return {
    degree: 'superior',
    name: 'Sistemas de Internet',
  }
}).build()
