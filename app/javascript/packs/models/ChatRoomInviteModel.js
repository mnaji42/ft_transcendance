import Backbone from 'backbone'

export default class ChatRoomInviteModel extends Backbone.Model {
  url = '/api/v1/chat_room/invite'
}
