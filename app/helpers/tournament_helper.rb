module TournamentHelper
  def TournamentHelper.leave(user)

    tournament_game, tournament_user, winner = ActiveRecord::Base.transaction do

      tournament_user = TournamentGameUser.find_by(user_id: user.id)
      return if !tournament_user
      tournament_game = tournament_user.tournament_game
      return if !tournament_game
      winner = nil

      if tournament_game.status == 'waiting' then

        p tournament_game, tournament_user

        tournament_game.user_count -= 1
        tournament_game.save!
        tournament_user.delete

        data = {
          :notification => 'user_left',
          :tournament_game => tournament_game,
          :tournament_game_users => tournament_game.tournament_game_users,
          :user => user,
        }

        ActionCable.server.broadcast("tournament_#{tournament_game.id}", data)

        return
      end

      tournament_user.eliminated = true
      tournament_user.eliminated_at_round = tournament_game.round
      tournament_user.save!

      game = tournament_game.games
        .where('player1_id = ? or player2_id = ?', user.id, user.id)
        .where(status: :started)
        .first

      if game then
        winner_id = game.player1_id == user.id ? game.player2_id : game.player1_id
        winner = tournament_game.tournament_game_users.find_by(user_id: winner_id)
      end

      [tournament_game, tournament_user, winner]
    end

    data = {
      :notification => 'user_left',
      :tournament_game => tournament_game,
      :tournament_game_users => tournament_game.tournament_game_users,
      :user => user,
      :winner => winner,
      :loser => tournament_user,
    }

    ActionCable.server.broadcast("tournament_#{tournament_game.id}", data)

  end
end