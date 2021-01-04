class DefyController < ApplicationController

  # POST /defy/new
  def new
    user = User.find(params[:user_id])

    request = DefyRequest.create(
      user_id: user.id,
      defier_id: current_user.id,
      bonus: params[:bonus] || :BonusDefault,
      map: params[:map],
    )
    request.save!

    ActionCable.server.broadcast "notifications_#{user.id}", {
      :notification => "defy",
      :request => request,
      :user => current_user,
    }
  end

  # POST /defy/accept
  def accept
    defy = DefyRequest.find(params[:defy_id])

    if current_user.id != defy.user_id
      json_response({ :error => 'Cannot accept this defy' }, :forbidden)
      return
    end

    defy.delete

    game = Game.create(
      :player1_id => current_user.id,
      :player2_id => defy.defier_id,
      :game_mode => :duel,
      :max_score => 5,
      :status => :started,
      :bonus => defy.bonus,
    )
    game.save!
    GameHeartbeatJob.set(wait: 1.second).perform_later game.id

    ActionCable.server.broadcast "notifications_#{defy.defier_id}", {
      :notification => "defy_accept",
      :game => game,
      :map => defy.map,
    }
    ActionCable.server.broadcast "notifications_#{current_user.id}", {
      :notification => "defy_accept",
      :game => game,
    }

    json_response game
  end

  # POST /war_defy/accept
  def war_accept
    ActiveRecord::Base.transaction do
      defy = WarDefyRequest.find(params[:defy_id])

      if current_user.id != defy.user_id
        json_response({ :error => 'Cannot accept this defy' }, :forbidden)
        return
      end

      defy.wars_waiting_match.delete
      defy.delete

      war = War.find(current_user.guild.actual_war_id)
      game = WarHelper.launch_game(current_user.id, defy.defier_id, war)

      ActionCable.server.broadcast "notifications_#{defy.defier_id}", {
        :notification => "war_defy_accept",
        :game => game,
      }
      ActionCable.server.broadcast "notifications_#{current_user.id}", {
        :notification => "war_defy_accept",
        :game => game,
      }

      json_response game
    end
  end

end
