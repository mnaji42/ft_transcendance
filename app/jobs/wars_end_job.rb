class WarsEndJob < ApplicationJob
  queue_as :default
  sidekiq_options retry: 0

  def perform(war_id)
    ActiveRecord::Base.transaction do
      war = War.find_by(id: war_id)
      return unless war
      
      guild1 = Guild.find(war.guild1_id)
      guild2 = Guild.find(war.guild2_id)

      guild1.history_wars_id.push war_id
      guild2.history_wars_id.push war_id

      guild1.actual_war_id = nil
      guild2.actual_war_id = nil

      has_winner = war.guild1_points != war.guild2_points

      if has_winner then
        winner_guild = war.guild1_points > war.guild2_points ?
          guild1 : guild2
        loser_guild = war.guild1_points > war.guild2_points ?
          guild2 : guild1

        war.winner = winner_guild.name

        winner_guild.points += war.prize
        loser_guild.points -= war.prize
      end

      RankHelper.recalculate_guilds

      war.save!
      guild1.save!
      guild2.save!
    end
  end

end
