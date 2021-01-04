import Backbone from 'backbone'

export default class ChatRoomToggleAdminModel extends Backbone.Model {
  urlRoot = '/api/v1/chat_room/toggle_admin'
}
