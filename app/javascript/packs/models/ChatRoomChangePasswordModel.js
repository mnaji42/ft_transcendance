import Backbone from 'backbone'

export default class ChatRoomChangePasswordModel extends Backbone.Model {
  urlRoot = '/api/v1/chat_room/change_password'
}
