import Backbone from 'backbone'

export default class ChatRoomJoinedModel extends Backbone.Model {
  url = '/api/v1/chat_room/joined'
}
