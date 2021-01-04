module WarHelper
  def WarHelper.launch_game(player1_id, player2_id, war)
    game = Game.create(
      :player1_id => player1_id,
      :player2_id => player2_id,
      :game_mode => :war,
      :max_score => war.maxScore,
      :status => :started,
      :bonus => war.bonus,
    )
    game.save!
    GameHeartbeatJob.set(wait: 1.second).perform_later game.id

    return game
  end

  def WarHelper.no_response(defier_guild_id, war)
    if war.matchs_without_response <= war.matchs_max_without_response
      war.matchs_without_response += 1
      if defier_guild_id == war.guild1_id
        war.guild1_points += 1
      else
        war.guild2_points += 1
      end
      war.save!
    end
  end
end
