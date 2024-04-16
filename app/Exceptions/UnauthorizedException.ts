import { Exception } from '@adonisjs/core/build/standalone'

export default class UnauthorizedException extends Exception {
  constructor(message: string = "You're not authorized to perform this action.") {
    super(message, 401, 'E_UNAUTHORIZED')
  }
}
