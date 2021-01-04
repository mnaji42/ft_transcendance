import Backbone from 'backbone'

export default class ChatRoomLeaveModel extends Backbone.Model {
  urlRoot = '/api/v1/chat_room/leave'
}
