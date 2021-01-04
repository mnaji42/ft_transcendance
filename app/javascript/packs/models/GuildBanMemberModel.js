import Backbone from 'backbone'

export default class GuildBanMemberModel extends Backbone.Model {
  url = '/api/v1/guild_manage/ban_member'
}
