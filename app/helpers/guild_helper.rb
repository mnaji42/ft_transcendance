module GuildHelper
  def GuildHelper.delete(guild)
    ActiveRecord::Base.transaction do

      guild.members_id.each do |m_id|
        User.update(m_id, guild_id: nil, guild_anagram: nil)
      end

      if !guild.actual_war_id.nil?
        war = War.find(guild.actual_war_id)
        GuildHelper.lose_war(war, guild)
      end

      guild.wars_id.each do |war_id|
        war = War.find(war_id)

        if !war.pending
          GuildHelper.lose_war(war, guild)
        else
          war.delete
        end
      end

      guild.destroy
    end
  end

  def GuildHelper.lose_war(war, loser_guild)
    GuildHelper.win_lose_war(war, Guild.find(
      loser_guild.id == war.guild1_id ? war.guild2_id : war.guild1_id
    ), loser_guild)
  end

  def GuildHelper.win_war(war, winner_guild)
    GuildHelper.win_lose_war(war, winner_guild, Guild.find(
      winner_guild.id == war.guild1_id ? war.guild2_id : war.guild1_id
    ))
  end

  def GuildHelper.win_lose_war(war, winner_guild, loser_guild)
    ActiveRecord::Base.transaction do
      loser_guild.actual_war_id = nil
      loser_guild.history_wars_id.push war.id
      loser_guild.wars_id = loser_guild.wars_id - [war.id]
      loser_guild.points -= war.prize
      
      winner_guild.actual_war_id = nil
      winner_guild.history_wars_id.push war.id
      winner_guild.wars_id = winner_guild.wars_id - [war.id]
      winner_guild.points += war.prize

      war.winner = war.guild1_id == winner_guild.id ? 1 : 2
      war.end = Time.now

      loser_guild.save!
      winner_guild.save!
      war.save!

      RankHelper.recalculate_guilds
    end
  end
end
