import Backbone from 'backbone'

export default class CurrentUserModel extends Backbone.Model {
  url = '/api/v1/me'
}
