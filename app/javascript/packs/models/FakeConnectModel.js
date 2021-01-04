import Backbone from 'backbone'

export default class FakeConnectModel extends Backbone.Model {
  url = '/api/v1/auth/fake_connect'
}
