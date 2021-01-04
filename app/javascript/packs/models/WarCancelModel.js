import Backbone from 'backbone'

export default class WarCancelModel extends Backbone.Model {
  url = '/api/v1/guild_manage/cancel_war'
}
