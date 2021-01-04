import Backbone from 'backbone'

export default class WarAbandonModel extends Backbone.Model {
  url = '/api/v1/guild_manage/abandon_war'
}
