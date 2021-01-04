import Backbone from 'backbone'

export default class GuildAddMemberModel extends Backbone.Model {
  url = '/api/v1/guild_manage/add_member'
}
