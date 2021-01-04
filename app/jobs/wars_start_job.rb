class WarsStartJob < ApplicationJob
  queue_as :default
  sidekiq_options retry: 0

  def perform(war_id)
    ActiveRecord::Base.transaction do
      war = War.find_by(id: war_id)
      return unless war
    
      guild1 = Guild.find(war.guild1_id)
      guild2 = Guild.find(war.guild2_id)
      
      if war.pending then
        war.delete
      else
        guild1.actual_war_id = war_id
        guild2.actual_war_id = war_id
      end

      guild1.wars_id = guild1.wars_id - [war_id]
      guild2.wars_id = guild2.wars_id - [war_id]

      guild1.save!
      guild2.save!
    end
  end

end
