import Backbone from 'backbone'

export default class ChatRoomJoinModel extends Backbone.Model {
  urlRoot = '/api/v1/chat_room/join'
}
