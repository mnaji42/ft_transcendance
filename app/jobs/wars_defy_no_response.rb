class WarsDefyNoResponse < ApplicationJob
  queue_as :default
  sidekiq_options retry: 0

  def perform(defy_id, matchmaking_id)
    ActiveRecord::Base.transaction do
      wm = WarsWaitingMatch.find_by(id: matchmaking_id)
      defy = WarDefyRequest.find_by(id: defy_id)
      return unless wm && defy

      puts 'No response!'

      # no response!
      WarHelper.no_response(wm.guild_id, War.find(wm.guild.actual_war_id))

      wm.delete
      defy.delete

      ActionCable.server.broadcast("wars_matchmaking_#{wm.id}", { :found => false })
    end
  end

end
