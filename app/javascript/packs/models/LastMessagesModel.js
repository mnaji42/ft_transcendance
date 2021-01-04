import Backbone from 'backbone'

export default class LastMessagesModel extends Backbone.Model {
  urlRoot = '/api/v1/last_messages'
}
