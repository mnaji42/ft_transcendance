import Backbone from 'backbone'

export default class RemoveGAuthModel extends Backbone.Model {
  url = '/api/v1/auth/removeGAuth'
}
