import Backbone from 'backbone'

export default class ChatRoomMuteModel extends Backbone.Model {
  urlRoot = '/api/v1/chat_room/mute'
}
