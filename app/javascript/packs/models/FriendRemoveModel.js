import Backbone from 'backbone'

export default class FriendRemoveModel extends Backbone.Model {
  url = '/api/v1/friend/remove'
}
