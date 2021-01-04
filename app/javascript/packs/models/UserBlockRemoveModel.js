import Backbone from 'backbone'

export default class UserBlockRemoveModel extends Backbone.Model {
  url = '/api/v1/block/remove'
}
