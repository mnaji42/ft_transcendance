import Backbone from 'backbone'

export default class UserModel extends Backbone.Model {
  urlRoot = '/api/v1/users'
}
