class WarsChannel < ApplicationCable::Channel
  # Someone started listening to the channel
  def subscribed
    if current_user.guild.actual_war_id.nil?
      reject
      return
    end

    ActiveRecord::Base.transaction do
      war = War.find(current_user.guild.actual_war_id)

      other_guild_id = war.guild1_id == current_user.guild_id ? war.guild2_id : war.guild1_id
      other_guild = Guild.find(other_guild_id)

      already_war = current_user.guild.members_id.any? do |t|
        game_id = User.find(t).current_game_id
        next false if !game_id
        game = Game.find(game_id)
        next game.game_mode == 'war'
      end

      p already_war

      already_war = already_war || WarsWaitingMatch.where(guild_id: current_user.guild_id, defied_guild_id: other_guild_id).any?

      p already_war
      if already_war
        reject
        return
      end

      @wm = WarsWaitingMatch.create(
        user_id: current_user.id,
        guild_id: current_user.guild_id,
        defied_guild_id: other_guild_id,
      )
      @wm.save!

    end
    stream_from "wars_matchmaking_#{@wm.id}"

    WarsMatchmakingJob.set(wait: 1.second).perform_later @wm.id, 0
  end

  def unsubscribed
    @wm.delete if @wm
  end
end
