import Backbone from 'backbone'
import UserModel from '../models/UserModel'

export default class UserCollection extends Backbone.Collection {
  url = '/api/v1/users'
  model = UserModel
}
