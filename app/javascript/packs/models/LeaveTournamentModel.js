import Backbone from 'backbone'

export default class LeaveTournamentModel extends Backbone.Model {
  url = '/api/v1/tournament_games/leave'
}
