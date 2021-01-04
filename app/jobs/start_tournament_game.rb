class StartTournamentGame < ApplicationJob
  queue_as :default
  sidekiq_options retry: 0

  def perform(tournament_game_id)
    tournament_game = TournamentGame.find_by(id: tournament_game_id)
    return unless tournament_game
    game_users = tournament_game.tournament_game_users.order(:pos_y)

    message = {
      :notification => 'started',
      :tournament_game => tournament_game,
      :tournament_game_users => tournament_game.tournament_game_users,
    }

    ActionCable.server.broadcast("tournament_#{tournament_game_id}", message)
    TournamentStartGames.set(wait: 10.seconds).perform_later(tournament_game_id)
  end

end
