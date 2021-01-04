import Backbone from 'backbone'

export default class DirectMessageModel extends Backbone.Model {
  url = '/api/v1/chat_room/direct_message'
}
