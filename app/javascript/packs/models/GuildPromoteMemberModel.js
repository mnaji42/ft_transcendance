import Backbone from 'backbone'

export default class GuildPromoteMemberModel extends Backbone.Model {
  url = '/api/v1/guild_manage/promote_member'
}
