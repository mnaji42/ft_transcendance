import Backbone from 'backbone'

export default class GAuthModel extends Backbone.Model {
  url = '/api/v1/auth/gauthQR'
}
