class WarsMatchmakingJob < ApplicationJob
  queue_as :default
  sidekiq_options retry: 0

  def perform(matchmaking_id, round)
    ActiveRecord::Base.transaction do
      wm = WarsWaitingMatch.find_by(id: matchmaking_id)
      return unless wm

      found = WarsWaitingMatch.find_by(:defied_guild_id => wm.guild_id)

      if found then
        game = WarHelper.launch_game(wm.user_id, found.user_id, War.find(found.guild.actual_war_id))

        p 'Found someone searching a match!'

        ActionCable.server.broadcast("wars_matchmaking_#{wm.id}", { :found => true, :game => game })
        ActionCable.server.broadcast("wars_matchmaking_#{found.id}", { :found => true, :game => game })
        found.delete
        wm.delete
      else

        p(guild_id: wm.defied_guild_id, status: :online)

        found = User.where(guild_id: wm.defied_guild_id, status: :online)
          .order('random()').first

        if found then
          request = WarDefyRequest.create(
            wars_waiting_match_id: matchmaking_id,
            user_id: found.id,
            defier_id: wm.user_id,
          )
          request.save!
      
          ActionCable.server.broadcast "notifications_#{found.id}", {
            :notification => "war_defy",
            :request => request,
            :user => wm.user,
          }

          p 'Sending defy to someone!'

          # will check 20 seconds later if player did not respond
          WarsDefyNoResponse.set(wait: 20.seconds).perform_later request.id, matchmaking_id
        else
          p 'No response! round=' + round.to_s
          if round == 10
            # no response!
            WarHelper.no_response(wm.guild_id, War.find(wm.guild.actual_war_id))

            wm.delete
            ActionCable.server.broadcast("wars_matchmaking_#{wm.id}", { :found => false })
          else
            WarsMatchmakingJob.set(wait: 3.seconds).perform_later matchmaking_id, round + 1
          end
        end
      end
    end
  end

end
