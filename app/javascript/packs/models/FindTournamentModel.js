import Backbone from 'backbone'

export default class FindTournamentModel extends Backbone.Model {
  url = '/api/v1/tournament_games/find'
}
