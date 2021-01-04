import Backbone from 'backbone'

export default class WarDeclineModel extends Backbone.Model {
  url = '/api/v1/guild_manage/decline_war'
}
