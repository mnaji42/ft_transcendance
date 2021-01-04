import Backbone from 'backbone'

export default class GuildQuitModel extends Backbone.Model {
  url = '/api/v1/guild_manage/quit'
}
