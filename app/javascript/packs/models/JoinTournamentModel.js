import Backbone from 'backbone'

export default class JoinTournamentModel extends Backbone.Model {
  url = '/api/v1/tournament_games/join'
}
