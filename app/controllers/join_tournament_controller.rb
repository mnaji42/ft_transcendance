class JoinTournamentController < ApplicationController
  # POST /tournament_games/find
  def find
    game = TournamentGame.find_by(
      :tournament_id => params[:tournament_id],
      :status => :waiting,
    )

    unless game
      game = TournamentGame.create(
        :tournament_id => params[:tournament_id],
        :status => :waiting,
        :round => 0,
        :turn => 0,
        :user_count => 0,
      )
    end

    json_response({
      :tournament_game => game,
      :tournament_game_users => game.tournament_game_users,
    })
  end

  # POST /tournament_games/join
  def join

    game = ActiveRecord::Base.transaction do

      game = TournamentGame.find(params[:game_id])

      if game.user_count >= 8 then
          json_response({ :error => 'Tournament is full!' }, :bad_request)
          return
      end

      if game && current_user.tournament_games.include?(game) then
        json_response({ :error => 'You are already in that tournament!' }, :bad_request)
        return
      end

      game.user_count += 1
      TournamentGameUser.create(
        user_id: current_user.id,
        tournament_game_id: game.id,
        pos_x: 1,
        pos_y: game.user_count,
        eliminated: false,
      )

      game_users = game.tournament_game_users.order(:pos_y)
  
      i = 1
      game_users.each do |u|
        u.pos_x = 1
        u.pos_y = i
        i += 1
        u.save!
      end

      if game.user_count == 8
        game.status = :started
        # Schedule start of tournament
        StartTournamentGame.perform_later game.id
      end
      game.save!

      game
    end

    data = {
      :notification => 'user_joined',
      :tournament_game => game,
      :tournament_game_users => game.tournament_game_users,
    }
    ActionCable.server.broadcast("tournament_#{game.id}", data)
    json_response data
  end

  # GET /tournament_games/joined
  def joined
    json_response :tournament_games => current_user.tournament_games
  end

  # POST /tournament_games/leave
  def leave
    # Sender wants to leave the tournament
    TournamentHelper.leave current_user

    json_response :ok => true
  end

end
