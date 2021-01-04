class TournamentStartGames < ApplicationJob
  queue_as :default
  sidekiq_options retry: 0

  def perform(tournament_game_id)
    tournament_game = TournamentGame.find_by(id: tournament_game_id)
    return unless tournament_game
    game_users = tournament_game.tournament_game_users
      .where(eliminated: false)
      .order(:pos_y)

    n_games = [4, 2, 1][tournament_game.round]
    pairs = (0..n_games-1).map do |i| [game_users[i * 2], game_users[i * 2 + 1]] end

    games = pairs.map do |(p1, p2)|
      # Create game!
      play = Game.create(
        :player1_id => p1.user_id,
        :player2_id => p2.user_id,
        :game_mode => :tournament,
        :max_score => tournament_game.tournament.max_score,
        :status => :started,
        :bonus => tournament_game.tournament.bonus,
        :tournament_game_id => tournament_game_id,
      )
      play.save!
      GameHeartbeatJob.perform_later(play.id)
      { :id => play.id, :player_1 => p1, :player_2 => p2 }
    end

    message = {
      :notification => 'start_games',
      :games => games,
      :tournament_game => tournament_game,
      :tournament_game_users => tournament_game.tournament_game_users.order(:pos_y),
    }

    ActionCable.server.broadcast("tournament_#{tournament_game_id}", message)
  end

end
