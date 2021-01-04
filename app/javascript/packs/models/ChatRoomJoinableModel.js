import Backbone from 'backbone'

export default class ChatRoomJoinableModel extends Backbone.Model {
  url = '/api/v1/chat_room/joinable'
}
