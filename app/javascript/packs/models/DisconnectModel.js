import Backbone from 'backbone'

export default class DisconnectModel extends Backbone.Model {
  url = '/api/v1/auth/disconnect'
}
