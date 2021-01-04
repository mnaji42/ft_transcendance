import Backbone from 'backbone'

export default class ValidateGAuthModel extends Backbone.Model {
  url = '/api/v1/auth/validateGAuth'
}
